import Link from 'next/link';
import { requireUser } from '@/lib/auth';
const sections=['Dashboard','Calendar','Appointments','Services','Options','Categories','Artists','Team','Clients','Gallery','Social','Testimonials','Content','Policies','FAQs','Inquiries','Notifications','Analytics','Settings','Media'];
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireUser(['OWNER','ADMIN','ARTIST']);return <div className="admin-shell"><aside className="admin-nav"><h2>Studio admin</h2>{sections.map(s=><Link href={s==='Dashboard'?'/admin':`/admin/${s.toLowerCase()}`} key={s}>{s}</Link>)}<Link href="/account">My account</Link></aside><div className="admin-main">{children}</div></div>}
