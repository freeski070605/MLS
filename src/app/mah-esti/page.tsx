import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { brandCollections } from '@/lib/brand-media';
import { mahSections,mahPrice } from '@/lib/mah-esti';
import ArtistRequestForm from '@/components/artist-request-form';

export const metadata:Metadata={title:'MAH ESTI | Facials, Body Care & Spa Experiences',description:'Explore MAH ESTI by Shante: seven custom facials, five body treatments, and six signature spa packages.'};

export default async function MahEsti({searchParams}:{searchParams:Promise<{service?:string}>}){
 const {service}=await searchParams;
 const all=mahSections.flatMap(s=>s.items);
 const initial=all.find(item=>item.slug===service)?.name;
 const edit=brandCollections.shante;
 return <>
  <section className="mah-hero"><div className="container mah-hero-content">
    <div className="mah-monogram">MAH <span>ESTI</span></div>
    <p className="eyebrow">MahLovely Studio / esthetics by Shante</p>
    <h1>Redeem.<br/><em>Relax.</em><br/>Glow.</h1>
    <p className="mah-hero-lead">Skincare as an experience, not another thing on your to-do list. Custom facials, targeted body care, and intentional little luxuries made for your skin.</p>
    <div className="hero-actions"><Link className="button button-light" href="#consultation">Start with a consultation ↗</Link><Link className="button button-outline" href="#mah-menu">Explore the menu</Link></div>
    <p className="mah-signature-line">Your skin. Your pace. Your glow.</p>
  </div></section>
  <section className="mah-intro"><div className="container mah-intro-grid">
    <span>01 — THE PHILOSOPHY</span><h2>Your skin. <em>Your kind of glow.</em></h2>
    <p>MAH ESTI is built around seven core facials, five body treatments and six signature experiences. Your consultation shapes the products and techniques used for your unique skin, whether you want hydration, clarity, calm or a little time for yourself.</p>
  </div></section>
  <section className="mah-editorial-story">
    <div className="container mah-editorial-layout">
      <figure className="mah-editorial-photo mah-editorial-photo-main">
        <Image src={edit.photos[0].src} alt={edit.photos[0].alt} fill sizes="(max-width: 760px) 90vw, 45vw" className="brand-image"/>
        <figcaption>01 / The MAH ESTI touch</figcaption>
      </figure>
      <div className="mah-editorial-copy">
        <p className="eyebrow">The ritual / the reveal</p>
        <h2>Skincare that <em>feels personal.</em></h2>
        <p>From the first conversation to the final finishing touch, the treatment is built around your skin and the way you want to feel.</p>
        <div className="mah-editorial-photo mah-editorial-photo-detail">
          <Image src={edit.photos[2].src} alt={edit.photos[2].alt} fill sizes="(max-width: 760px) 75vw, 25vw" className="brand-image"/>
        </div>
        <Link className="text-link" href="/gallery?category=esthetics">See the MAH ESTI lookbook ↗</Link>
      </div>
    </div>
  </section>
  <div id="mah-menu">
    {mahSections.map((section,index)=><section id={section.id} className={'mah-menu-section mah-menu-'+section.id} key={section.id}>
      <div className="container"><header className="mah-section-head">
       <div><p className="eyebrow">{section.eyebrow}</p><h2>{section.title}<span>.</span></h2></div><p>{section.intro}</p>
      </header>
      <div className="mah-service-grid">
        {section.items.map((item,i)=><article className={'mah-service'+(item.featured?' is-signature':'')} key={item.slug}>
          <div className="mah-service-top"><span>{String(i+1).padStart(2,'0')}</span>{item.featured&&<span>MAH favorite</span>}</div>
          <h3>{item.name}</h3><p className="mah-service-desc">{item.description}</p>
          {item.details&&<ul className="mah-inclusions">{item.details.map(detail=><li key={detail}>{detail}</li>)}</ul>}
          <div className="mah-service-bottom"><strong>{mahPrice(item.price)}</strong><Link href={'/mah-esti?service='+item.slug+'#consultation'} className="text-link">Inquire ↗</Link></div>
        </article>)}
      </div>
      </div>
    </section>)}
  </div>
  <section className="mah-cta-section" id="consultation"><div className="container mah-consult-grid">
    <div><p className="eyebrow">The first step / MAH ESTI</p><h2>Let&apos;s talk <em>skin.</em></h2><p>Not sure where to begin? Tell Ke what you&apos;re looking for. She can help you choose your facial, body treatment or signature spa package.</p><div className="mah-consult-promise"><span>01 / Choose your interest</span><span>02 / Share your goals</span><span>03 / Get a personal follow-up</span></div></div>
    <div className="mah-consult-form"><ArtistRequestForm kind="ke-consultation" services={all.map(item=>item.name)} initialService={initial}/></div>
  </div></section>
  <section className="cta-band brand-closing"><p className="eyebrow">MAH ESTI x MahLovely</p><h2>Come as you are. Leave glowing.</h2><Link className="button button-light" href="/artists/shante">Meet Shante ↗</Link></section>
 </>;
}
