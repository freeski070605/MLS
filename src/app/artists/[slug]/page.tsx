import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArtists,getServices } from '@/lib/catalog';
import { db } from '@/lib/db';
import { priceLabel,siteUrl } from '@/lib/site';
<<<<<<< HEAD
import { allOriginalBrandUrls,isRejectedBrandMedia } from '@/lib/brand-media';
=======
import { allOriginalBrandUrls,excludedBrandUrls } from '@/lib/brand-media';
>>>>>>> dc93fac8f0afeebe82750a872377753558d0579b
import BrandPortfolio from '@/components/brand-portfolio';
import GalleryMedia from '@/components/gallery-media';
import ShanteLocPolicies from '@/components/shante-loc-policies';

export const dynamic='force-dynamic';
export const revalidate=0;

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const artist=(await getArtists()).find(a=>a.slug===slug);
  return artist?{title:artist.displayName,description:artist.bio||`Meet ${artist.displayName} at MahLovely Studio`,alternates:{canonical:`${siteUrl}/artists/${slug}`}}:{title:'Artist not found'};
}
export default async function ArtistDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const artist=(await getArtists()).find(a=>a.slug===slug);
  if(!artist)notFound();
  const [services,portfolio]=await Promise.all([
    getServices().then(items=>items.filter(s=>s.artists.some(a=>a.artist.slug===slug))),
    artist.id===artist.slug?Promise.resolve([]):db.galleryItem.findMany({where:{artistId:artist.id,published:true},orderBy:{displayOrder:'asc'}}).catch(()=>[])
  ]);
  const portraitDimensions=artist.photoUrl==='/brand/Titi/IMG_0550.JPG'?{width:1024,height:1820}:artist.photoUrl==='/brand/Ke/IMG_0549.PNG'?{width:1533,height:1024}:{width:600,height:700};
  const hasBrandPortfolio=slug==='shante'||slug==='christina';
<<<<<<< HEAD
  const extraPortfolio=portfolio.filter(item=>!isRejectedBrandMedia(item.imageUrl)&&!allOriginalBrandUrls.has(item.imageUrl||item.videoUrl||''));
=======
  const extraPortfolio=portfolio.filter(item=>!allOriginalBrandUrls.has(item.imageUrl||item.videoUrl||'')&&!excludedBrandUrls.has(item.imageUrl||item.videoUrl||''));
>>>>>>> dc93fac8f0afeebe82750a872377753558d0579b
  return <>
    <section className="brand-artist-heading">
      <div className="container">
        <div className="brand-artist-heading-top"><p className="eyebrow">The people behind MahLovely</p><Link className="text-link" href="/artists">All artists ↗</Link></div>
        <h1>{artist.displayName}<span>.</span></h1><p className="brand-artist-subtitle">{artist.roleLabels.join(' · ')}</p>
      </div>
    </section>
    <section className="section brand-artist-story">
      <div className="container intro-grid">
        <div className="visual-panel brand-artist-portrait">{artist.photoUrl?<Image src={artist.photoUrl} alt={`${artist.displayName}, MahLovely artist`} width={portraitDimensions.width} height={portraitDimensions.height} sizes="(max-width: 760px) 100vw, 50vw" unoptimized={artist.photoUrl.startsWith('http')}/>:<span className="display" style={{fontSize:'8rem'}}>{artist.displayName.slice(0,1)}</span>}</div>
        <div className="brand-artist-story-copy"><p className="eyebrow">The artist / {artist.displayName}</p><h2>Beauty with intention.</h2><p className="intro-copy">{artist.bio}</p><div className="rule"/><p className="eyebrow">Specialties</p><p>{artist.specialties.join(' · ')}</p><Link className="button button-dark" href={slug==='shante'?'/mah-esti':'/titi-booking'}>{slug==='shante'?'Explore MAH ESTI ↗':'Book with Cee ↗'}</Link></div>
      </div>
    </section>
    {hasBrandPortfolio&&<section className="section brand-artist-work">
<<<<<<< HEAD
      <div className="container">{slug==='shante'&&<><div className="mah-profile-ribbon"><p className="eyebrow">GET TWISTED / Shante</p><h2>Locs with intention.</h2><p>Explore finished styles, fresh retwists, and the technique behind the look.</p><Link className="text-link" href="/gallery?category=locs">See the loc lookbook ↗</Link></div><BrandPortfolio artistSlug="shante" discipline="locs" mode="preview"/><div className="mah-profile-ribbon" style={{marginTop:80}}><p className="eyebrow">MAH ESTI / Shante</p><h2>Esthetics, thoughtfully done.</h2><p>Skin and body care in a separate, intentional space.</p><Link className="text-link" href="/mah-esti">See facials, body care &amp; packages ↗</Link></div></>}{<BrandPortfolio artistSlug={slug} mode="preview"/>}</div>
=======
      <div className="container">{slug==='shante'&&<div className="mah-profile-ribbon"><p className="eyebrow">MAH ESTI / Shante</p><h2>Esthetics, thoughtfully done.</h2><p>These images highlight Ke&apos;s skin and body-care work. Her real loc work is now featured in its own portfolio.</p><Link className="text-link" href="/mah-esti">See facials, body care &amp; packages ↗</Link></div>}<BrandPortfolio artistSlug={slug} mode="preview"/>{slug==='shante'&&<div className="mah-loc-profile"><div className="mah-profile-ribbon"><p className="eyebrow">Get Twisted / Loc artistry</p><h2>Real loc work by Shante.</h2><p>Explore the latest loc photos and videos, separately from MAH ESTI skincare.</p></div><BrandPortfolio artistSlug="shante-locs" mode="preview"/></div>}</div>
>>>>>>> dc93fac8f0afeebe82750a872377753558d0579b
    </section>}
    {extraPortfolio.length>0&&<section className="section brand-artist-extra"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Latest from the studio</p><h2>More of the work.</h2></div></div>
      <div className="gallery-grid">{extraPortfolio.map(item=><figure className="gallery-item" key={item.id}><GalleryMedia item={item}/><figcaption className="gallery-caption">{item.caption||item.altText}</figcaption></figure>)}</div>
    </div></section>}
    {slug==='shante'&&<section className="mah-profile-offerings"><div className="container mah-profile-offerings-inner"><div><p className="eyebrow">The MAH ESTI experience</p><h2>Facials. Body care. Spa rituals.</h2><p>Explore the complete MAH ESTI menu and start with a skin-focused consultation.</p></div><div><Link className="button button-dark" href="/mah-esti">View the MAH ESTI menu ↗</Link></div></div></section>}
    {slug==='christina'&&<section className="mah-profile-offerings"><div className="container mah-profile-offerings-inner"><div><p className="eyebrow">Your next style</p><h2>Book your look with Cee.</h2><p>Send your style details and preferred date through Cee&apos;s dedicated appointment-request form.</p></div><div><Link className="button button-dark" href="/titi-booking">Request a Cee appointment ↗</Link></div></div></section>}
        <section className="section brand-artist-menu">
      <div className="container"><div className="section-heading"><div><p className="eyebrow">The menu</p><h2>Services by {artist.displayName}.</h2></div><Link className="text-link" href={`/services?artist=${artist.slug}`}>Explore all ↗</Link></div>
      {services.length?<div className="service-grid">{services.map(s=><Link href={`/services/${s.slug}`} className="service-card" key={s.slug}>
        <p className="eyebrow">{s.category.name}</p><h3>{s.name}</h3><div className="card-bottom"><strong>{priceLabel(s)}</strong><span className="text-link">Details ↗</span></div>
      </Link>)}</div>:<div className="empty-state"><p>{artist.displayName}&apos;s service menu is being prepared.</p><Link className="button button-outline" href="/contact">Get in touch</Link></div>}
      </div>
    </section>
    {slug==='shante'&&<section className="section shante-policy-profile"><div className="container"><ShanteLocPolicies compact/></div></section>}
    <section className="cta-band brand-closing"><p className="eyebrow">Your next visit</p><h2>Come through. Leave lovely.</h2><Link className="button button-light" href={slug==='shante'?'/mah-esti#consultation':'/titi-booking'}>{slug==='shante'?'Request a consultation ↗':'Book with Cee ↗'}</Link></section>
  </>;
}
