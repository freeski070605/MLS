import { NextRequest,NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { safeOrigin,limit,errorResponse } from '@/lib/http';

const schema=z.object({
  kind:z.enum(['ke-consultation','titi-booking']),
  name:z.string().trim().min(2).max(120),
  email:z.string().trim().email().max(200),
  phone:z.string().trim().max(30).optional().default(''),
  service:z.string().trim().min(2).max(160),
  date:z.string().max(10).optional().default(''),
  time:z.string().max(30).optional().default(''),
  concerns:z.string().trim().max(1500).optional().default(''),
  notes:z.string().trim().max(1500).optional().default(''),
  website:z.string().optional().default('')
});

export async function POST(req:NextRequest){
  if(!safeOrigin(req))return errorResponse('Invalid origin',403);
  try{
    if(!await limit(req,'artist-request',5,60))return errorResponse('Too many requests. Please try again later.',429);
    const data=schema.parse(await req.json());
    if(data.kind==='ke-consultation')return errorResponse('Please use the secure MAH ESTI facial consultation at /mah-esti#consultation',400);
    if(data.website)return NextResponse.json({ok:true});
    // A request is never an appointment or a confirmation of an available time.
    const subject=data.kind==='ke-consultation'?'MAH ESTI consultation request — Shante':'Titi booking request — Cee';
    const message=[
      `Artist: ${data.kind==='ke-consultation'?'Shante (Ke)':'Cee (Titi)'}`,
      `Service of interest: ${data.service}`,
      data.date?`Preferred date: ${data.date}`:null,
      data.time?`Preferred time: ${data.time}`:null,
      data.concerns?`Goals / concerns: ${data.concerns}`:null,
      data.notes?`Other details: ${data.notes}`:null,
      'Status: Request only — no appointment has been confirmed.'
    ].filter(Boolean).join('\n');
    await db.inquiry.create({data:{name:data.name,email:data.email,phone:data.phone||null,subject,message}});
    return NextResponse.json({ok:true});
  }catch(e){
    return errorResponse(e,e instanceof z.ZodError?400:503);
  }
}
