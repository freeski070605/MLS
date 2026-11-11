'use client';

import {useState} from 'react';
import {Question} from '@/components/mah-esti-intake-form';
import {waxingSections,waxingAcknowledgments,waxingConsent,waxingClearanceText} from '@/lib/mah-esti-waxing';

type Answers=Record<string,string|string[]>;
const steps=7; // Sections 01–05, 06 safety consent, then 07 comfort
export default function MahEstiWaxingForm({configured}:{configured:boolean}){
 const [step,setStep]=useState(0);
 const [answers,setAnswers]=useState<Answers>({});
 const [ack,setAck]=useState<boolean[]>([false,false,false]);
 const [signature,setSignature]=useState('');
 const [accepted,setAccepted]=useState(false);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[receipt,setReceipt]=useState('');
 const section=step===6?waxingSections[5]:step===5?undefined:waxingSections[step];
 const update=(key:string,value:string|string[])=>setAnswers(prev=>({...prev,[key]:value}));
 function next(){
  setError('');
  if(section){
   for(const f of section.fields.filter(field=>field.required)){
    const value=answers[f.key];
    if(!value||(Array.isArray(value)?value.length===0:!value.trim())){setError('Please complete: '+f.label);return}
   }
   if(step===4&&answers.urgentConcern==='Yes'&&!String(answers.urgentConcernDetails||'').trim()){
    setError('Please explain the health concern so Shante can review it safely. Do not wait for this consultation if you need urgent medical care.');return
   }
  }
  if(step===5&&(!ack.every(Boolean)||!accepted||signature.trim().length<2)){setError('Please confirm all safety statements, accept the consent and sign with your full name.');return}
  setStep(n=>Math.min(n+1,steps-1));
 }
 async function submit(){
  if(!configured){setError('The confidential intake portal is not enabled yet.');return}
  if(!ack.every(Boolean)||!accepted||signature.trim().length<2){
   setError('Please read and confirm all three safety statements, accept the consent, and sign with your full name.');return
  }
  setBusy(true);setError('');
  try{
   const response=await fetch('/api/mah-esti-intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:'waxing',answers,signature,accepted,acknowledgments:ack,service:'Waxing consultation'})});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||'Unable to securely save your consultation.');
   setReceipt(result.reference||'Received');setAnswers({});setAck([false,false,false]);setSignature('');setAccepted(false);
  }catch(e){setError(e instanceof Error?e.message:'Unable to submit consultation.')}finally{setBusy(false)}
 }
 if(receipt)return <div className="intake-confirmation" role="status"><p className="eyebrow">MAH ESTI / waxing intake</p><h3>Consultation received.</h3><p>Reference: <strong>{receipt}</strong></p><p>Your esthetician will review the information privately. Submitting does not guarantee treatment clearance or reserve an appointment.</p></div>;
 return <div className="intake-form">
  {!configured&&<p className="intake-warning" role="status">The confidential consultation portal is being configured. You may review the form, but secure submissions are not yet enabled.</p>}
  <div className="intake-progress"><span>{String(step+1).padStart(2,'0')} / {String(steps).padStart(2,'0')}</span><div className="intake-meter"><i style={{width:((step+1)/steps*100)+'%'}}/></div></div>
  {section?<div key={step}>
    <p className="eyebrow">MAH ESTI / waxing consultation &amp; intake</p><h3>{section.title}</h3>
    {section.lead&&<p className="intake-lead">{section.lead}</p>}
    {section.fields.map(field=><Question key={field.key} field={field} value={answers[field.key]} onChange={value=>update(field.key,value)}/>)}
  </div>:<div>
    <p className="eyebrow">06 | Treatment clearance &amp; safety</p><h3>Review, acknowledge &amp; sign.</h3>
    <div className="intake-consent"><p>{waxingClearanceText}</p></div>
    <p className="intake-lead">Before service, please confirm each statement:</p>
    {waxingAcknowledgments.map((text,i)=><label className="intake-option intake-accept" key={text}><input type="checkbox" checked={ack[i]} onChange={e=>setAck(existing=>existing.map((value,index)=>index===i?e.target.checked:value))}/>{text}</label>)}
    <div className="intake-consent"><p>{waxingConsent}</p></div>
    <label className="intake-option intake-accept"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/>I acknowledge the proposed waxing service, its risks, and my right to stop the service at any time.</label>
    <div className="intake-question"><label htmlFor="waxing-signature">Client signature (type full legal name) *</label><input id="waxing-signature" autoComplete="name" maxLength={150} value={signature} onChange={e=>setSignature(e.target.value)}/></div>
    <p className="intake-lead">Section 08 — Esthetician use only: treatment clearance will be documented privately after your consultation.</p>
  </div>}
  {error&&<p className="notice intake-error" role="alert">{error}</p>}
  <div className="intake-actions"><button type="button" className="button button-outline" disabled={step===0||busy} onClick={()=>{setStep(n=>n-1);setError('')}}>Back</button>
   {step<steps-1?<button type="button" className="button button-dark" onClick={next}>Continue ↗</button>:<button type="button" className="button button-dark" disabled={!configured||busy} onClick={submit}>{busy?'Sending securely…':'Submit confidential waxing intake ↗'}</button>}
  </div>
  <p className="intake-privacy">Answers are used to assess waxing suitability and your comfort. Sensitive information is encrypted before storage and restricted to authorized studio staff. Treatment is always subject to your esthetician&apos;s assessment.</p>
 </div>;
}
