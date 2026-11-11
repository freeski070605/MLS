'use client';
import { useState } from 'react';

type Kind='ke-consultation'|'titi-booking';
export default function ArtistRequestForm({kind,services,initialService}:{kind:Kind;services:string[];initialService?:string}){
 const isKe=kind==='ke-consultation';
 const [busy,setBusy]=useState(false);
 const [sent,setSent]=useState(false);
 const [error,setError]=useState('');
 const [selected,setSelected]=useState(initialService||'');
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;
  setBusy(true);setError('');
  const form=event.currentTarget;
  const data=Object.fromEntries(new FormData(form).entries());
  try{
   const response=await fetch('/api/artist-requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,kind})});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||'Your request could not be sent.');
   setSent(true);form.reset();
  }catch(err){setError(err instanceof Error?err.message:'Please try again.')}finally{setBusy(false)}
 }
 if(sent)return <div className="artist-request-success" role="status">
  <p className="eyebrow">Request received</p><h3>{isKe?'Your glow starts here.':'You’re one step closer.'}</h3>
  <p>Thanks! Your {isKe?'consultation':'booking'} request is in the MahLovely Studio admin inbox. Someone will need to review and confirm the details. No appointment or time slot has been reserved yet.</p>
  <button type="button" className="text-link" onClick={()=>{setSent(false);setSelected('')}}>Send another request ↗</button>
 </div>;
 return <form className="artist-request-form" onSubmit={submit}>
  <div className="artist-request-grid">
   <div className="field"><label htmlFor={kind+'-name'}>Full name *</label><input required minLength={2} maxLength={120} id={kind+'-name'} name="name" autoComplete="name" placeholder="Your name"/></div>
   <div className="field"><label htmlFor={kind+'-email'}>Email address *</label><input required type="email" id={kind+'-email'} name="email" autoComplete="email" placeholder="you@example.com"/></div>
   <div className="field"><label htmlFor={kind+'-phone'}>Phone number</label><input type="tel" id={kind+'-phone'} name="phone" maxLength={30} autoComplete="tel" placeholder="Best number to reach you"/></div>
   <div className="field"><label htmlFor={kind+'-service'}>{isKe?'What are you interested in?':'What would you like done?'} *</label><select required id={kind+'-service'} name="service" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Select a service</option>{services.map(s=><option key={s} value={s}>{s}</option>)}<option value="Not sure / Please advise">Not sure / Please advise</option></select></div>
   <div className="field"><label htmlFor={kind+'-date'}>Preferred date (optional)</label><input type="date" id={kind+'-date'} name="date" min={new Date().toISOString().slice(0,10)}/></div>
   <div className="field"><label htmlFor={kind+'-time'}>Preferred time (optional)</label><select id={kind+'-time'} name="time"><option value="">Flexible</option><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Evening">Evening</option></select></div>
   {isKe&&<div className="field full"><label htmlFor={kind+'-concerns'}>What would you like to work on? (optional)</label><textarea id={kind+'-concerns'} name="concerns" rows={3} maxLength={1500} placeholder="Tell Ke about your skin goals or the look you're considering. Please don't include private medical details."/></div>}
   <div className="field full"><label htmlFor={kind+'-notes'}>{isKe?'Anything else you want Ke to know?':'Describe your style, length, or other booking preferences'}</label><textarea id={kind+'-notes'} name="notes" rows={3} maxLength={1500} placeholder="Any helpful details?"/></div>
  </div>
  <div className="artist-request-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  <p className="artist-request-disclaimer">This is a {isKe?'consultation':'booking'} request—not a confirmed appointment. The studio will follow up about details, availability and next steps.</p>
  {error&&<p role="alert" className="notice">{error}</p>}
  <button className="button button-dark" disabled={busy} type="submit">{busy?'Sending…':isKe?'Request my consultation ↗':'Request my appointment ↗'}</button>
 </form>;
}
