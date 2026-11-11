import Link from 'next/link';
import {notFound} from 'next/navigation';
import {currentUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {decryptIntake,intakeReady} from '@/lib/mah-esti-security';

export const dynamic='force-dynamic';
export const metadata={title:'MAH ESTI Confidential Intakes'};
type Payload={answers:Record<string,string|string[]>;signedAt:string;kind?:'facial'|'waxing'};
export default async function IntakeList(){
 const user=await currentUser();
 if(!user){return <div className="container section"><p>Please sign in to view private consultations. <Link href="/login">Sign in</Link></p></div>}
 if(!['OWNER','ADMIN','ARTIST'].includes(user.role)||user.role==='ARTIST'&&user.artist?.slug!=='shante')notFound();
 if(!intakeReady())return <div className="container section"><h1>MAH ESTI intakes</h1><p>Confidential intake storage is not configured. Add MAH_ESTI_INTAKE_KEY to Vercel before accepting client records.</p></div>;
 const records=await db.mahEstiIntake.findMany({orderBy:{createdAt:'desc'},take:100});
 return <div className="container section"><div className="admin-toolbar"><div><p className="eyebrow">Private / authorized studio staff</p><h1>MAH ESTI intakes.</h1><p>Confidential consultation and skin analysis records. Showing the 100 newest submissions.</p></div><Link className="button button-outline" href="/admin">Admin dashboard</Link></div>
 <div className="admin-panel">{records.length?records.map(r=>{
  let name='Unavailable',kind='Facial';try{const data=decryptIntake<Payload>(r.encryptedPayload);name=data.answers.fullName as string||'Unnamed client';kind=data.kind==='waxing'?'Waxing':'Facial'}catch{}
  return <Link key={r.id} className="list-row" href={'/admin/mah-esti-intakes/'+r.id}><span><strong>{name}</strong> · <small>{kind}</small><br/><small>{new Date(r.createdAt).toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'})}</small></span><span className="badge">{r.status}</span></Link>
 }):<p>No MAH ESTI consultation records yet.</p>}</div>
 </div>;
}
