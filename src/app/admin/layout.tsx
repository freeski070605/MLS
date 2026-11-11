import { requireUser } from '@/lib/auth';
import {staffArtistId} from '@/lib/staff-scope';
import AdminNav from './admin-nav';
export default async function AdminLayout({children}:{children:React.ReactNode}){
 const user=await requireUser(['OWNER','ADMIN','ARTIST']);
 staffArtistId(user);
 return <div className="admin-shell"><AdminNav role={user.role} artistSlug={user.artist?.slug}/><main className="admin-main">{children}</main></div>;
}
