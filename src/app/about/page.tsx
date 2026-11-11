import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { content } from '@/lib/site';
import { brandCollections } from '@/lib/brand-media';

export const metadata:Metadata={title:'About',description:'Get to know MahLovely Studio, where hair artistry and esthetic care come together.'};
export default async function About(){
  const intro=await content('about.intro','MahLovely Studio brings two artists together around healthy hair, beauty, confidence, and intentional self-care. Every visit begins with you.');
  return <>
    <section className="brand-about-hero"><div className="container brand-about-hero-inner">
      <div className="brand-about-hero-copy"><p className="eyebrow">Our story / MahLovely Studio</p><h1>Beauty is <em>personal.</em></h1><p>Different crafts, one shared purpose: an experience that respects your individuality and your crown.</p><Link className="button button-dark" href="/artists">Meet the artists ↗</Link></div>
      <div className="brand-about-hero-art">
        <div className="brand-about-art-one"><Image src={brandCollections.shante.photos[0].src} alt={brandCollections.shante.photos[0].alt} fill priority sizes="(max-width:760px) 55vw, 27vw" className="brand-image"/></div>
        <div className="brand-about-art-two"><Image src={brandCollections.christina.photos[1].src} alt={brandCollections.christina.photos[1].alt} fill priority sizes="(max-width:760px) 50vw, 22vw" className="brand-image"/></div>
      </div>
    </div></section>
    <section className="section brand-about-story"><div className="container intro-grid">
      <div><p className="eyebrow">Our point of view</p><h2>Care that starts with you.</h2></div>
      <div className="intro-copy"><div className="rule"/><p>{intro}</p><p>Explore the work, discover your artist, and find the service that fits your next visit.</p><Link className="text-link" href="/gallery">Explore the lookbook ↗</Link></div>
    </div></section>
    <section className="section brand-about-values"><div className="container">
      <p className="eyebrow">The MahLovely way</p><div className="brand-about-values-grid">
        <article><span>01 /</span><h3>Intentional care.</h3><p>Your hair, skin, and preferences come first.</p></article>
        <article><span>02 /</span><h3>Real artistry.</h3><p>Technique and creativity live in the details.</p></article>
        <article><span>03 /</span><h3>Your confidence.</h3><p>A look that feels true to you, wherever you go next.</p></article>
      </div>
    </div></section>
    <section className="cta-band brand-closing"><p className="eyebrow">Welcome to MahLovely</p><h2>Your hair. Your skin. Your crown.</h2><Link className="button button-light" href="/services">Explore services ↗</Link></section>
  </>;
}
