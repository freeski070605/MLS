import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArtists,getServices } from '@/lib/catalog';
import { db } from '@/lib/db';
import { priceLabel,siteUrl } from '@/lib/site';
<<<<<<< HEAD
import GalleryMedia from '@/components/gallery-media';
=======

// Artist profiles are managed from the admin and must always reflect the latest
// MongoDB values (especially photoUrl/coverUrl) without waiting for a redeploy.
export const dynamic='force-dynamic';
export const revalidate=0;

>>>>>>> 98b9daab01676832b77db788e5b704b60326974a
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const a=(await getArtists()).find(a=>a.slug===slug);return a?{title:a.displayName,description:a.bio||`Meet ${a.displayName} at MahLovely Studio`,alternates:{canonical:`${siteUrl}/artists/${slug}`}}:{title:'Artist not found'}}
export default async function ArtistDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const artist=(await getArtists()).find(a=>a.slug===slug);
  if(!artist)notFound();
  const [services,portfolio]=await Promise.all([
    getServices().then(items=>items.filter(s=>s.artists.some(a=>a.artist.slug===slug))),
    artist.id===artist.slug?Promise.resolve([]):db.galleryItem.findMany({where:{artistId:artist.id,published:true},orderBy:{displayOrder:'asc'}})
  ]);
  const portraitDimensions=artist.photoUrl==='/brand/Titi/IMG_0550.JPG'?{width:1024,height:1820}:artist.photoUrl==='/brand/Ke/IMG_0549.PNG'?{width:1533,height:1024}:{width:600,height:700};
  return <>
    <section className="page-hero"><div className="container"><p className="eyebrow">MahLovely artist</p><h1>{artist.displayName}.</h1><p>{artist.roleLabels.join(' + ')}</p></div></section>
    <section className="section">
      <div className="container intro-grid">
        <div className="visual-panel">{artist.photoUrl?<Image src={artist.photoUrl} alt={`${artist.displayName}, MahLovely artist`} width={portraitDimensions.width} height={portraitDimensions.height} sizes="(max-width: 760px) 100vw, 50vw" unoptimized={artist.photoUrl.startsWith('http')}/>:<span className="display" style={{fontSize:'8rem'}}>{artist.displayName.slice(0,1)}</span>}</div>
        <div><p className="eyebrow">The artist</p><h2>Beauty with intention.</h2><p className="intro-copy">{artist.bio}</p><p className="eyebrow">Specialties</p><p>{artist.specialties.join(' · ')}</p><Link className="button button-dark" href={`/services?artist=${artist.slug}`}>Explore services ↗</Link></div>
      </div>
    </section>
    <section className="section-tight" style={{background:'#eee8dd'}}>
      <div className="container"><p className="eyebrow">The menu</p><h2>Services by {artist.displayName}.</h2>{services.length?<div className="service-grid">{services.map(s=><Link href={`/services/${s.slug}`} className="service-card" key={s.slug}><p className="eyebrow">{s.category.name}</p><h3>{s.name}</h3><div className="card-bottom"><strong>{priceLabel(s)}</strong><span className="text-link">Details ↗</span></div></Link>)}</div>:<div className="empty-state"><p>{artist.displayName}&apos;s service menu is being prepared.</p><Link className="button button-outline" href="/contact">Get in touch</Link></div>}</div>
    </section>
    <section className="section">
      <div className="container">
        <div className="section-heading"><div><p className="eyebrow">The portfolio</p><h2>{artist.displayName}&apos;s work.</h2></div><Link className="text-link" href={`/gallery?artist=${artist.slug}`}>View in gallery ↗</Link></div>
        {portfolio.length?<div className="gallery-grid">{portfolio.map(item=><figure className="gallery-item" key={item.id}><GalleryMedia item={item}/><figcaption className="gallery-caption">{item.caption||item.altText}</figcaption></figure>)}</div>:<div className="empty-state"><p>{artist.displayName}&apos;s portfolio is being prepared.</p></div>}
      </div>
    </section>
    <section className="cta-band"><h2>Your next visit starts here.</h2><Link className="button button-light" href="/book">Book an appointment ↗</Link></section>
  </>;
}
