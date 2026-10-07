import { DateTime } from 'luxon';
import { db } from './db';
import { Prisma, type DepositType } from '@prisma/client';

export const zone = process.env.BUSINESS_TIMEZONE || 'America/New_York';
const bookingSlotMinutes = 15;
const bookingSlotMilliseconds = bookingSlotMinutes * 60_000;

export function bookingSlotLockIds(artistId: string, startAt: Date, endAt: Date) {
  const ids: string[] = [];
  const firstSlot = Math.floor(startAt.getTime() / bookingSlotMilliseconds) * bookingSlotMilliseconds;
  for (let slot = firstSlot; slot < endAt.getTime(); slot += bookingSlotMilliseconds) {
    ids.push(`${artistId}:${slot}`);
  }
  return ids;
}

export async function acquireSlotLocks(tx: Prisma.TransactionClient, artistId: string, startAt: Date, endAt: Date, appointmentId: string) {
  for (const id of bookingSlotLockIds(artistId, startAt, endAt)) {
    try {
      await tx.bookingSlotLock.create({ data: { id, appointmentId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('This time has just been taken. Choose another.');
      }
      throw error;
    }
  }
}

export function depositAmount(type: DepositType, value: number | null, price: number | null) {
  if (type === 'NONE' || value == null || price == null) return 0;
  return type === 'FLAT' ? Math.min(value, price) : Math.round(price * Math.min(value,100) / 100);
}
export function appointmentMinutes(duration: number, before = 0, after = 0, optionMinutes = 0) { return duration + before + after + optionMinutes; }
export function localStart(date: string, time: string) {
  const dt = DateTime.fromISO(`${date}T${time}`, { zone });
  if (!dt.isValid || dt.toFormat('yyyy-MM-dd HH:mm') !== `${date} ${time}`) throw new Error('Invalid appointment time');
  return dt;
}
export async function slots(serviceId: string, artistId: string, date: string, optionMinutes=0, excludeAppointmentId?: string) {
  const service=await db.service.findUnique({where:{id:serviceId},include:{artists:true}});
  const artist=await db.artist.findUnique({where:{id:artistId}});
  if(!service?.active || !service.bookingEnabled || !service.durationMinutes || !service.artists.some(a=>a.artistId===artistId)||!artist?.active||!artist.bookingEnabled) return [];
  const day=DateTime.fromISO(date,{zone}); if(!day.isValid || day.startOf('day') < DateTime.now().setZone(zone).startOf('day')) return [];
  const allRanges=await db.availability.findMany({where:{artistId,weekday:day.weekday % 7,OR:[{date},{date:null}]}});
  const overrides=allRanges.filter(r=>r.date===date);
  const ranges=(overrides.length?overrides:allRanges.filter(r=>r.date===null)).filter(r=>(!r.effectiveFrom||r.effectiveFrom<=day.toJSDate())&&(!r.effectiveTo||r.effectiveTo>=day.toJSDate()));
  const dayStart=day.startOf('day').toUTC().toJSDate(), dayEnd=day.endOf('day').toUTC().toJSDate();
  const [appointments,blocks]=await Promise.all([
    db.appointment.findMany({where:{artistId,...(excludeAppointmentId?{id:{not:excludeAppointmentId}}:{}),status:{in:['PENDING','CONFIRMED']},reservedStartAt:{lt:dayEnd},reservedEndAt:{gt:dayStart}}}),
    db.blockedTime.findMany({where:{artistId,startAt:{lt:dayEnd},endAt:{gt:dayStart}}})
  ]);
  const length=appointmentMinutes(service.durationMinutes,service.bufferBefore,service.bufferAfter,optionMinutes);
  const result:string[]=[];
  for(const range of ranges){
    for(let minute=range.startMinute;minute+length<=range.endMinute;minute+=15){
      const local=day.startOf('day').plus({minutes:minute});
      if(local < DateTime.now().setZone(zone).plus({minutes:30})) continue;
      const start=local.minus({minutes:service.bufferBefore}).toUTC().toJSDate();
      const end=local.plus({minutes:service.durationMinutes+service.bufferAfter+optionMinutes}).toUTC().toJSDate();
      if(appointments.some(item=>item.reservedStartAt<end && item.reservedEndAt>start)||blocks.some(item=>item.startAt<end && item.endAt>start)) continue;
      result.push(local.toFormat('HH:mm'));
    }
  }
  return [...new Set(result)].sort();
}
export async function reserve(input:{serviceId:string;artistId:string;date:string;time:string;name:string;email:string;phone?:string;notes?:string;acceptedPolicyVersionId?:string;optionIds?:string[]}) {
  const local=localStart(input.date,input.time);
  const service=await db.service.findUnique({where:{id:input.serviceId},include:{artists:true,options:true}});
  if(!service?.active || !service.bookingEnabled || !service.durationMinutes || !service.artists.some(a=>a.artistId===input.artistId)) throw new Error('Service unavailable');
  const selected=service.options.filter(o=>input.optionIds?.includes(o.id) && o.active);
  if ((input.optionIds?.length||0)!==selected.length) throw new Error('Invalid service option');
  if (service.options.some(o=>o.active&&o.required&&!selected.some(selectedOption=>selectedOption.id===o.id))) throw new Error('A required service option is missing');
  const startAt=local.toUTC().toJSDate();
  const endAt=local.plus({minutes:service.durationMinutes+selected.reduce((n,o)=>n+o.durationDelta,0)}).toUTC().toJSDate();
  const blockedStart=local.minus({minutes:service.bufferBefore}).toUTC().toJSDate();
  const blockedEnd=local.plus({minutes:appointmentMinutes(service.durationMinutes,0,service.bufferAfter,selected.reduce((n,o)=>n+o.durationDelta,0))}).toUTC().toJSDate();
  const price=service.priceMin==null?null:service.priceMin+selected.reduce((n,o)=>n+o.priceDelta,0);
  const deposit=depositAmount(service.depositType,service.depositValue,price);
  return db.$transaction(async(tx)=>{
    const free=await slots(input.serviceId,input.artistId,input.date,selected.reduce((n,o)=>n+o.durationDelta,0));
    if(!free.includes(input.time)) throw new Error('This time has just been taken. Choose another.');
    const overlapping=await tx.appointment.count({where:{artistId:input.artistId,status:{in:['PENDING','CONFIRMED']},reservedStartAt:{lt:blockedEnd},reservedEndAt:{gt:blockedStart}}});
    const blocked=await tx.blockedTime.count({where:{artistId:input.artistId,startAt:{lt:blockedEnd},endAt:{gt:blockedStart}}});
    if(overlapping || blocked) throw new Error('This time has just been taken. Choose another.');
    const client=await tx.client.upsert({where:{email:input.email},create:{name:input.name,email:input.email,phone:input.phone},update:{name:input.name,phone:input.phone}});
    const reference=`ML-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
    const appointment=await tx.appointment.create({data:{reference,clientId:client.id,artistId:input.artistId,serviceId:input.serviceId,startAt,endAt,reservedStartAt:blockedStart,reservedEndAt:blockedEnd,priceEstimate:price,depositDue:deposit,balanceEstimate:price==null?null:price-deposit,optionSnapshot:selected.map(o=>({id:o.id,name:o.name,priceDelta:o.priceDelta,durationDelta:o.durationDelta})) as Prisma.InputJsonValue,notes:input.notes,policyVersionId:input.acceptedPolicyVersionId,acceptedAt:input.acceptedPolicyVersionId?new Date():null,paymentStatus:deposit?'PENDING':'NOT_REQUIRED',status:deposit?'PENDING':'CONFIRMED',history:{create:{action:'created'}}}});
    await acquireSlotLocks(tx,input.artistId,blockedStart,blockedEnd,appointment.id);
    return appointment;
  });
}
export async function rescheduleAppointment(appointmentId:string,date:string,time:string,actorId:string){
  const appointment=await db.appointment.findUnique({where:{id:appointmentId},include:{service:true}});
  if(!appointment||!['PENDING','CONFIRMED'].includes(appointment.status))throw new Error('Appointment cannot be rescheduled');
  const local=localStart(date,time);
  const duration=Math.round((appointment.endAt.getTime()-appointment.startAt.getTime())/60000);
  const startAt=local.toUTC().toJSDate(),endAt=local.plus({minutes:duration}).toUTC().toJSDate();
  const reservedStartAt=local.minus({minutes:appointment.service.bufferBefore}).toUTC().toJSDate();
  const reservedEndAt=local.plus({minutes:duration+appointment.service.bufferAfter}).toUTC().toJSDate();
  const optionMinutes=duration-(appointment.service.durationMinutes||duration);
  return db.$transaction(async tx=>{
    const available=await slots(appointment.serviceId,appointment.artistId,date,optionMinutes,appointmentId);
    if(!available.includes(time))throw new Error('This time is unavailable');
    const conflict=await tx.appointment.count({where:{artistId:appointment.artistId,id:{not:appointmentId},status:{in:['PENDING','CONFIRMED']},reservedStartAt:{lt:reservedEndAt},reservedEndAt:{gt:reservedStartAt}}});
    if(conflict)throw new Error('This time has just been taken');
    await tx.bookingSlotLock.deleteMany({where:{appointmentId}});
    await acquireSlotLocks(tx,appointment.artistId,reservedStartAt,reservedEndAt,appointmentId);
    return tx.appointment.update({where:{id:appointmentId},data:{startAt,endAt,reservedStartAt,reservedEndAt,history:{create:{action:'rescheduled',actorId,details:{from:appointment.startAt.toISOString(),to:startAt.toISOString()}}}}});
  });
}
