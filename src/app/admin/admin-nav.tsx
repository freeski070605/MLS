'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const groups=[
 {title:'Overview',items:[['Dashboard','/admin'],['Calendar','/admin/calendar'],['Appointments','/admin/appointments'],['Confidential intakes','/admin/mah-esti-intakes']]},
 {title:'People',items:[['Clients','/admin/clients'],['Artists','/admin/artists'],['Staff access','/admin/team']]},
 {title:'Services',items:[['Service menu','/admin/services'],['Categories','/admin/categories'],['Add-ons','/admin/options']]},
 {title:'Schedule',items:[['Availability & time off','/admin/calendar?view=availability']]},
 {title:'Website',items:[['Content','/admin/content'],['Gallery','/admin/gallery'],['Social','/admin/social'],['Testimonials','/admin/testimonials'],['FAQ','/admin/faqs']]},
 {title:'Business',items:[['Policies','/admin/policies'],['Notifications','/admin/notifications'],['Settings','/admin/settings'],['Media library','/admin/media'],['Inquiries','/admin/inquiries']]},
 {title:'Insights',items:[['Analytics','/admin/analytics']]}
];
const artistPages=new Set(['/admin','/admin/calendar','/admin/calendar?view=availability','/admin/appointments','/admin/services','/admin/gallery','/admin/artists','/admin/clients','/admin/inquiries']);
export default function AdminNav({role,artistSlug}:{role:string;artistSlug?:string}){const path=usePathname();const router=useRouter();const [open,setOpen]=useState(false);const [leaving,setLeaving]=useState(false);const [logoutError,setLogoutError]=useState('');async function signOut(){setLeaving(true);setLogoutError('');try{const result=await fetch('/api/auth/logout',{method:'POST'});if(!result.ok)throw new Error('Could not sign out');router.replace('/login');router.refresh()}catch{setLogoutError('Sign out failed. Please try again.');setLeaving(false)}}return <><button className="admin-menu-button" aria-expanded={open} aria-controls="admin-navigation" onClick={()=>setOpen(!open)}>☰ &nbsp; Studio menu</button><aside id="admin-navigation" className={`admin-nav ${open?'is-open':''}`}><div className="admin-nav-brand"><span className="eyebrow">MahLovely Studio</span><h2>Studio management</h2></div><nav aria-label="Studio management">{groups.map(group=>{const links=group.items.filter(([,href])=>(role==='OWNER'||artistPages.has(href)||href==='/admin/mah-esti-intakes'&&artistSlug==='shante')&&(href!=='/admin/team'||role==='OWNER')&&(href!=='/admin/mah-esti-intakes'||role==='OWNER'||artistSlug==='shante'));return links.length?<div className="admin-nav-group" key={group.title}><p>{group.title}</p>{links.map(([name,href])=><Link onClick={()=>setOpen(false)} className={path===href?'active':''} aria-current={path===href?'page':undefined} key={`${group.title}-${name}`} href={href}>{name}</Link>)}</div>:null})}</nav><Link className="admin-account" href="/account">My account ↗</Link><button type="button" className="admin-account" onClick={signOut} disabled={leaving}>{leaving?"Signing out…":"Sign out ↗"}</button>{logoutError&&<p role="alert">{logoutError}</p>}</aside></>}
