import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories,getServices } from '@/lib/catalog';
import { brandCollections } from '@/lib/brand-media';
import { priceLabel } from '@/lib/site';
import { mahSections } from '@/lib/mah-esti';

export const metadata:Metadata={title:'Services',description:'Explore braids, natural hair, locs, and esthetic care at MahLovely Studio.'};
export default async function Services({searchParams}:{searchParams:Promise<{category?:string;artist?:string}>}){
  const query=await searchParams;
  const [categories,services]=await Promise.all([getCategories(),getServices()]);
  const filtered=services.filter(s=>(!query.category||s.category.slug===query.category)&&(!query.artist||s.artists.some(a=>a.artist.slug===query.artist)));
  const showMah=(!query.artist||query.artist==='shante')&&(!query.category||query.category==='esthetics');
  const allMah=mahSections.flatMap(section=>section.items);
  const unseededMah=query.category==='esthetics'?allMah.filter(item=>!services.some(s=>s.slug===item.slug)):[];
  return <>
    <section className="brand-services-hero"><div className="container brand-services-hero-inner">
      <div><p className="eyebrow">The service menu</p><h1>Made for <em>you.</em></h1><p>Thoughtful care for your hair, skin, and crown. Explore the services, then book the experience that feels right.</p><Link className="text-link" href="/artists">Meet your artist ↗</Link></div>
      <div className="brand-services-hero-visual"><Image src={brandCollections.shante.photos[2].src} alt={brandCollections.shante.photos[2].alt} fill priority sizes="(max-width:760px) 100vw, 42vw" className="brand-image"/></div>
    </div></section>
    <section className="section-tight brand-services-list"><div className="container">
      <div className="brand-services-toolbar"><div><p className="eyebrow">Discover your next look</p><h2>The menu.</h2></div><p>Prices reflect the information currently available. Your artist can help clarify the details of your visit.</p></div>
      <div className="filter-row">
        <Link className={'filter-pill'+(!query.category?' active':'')} href="/services">All services</Link>
        {categories.map(c=><Link className={'filter-pill'+(query.category===c.slug?' active':'')} href={`/services?category=${c.slug}`} key={c.slug}>{c.name}</Link>)}
      </div>
      {showMah&&<div className="mah-services-banner"><div><p className="eyebrow">MAH ESTI / Shante</p><h3>Redeem. Relax. Glow.</h3><p>Custom facials, targeted body treatments and signature spa experiences with thoughtful add-ons.</p></div><Link className="button button-light" href="/mah-esti">Explore the full MAH ESTI menu ↗</Link></div>}
      {unseededMah.length>0&&<section className="mah-menu-preview"><p className="eyebrow">MAH ESTI / treatments and packages</p><div className="service-grid">{unseededMah.map(item=><article className="service-card" key={item.slug}><p className="eyebrow">MAH ESTI</p><h3>{item.name}</h3><p className="muted">{item.description}</p><div className="card-bottom"><strong>${item.price}</strong><Link className="text-link" href={`/mah-esti?service=${item.slug}#consultation`}>Consult ↗</Link></div></article>)}</div></section>}
      {filtered.length?<div className="service-grid">{filtered.map(s=><article className="service-card" key={s.slug}>
        <p className="eyebrow">{s.category.name} · {s.artists.map(a=>a.artist.displayName).join(', ')}</p>
        <h3><Link href={`/services/${s.slug}`}>{s.name}</Link></h3>{s.shortDescription&&<p className="muted">{s.shortDescription}</p>}
        <div className="card-bottom"><strong>{priceLabel(s)}</strong><Link className="text-link" href={`/services/${s.slug}`}>Explore ↗</Link></div>
      </article>)}</div>:<div className="empty-state"><h3>More care is on its way.</h3><p>Services in this category will appear here as soon as they are published.</p><Link className="button button-outline" href="/contact">Ask us a question</Link></div>}
    </div></section>
    <section className="cta-band brand-closing"><p className="eyebrow">The next step</p><h2>Your crown deserves care.</h2><Link className="button button-light" href="/book">Book your visit ↗</Link></section>
  </>;
}
