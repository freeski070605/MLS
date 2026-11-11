import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getArtists } from '@/lib/catalog';
import { brandCollections } from '@/lib/brand-media';

export const metadata:Metadata={title:'Our Artists',description:'Meet the artists of MahLovely Studio.'};
export const dynamic='force-dynamic';

export default async function Artists(){
  const artists=await getArtists();
  return <>
    <section className="brand-artist-list-hero"><div className="container brand-artist-list-hero-inner">
      <div><p className="eyebrow">The people behind MahLovely</p><h1>Two artists.<br/><em>One vision.</em></h1><p>Individual craft. Intentional care. Find the artist who understands your hair, your style, and your next look.</p></div>
      <div className="brand-artist-list-image"><Image src={brandCollections.christina.photos[2].src} alt="Work from Cee's portfolio" fill priority sizes="(max-width: 760px) 100vw, 40vw" className="brand-image"/></div>
    </div></section>
    <section className="section brand-artist-list-body"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Find your artist</p><h2>The faces of the craft.</h2></div></div>
      <div className="artist-grid">{artists.map(a=>{const portrait=a.photoUrl||a.coverUrl;return <Link className={'artist-card'+(portrait?' artist-card-image':'')} key={a.slug} href={`/artists/${a.slug}`}>
        {portrait&&<Image src={portrait} alt={a.displayName} fill sizes="(max-width: 760px) 100vw, 50vw" loading="lazy" unoptimized={portrait.startsWith('http')} className="artist-card-photo"/>}
        <p className="eyebrow">MahLovely artist</p><h3>{a.displayName}</h3><p>{a.roleLabels.join(' + ')}</p><span className="text-link">Meet {a.displayName} ↗</span>
      </Link>})}</div>
    </div></section>
    <section className="cta-band brand-closing"><p className="eyebrow">Your look starts with a conversation</p><h2>Find your fit.</h2><Link className="button button-light" href="/services">Explore the services ↗</Link></section>
  </>;
}
