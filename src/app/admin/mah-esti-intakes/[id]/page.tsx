import Link from 'next/link';
import {notFound} from 'next/navigation';
import {currentUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {decryptIntake,intakeReady} from '@/lib/mah-esti-security';
import {intakeSections,consentText} from '@/lib/mah-esti-intake';
import EstheticianNotes from '@/components/mah-esti-staff-notes';

export const dynamic='force-dynamic';
type Payload={answers:Record<string,string|string[]>;service?:string;signature:string;initials:string;signedAt:string;consentAccepted:boolean};
export default async function IntakeDetail({params}:{params:Promise<{id:string}>}){
 const user=await currentUser();
 if(!user||!['OWNER','ADMIN','ARTIST'].includes(user.role)||user.role==='ARTIST'&&user.artist?.slug!=='shante')notFound();
 if(!intakeReady())notFound();
 const {id}=await params;if(!/^[0-9a-f]{24}$/i.test(id))notFound();
 const record=await db.mahEstiIntake.findUnique({where:{id}});if(!record)notFound();
 let payload:Payload;
 let notes:Record<string,string>={};
 try{
  payload=decryptIntake<Payload>(record.encryptedPayload);
  if(record.encryptedNotes)notes=decryptIntake<{notes:Record<string,string>}>(record.encryptedNotes).notes;
 }catch{return <div className="container section"><h1>Unable to read encrypted record</h1><p>Check the configured encryption key. Do not overwrite the record.</p></div>}
 return <div className="container section"><p className="eyebrow">Confidential client record — restricted</p><Link href="/admin/mah-esti-intakes" className="text-link">All intakes ↗</Link>
  <h1>MAH ESTI consultation.</h1>
  <p>Submitted {new Date(record.createdAt).toLocaleString('en-US',{dateStyle:'long',timeStyle:'short'})} · Reference {record.id}</p>
  {payload.service&&<p><strong>Requested experience:</strong> {payload.service}</p>}
  <div className="intake-admin-review">{intakeSections.map(section=><section className="intake-admin-section" key={section.title}><h2>{section.title}</h2>{section.fields.map(field=>{
   const value=payload.answers[field.key];return <div className="intake-admin-answer" key={field.key}><strong>{field.label}</strong><span>{Array.isArray(value)?value.join(' · '):value||'Not provided'}</span></div>
  })}</section>)}
  <section className="intake-admin-section"><h2>10 | Client acknowledgment & consent</h2><p>{consentText}</p><div className="intake-admin-answer"><strong>Client signature</strong><span>{payload.signature}</span></div><div className="intake-admin-answer"><strong>Health/safety initials</strong><span>{payload.initials}</span></div><div className="intake-admin-answer"><strong>Date/time of consent</strong><span>{payload.signedAt}</span></div><div className="intake-admin-answer"><strong>Accepted</strong><span>{payload.consentAccepted?'Yes':'No'}</span></div></section>
  </div>
  <EstheticianNotes id={record.id} initial={notes} status={record.status}/>
 </div>;
}
