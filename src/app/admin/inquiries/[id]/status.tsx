'use client';
import {useState} from 'react';

export default function InquiryStatus({id,initialStatus}:{id:string;initialStatus:string}){
 const [status,setStatus]=useState(initialStatus);
 const [saved,setSaved]=useState(initialStatus);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 async function save(){
  setBusy(true);setError('');
  try{
   const response=await fetch('/api/admin/inquiries',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,data:{status}})});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||'Unable to update inquiry');
   setSaved(status);
  }catch(e){setError(e instanceof Error?e.message:'Unable to update inquiry')}finally{setBusy(false)}
 }
 return <div className="stack">
  <label className="field">Inquiry status
   <select value={status} onChange={e=>setStatus(e.target.value)}>
    <option value="new">New</option>
    <option value="open">In progress</option>
    <option value="resolved">Resolved</option>
   </select>
  </label>
  <div className="actions"><button type="button" className="button button-dark" disabled={busy||status===saved} onClick={save}>{busy?'Saving…':'Save status'}</button></div>
  {error&&<p role="alert" className="notice">{error}</p>}
  {!error&&status===saved&&<p className="muted">Current status: {saved==='open'?'In progress':saved==='resolved'?'Resolved':'New'}</p>}
 </div>;
}
