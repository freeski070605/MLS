'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MahEstiSyncButton(){
  const router=useRouter();
  const [working,setWorking]=useState(false);
  const [notice,setNotice]=useState('');
  const [error,setError]=useState(false);
  async function sync(){
    if(working)return;
    setWorking(true);setNotice('');setError(false);
    try{
      const response=await fetch('/api/admin/mah-esti/sync',{method:'POST'});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||'Menu sync failed');
      setNotice(`MAH ESTI is synced: ${result.total} offerings · ${result.created} new · ${result.preserved} existing preserved. Admin changes remain intact.`);
      router.refresh();
    }catch(e){
      setError(true);
      setNotice(e instanceof Error?e.message:'Could not sync MAH ESTI menu');
    }finally{setWorking(false)}
  }
  return <div className="mah-admin-sync">
    <button type="button" className="button button-outline" disabled={working} onClick={sync}>
      {working?'Syncing MAH ESTI…':'Sync MAH ESTI menu (18 offerings)'}
    </button>
    {notice&&<p className={error?'notice':'muted'} role="status">{notice}</p>}
    <p className="muted">Imports missing facials, body treatments and spa packages for Shante; existing prices, descriptions and bookings are not overwritten.</p>
  </div>;
}
