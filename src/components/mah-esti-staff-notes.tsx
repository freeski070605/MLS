'use client';
import {useState} from 'react';
import {estheticianFields} from '@/lib/mah-esti-intake';

export default function EstheticianNotes({id,initial,status:existing}:{id:string;initial:Record<string,string>;status:string}){
 const [notes,setNotes]=useState(initial),[status,setStatus]=useState(existing),[saving,setSaving]=useState(false),[message,setMessage]=useState('');
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();setSaving(true);setMessage('');
  try{
   const response=await fetch('/api/mah-esti-intake/staff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,notes,status})});
   if(!response.ok)throw Error('Could not save notes.');
   setMessage('Private treatment notes saved.');
  }catch{setMessage('Unable to save notes. Please try again.')}finally{setSaving(false)}
 }
 return <form onSubmit={submit} className="intake-staff-form">
  <p className="eyebrow">11 | Esthetician use only — skin analysis & service notes</p>
  <p>These notes are encrypted and visible only to authorized staff.</p>
  <div className="intake-question"><label htmlFor="intake-staff-status">Consultation status</label><select id="intake-staff-status" value={status} onChange={e=>setStatus(e.target.value)}><option value="new">New</option><option value="reviewed">Reviewed</option><option value="follow-up">Follow-up needed</option><option value="completed">Completed</option></select></div>
  {estheticianFields.map(field=><div className="intake-question" key={field.key}>
   <label htmlFor={'staff-'+field.key}>{field.label}</label>
   {field.type==='textarea'?<textarea id={'staff-'+field.key} rows={3} maxLength={2000} value={notes[field.key]||''} onChange={e=>setNotes({...notes,[field.key]:e.target.value})}/>:
   field.type==='radio'?<select id={'staff-'+field.key} value={notes[field.key]||''} onChange={e=>setNotes({...notes,[field.key]:e.target.value})}><option value="">Select a decision</option>{field.options?.map(o=><option key={o} value={o}>{o}</option>)}</select>:
   <input id={'staff-'+field.key} type={field.type==='date'?'date':'text'} maxLength={2000} value={notes[field.key]||''} onChange={e=>setNotes({...notes,[field.key]:e.target.value})}/>}
  </div>)}
  {message&&<p role="status">{message}</p>}
  <button type="submit" className="button button-dark" disabled={saving}>{saving?'Saving…':'Save private treatment notes ↗'}</button>
 </form>;
}
