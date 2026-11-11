import Link from 'next/link';
import {notFound} from 'next/navigation';
import {requireUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {inquiryWhereForStaff} from '@/lib/inquiry-scope';
import InquiryStatus from './status';

export const dynamic='force-dynamic';
export const metadata={title:'Inquiry Details | MahLovely Studio'};

export default async function InquiryDetail({params}:{params:Promise<{id:string}>}){
 const user=await requireUser(['OWNER','ADMIN','ARTIST']);
 const {id}=await params;
 if(!/^[0-9a-f]{24}$/i.test(id))notFound();
 const inquiry=await db.inquiry.findFirst({where:{AND:[{id},inquiryWhereForStaff(user)]}});
 if(!inquiry)notFound();
 return <div className="stack">
  <div className="admin-toolbar"><div>
   <p className="eyebrow"><Link href="/admin/inquiries">Inquiries</Link> / Full request</p>
   <h1 className="admin-title">{inquiry.subject}</h1>
   <p className="muted">Received {new Intl.DateTimeFormat('en-US',{dateStyle:'long',timeStyle:'short',timeZone:'America/New_York'}).format(inquiry.createdAt)}</p>
  </div><Link className="button button-outline" href="/admin/inquiries">Back to inbox</Link></div>
  <section className="admin-panel stack">
   <h2>{inquiry.name}</h2>
   <p><strong>Email:</strong> <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></p>
   {inquiry.phone&&<p><strong>Phone:</strong> <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a></p>}
   <div><h3>Full inquiry</h3><p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{inquiry.message}</p></div>
   <InquiryStatus id={inquiry.id} initialStatus={inquiry.status}/>
  </section>
 </div>;
}
