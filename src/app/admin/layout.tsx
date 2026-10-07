import { requireUser } from '@/lib/auth';
import AdminNav from './admin-nav';
export default async function AdminLayout({children}:{children:React.ReactNode}){const user=await requireUser(['OWNER','ADMIN','ARTIST']);return <div className="admin-shell"><AdminNav role={user.role}/><main className="admin-main">{children}</main></div>}
