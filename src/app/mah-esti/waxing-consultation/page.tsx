import type {Metadata} from 'next';
import Link from 'next/link';
import MahEstiWaxingForm from '@/components/mah-esti-waxing-form';
import {intakeReady} from '@/lib/mah-esti-security';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Waxing Consultation & Intake | MAH ESTI',description:'Complete MAH ESTI’s confidential waxing consultation, safety screening, acknowledgments and comfort preferences before treatment.'};
export default function WaxingConsultation(){
 return <>
  <section className="mah-hero waxing-intake-hero"><div className="container mah-hero-content">
   <div className="mah-monogram">MAH <span>ESTI</span></div>
   <p className="eyebrow">Waxing / consultation &amp; intake</p>
   <h1>Care first.<br/><em>Glow next.</em></h1>
   <p className="mah-hero-lead">Your safety and comfort come first. Complete Ke&apos;s official waxing consultation so she can review your skin history, medications, preferences, and treatment suitability.</p>
   <Link className="button button-light" href="#waxing-intake">Start the waxing consultation ↗</Link>
  </div></section>
  <section className="mah-cta-section waxing-intake-section" id="waxing-intake"><div className="container mah-consult-grid">
    <div><p className="eyebrow">MAH ESTI / confidential client intake</p><h2>Waxing, <em>with care.</em></h2><p>Tell Ke the area you&apos;d like waxed and share any relevant skin history, products, allergies, medical concerns, or comfort preferences.</p>
    <div className="mah-consult-promise"><span>01 / Your waxing goals &amp; skin history</span><span>02 / Medications, safety &amp; comfort</span><span>03 / Consent &amp; confidential review</span></div>
    <p className="intake-lead">If you need urgent medical care, do not wait for a waxing appointment or this form. A submitted intake is not treatment clearance or a booking confirmation.</p>
    <Link className="text-link" href="/mah-esti#consultation">Looking for the facial consultation instead? ↗</Link>
    </div>
    <div className="mah-consult-form"><MahEstiWaxingForm configured={intakeReady()}/></div>
  </div></section>
 </>;
}
