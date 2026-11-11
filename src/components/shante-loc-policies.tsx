import Link from 'next/link';
import { shanteLocPolicySections } from '@/lib/shante-loc-policies';

export default function ShanteLocPolicies({compact=false}:{compact?:boolean}){
 return <section className={'shante-policy-section'+(compact?' is-compact':'')} aria-labelledby={compact?'ke-policy-compact':'ke-policy-heading'}>
  <div className="shante-policy-heading">
   <p className="eyebrow">Get Twisted by Shante Pinklips</p>
   <h2 id={compact?'ke-policy-compact':'ke-policy-heading'}>Before your loc appointment<span>.</span></h2>
   <p>Booking &amp; policies for Shante&apos;s loc services. Review these details before requesting a date.</p>
  </div>
  <div className="shante-policy-grid">{shanteLocPolicySections.map((section,index)=><article className="shante-policy-item" key={section.title}>
   <span className="shante-policy-number">{String(index+1).padStart(2,'0')}</span>
   <h3>{section.title}</h3>
   <p>{section.body}</p>
  </article>)}</div>
  <div className="shante-policy-foot">
   <p>Questions about the deposit, travel, or timing? Contact the studio before booking. Prices and fees above apply to Shante&apos;s loc appointments, not automatically to MAH ESTI or Cee&apos;s services.</p>
   <Link className="text-link" href="/contact">Ask a question ↗</Link>
  </div>
 </section>;
}
