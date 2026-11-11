import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ArtistRequestForm from '@/components/artist-request-form';
import { getServices } from '@/lib/catalog';
import { brandCollections } from '@/lib/brand-media';

export const metadata:Metadata={title:'Book with Cee | Braids & Natural Hair',description:'Send Cee your preferred braiding or natural-hair service and appointment details.'};
export const dynamic='force-dynamic';

export default async function TitiBooking(){
 const services=await getServices();
 const ceeServices=services.filter(s=>s.artists.some(a=>a.artist.slug==='christina')).map(s=>s.name);
 const options=ceeServices.length?ceeServices:['All Braiding Styles','Silk Press','Curls','Wash-N-Go','Foundation Braid Down','Kids Braids','Adult Natural Hair Braids','Trim'];
 return <>
  <section className="titi-booking-hero"><div className="container titi-booking-hero-inner">
   <div><p className="eyebrow">MahLovely Studio / Cee</p><h1>Your next look <em>starts here.</em></h1><p>Braids, protective styling, and natural-hair care with a personal touch. Send Cee the look you have in mind and your preferred appointment details.</p><Link className="text-link" href="/artists/christina">Meet Cee ↗</Link></div>
   <div className="titi-booking-hero-art"><Image src={brandCollections.christina.photos[2].src} alt={brandCollections.christina.photos[2].alt} fill priority sizes="(max-width: 760px) 100vw, 42vw" className="brand-image" style={{objectPosition:brandCollections.christina.photos[2].position}}/></div>
  </div></section>
  <section className="section titi-booking-request"><div className="container titi-booking-layout">
   <div><p className="eyebrow">Your appointment / request</p><h2>Tell us the <em>vision.</em></h2><p>Choose the service you&apos;re interested in and share your preferred day. This request goes to the MahLovely admin inbox for follow-up, so you won&apos;t be charged or accidentally booked into an unavailable time.</p><div className="titi-booking-note"><span>01 / Select your service</span><span>02 / Share your preferences</span><span>03 / Cee follows up to confirm</span></div></div>
   <div className="titi-booking-form"><ArtistRequestForm kind="titi-booking" services={options}/></div>
  </div></section>
  <section className="cta-band brand-closing"><p className="eyebrow">See the work</p><h2>Every style has a story.</h2><Link className="button button-light" href="/gallery?artist=christina">Explore Cee&apos;s lookbook ↗</Link></section>
 </>;
}
