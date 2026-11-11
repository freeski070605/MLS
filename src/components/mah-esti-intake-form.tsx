'use client';

import {useState} from 'react';
import {intakeSections,consentText,type IntakeField} from '@/lib/mah-esti-intake';

type Answers=Record<string,string|string[]>;
const saveText=(value:string)=>value.slice(0,2000);
export function Question({field,value,onChange}:{field:IntakeField;value:string|string[]|undefined;onChange:(v:string|string[])=>void}){
 const id='intake-'+field.key;
 if(field.type==='checks')return <fieldset className="intake-question">
   <legend>{field.label}{field.required?' *':''}</legend>
   <div className="intake-options">{(field.options||[]).map(option=><label className="intake-option" key={option}><input type="checkbox" checked={Array.isArray(value)&&value.includes(option)} onChange={e=>{
    const current=Array.isArray(value)?value:[];
    const next=e.target.checked?[...current,option]:current.filter(item=>item!==option);
    onChange(option==='None'||option==='None known'||option==='None of the above'?e.target.checked?[option]:next:next.filter(item=>!['None','None known','None of the above'].includes(item)));
   }}/>{option}</label>)}</div>
 </fieldset>;
 if(field.type==='radio')return <fieldset className="intake-question">
   <legend>{field.label}{field.required?' *':''}</legend><div className="intake-options">{(field.options||[]).map(option=><label className="intake-option" key={option}><input type="radio" name={id} checked={value===option} onChange={()=>onChange(option)}/>{option}</label>)}</div>
 </fieldset>;
 if(field.type==='scale')return <div className="intake-question"><label htmlFor={id}>{field.label}</label><select id={id} value={typeof value==='string'?value:''} onChange={e=>onChange(e.target.value)}><option value="">Select a number</option>{Array.from({length:10},(_,i)=>i+1).map(n=><option value={n} key={n}>{n}</option>)}</select></div>;
 return <div className="intake-question">
  <label htmlFor={id}>{field.label}{field.required?' *':''}</label>
  {field.type==='textarea'?<textarea id={id} rows={3} maxLength={2000} value={typeof value==='string'?value:''} onChange={e=>onChange(saveText(e.target.value))}/>:
  <input id={id} type={field.type} required={field.required} maxLength={field.type==='date'?undefined:300} value={typeof value==='string'?value:''} onChange={e=>onChange(e.target.value)} autoComplete={field.key==='fullName'?'name':field.key==='email'?'email':field.key==='phone'?'tel':'off'}/>}
 </div>;
}

export default function MahEstiIntakeForm({configured,service}:{configured:boolean;service?:string}){
 const [step,setStep]=useState(0),[answers,setAnswers]=useState<Answers>({consultationDate:new Date().toISOString().slice(0,10)}),[signature,setSignature]=useState(''),[initials,setInitials]=useState(''),[accepted,setAccepted]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[receipt,setReceipt]=useState('');
 const total=intakeSections.length+1;
 const change=(key:string,value:string|string[])=>setAnswers(current=>({...current,[key]:value}));
 const section=intakeSections[step];
 const next=()=>{
  setError('');
  if(section){
   for(const field of section.fields.filter(f=>f.required)){
    const value=answers[field.key];
    if(typeof value!=='string'||!value.trim())return setError('Please complete: '+field.label);
   }
   if(step===7&&answers.emergencySymptoms==='Yes')return setError('Do not proceed with treatment. Seek immediate medical care; call 911 for an emergency. Please contact the studio after your condition has been assessed.');
  }
  setStep(n=>Math.min(n+1,total-1));
 };
 async function submit(){
  if(!configured)return setError('The confidential consultation portal is not yet enabled. Please contact MAH ESTI.');
  if(!accepted||!signature.trim()||!initials.trim())return setError('Read and accept the acknowledgment, type your signature, and enter your health/safety initials.');
  if(answers.emergencySymptoms!=='No')return setError('Please complete the emergency symptom screening.');
  setBusy(true);setError('');
  try{
   const r=await fetch('/api/mah-esti-intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers,signature,initials,accepted,service:service||''})});
   const result=await r.json();
   if(!r.ok)throw new Error(result.error||'The consultation could not be submitted.');
   setReceipt(result.reference||'Received');
   setAnswers({});setSignature('');setInitials('');setAccepted(false);
  }catch(e){setError(e instanceof Error?e.message:'Could not submit. Please try again.')}finally{setBusy(false)}
 }
 if(receipt)return <section className="intake-confirmation" role="status"><p className="eyebrow">MAH ESTI / confidential intake</p><h3>Your consultation was received.</h3><p>Your reference: <strong>{receipt}</strong></p><p>Ke will review your responses privately. This is an intake, not a confirmed appointment or approval for treatment.</p></section>;
 return <div className="intake-form">
  {!configured&&<p className="intake-warning" role="status">The confidential intake system is being configured. You can review the questions, but submission is not available until secure storage is enabled.</p>}
  <div className="intake-progress"><span>{String(step+1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span><div className="intake-meter"><i style={{width:((step+1)/total*100)+'%'}}/></div></div>
  {section?<div key={step}><p className="eyebrow">Confidential client record</p><h3>{section.title}</h3>{section.lead&&<p className="intake-lead">{section.lead}</p>}
   {section.fields.map(field=><Question key={field.key} field={field} value={answers[field.key]} onChange={value=>change(field.key,value)}/>)}
  </div>:<div><p className="eyebrow">10 | Client acknowledgment & consent</p><h3>Your acknowledgment.</h3><div className="intake-consent">{consentText.split('\n\n').map(p=><p key={p}>{p}</p>)}</div>
   <div className="intake-question"><label htmlFor="intake-signature">Client signature (type your full legal name) *</label><input id="intake-signature" value={signature} onChange={e=>setSignature(e.target.value)}/></div>
   <div className="intake-question"><label htmlFor="intake-initials">Client initials (health/safety acknowledgment) *</label><input id="intake-initials" maxLength={12} value={initials} onChange={e=>setInitials(e.target.value)}/></div>
   <label className="intake-option intake-accept"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/>I have read and agree to the acknowledgment above. I understand my typed signature and initials will be recorded with the date and time.</label>
   <p className="intake-lead">The esthetician will complete Section 11 privately, after reviewing your answers.</p>
  </div>}
  {error&&<p role="alert" className="notice intake-error">{error}</p>}
  <div className="intake-actions"><button className="button button-outline" type="button" disabled={step===0||busy} onClick={()=>{setStep(n=>n-1);setError('')}}>Back</button>
   {step<total-1?<button className="button button-dark" type="button" onClick={next}>Continue ↗</button>:<button type="button" className="button button-dark" disabled={busy||!configured} onClick={submit}>{busy?'Sending securely…':'Submit confidential consultation ↗'}</button>}
  </div>
  <p className="intake-privacy">Your answers are used to evaluate service suitability and personalize your MAH ESTI experience. Sensitive answers are encrypted and accessible only to authorized studio staff.</p>
 </div>;
}
