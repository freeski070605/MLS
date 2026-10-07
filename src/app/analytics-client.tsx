'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
export default function AnalyticsClient({enabled}:{enabled:boolean}){const pathname=usePathname();useEffect(()=>{if(!enabled||!pathname||pathname.startsWith('/admin')||pathname.startsWith('/account'))return;const payload=JSON.stringify({name:'page_view',path:pathname});navigator.sendBeacon?.('/api/analytics',new Blob([payload],{type:'application/json'}))},[enabled,pathname]);return null}
