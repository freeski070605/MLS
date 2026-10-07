import { db } from './db';
const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]||char));
export async function queueNotification(event:string,recipient:string,appointmentId?:string,variables:Record<string,string>={}) {
  const template=await db.notificationTemplate.findUnique({where:{event_channel:{event,channel:'email'}}});
  const configured=!!process.env.RESEND_API_KEY && !!process.env.EMAIL_FROM;
  const status=template?.active && configured?'queued':'preview';
  await db.notificationLog.create({data:{event,channel:'email',recipient,appointmentId,status,details:{variables}}});
  if(status==='queued') {
    const body=(template?.body||'').replace(/\{\{(\w+)\}\}/g,(_,key:string)=>escapeHtml(variables[key]||''));
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.EMAIL_FROM,to:recipient,subject:template?.subject||'MahLovely Studio',html:body})});
    await db.notificationLog.updateMany({where:{event,recipient,appointmentId,status:'queued'},data:{status:response.ok?'sent':'failed'}});
  }
}
