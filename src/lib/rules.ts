import { setting } from './site';
export type BookingRules={allowSelfServiceCancel:boolean;allowSelfServiceReschedule:boolean;cancelBeforeHours:number;rescheduleBeforeHours:number};
export async function bookingRules(){return setting<BookingRules>('bookingRules',{allowSelfServiceCancel:false,allowSelfServiceReschedule:false,cancelBeforeHours:0,rescheduleBeforeHours:0})}
export function withinRule(startAt:Date,hours:number){return startAt.getTime()-Date.now()>=hours*3600000}
