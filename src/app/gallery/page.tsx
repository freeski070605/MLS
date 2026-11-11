import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getArtists,getCategories } from '@/lib/catalog';
import { brandCollections,allOriginalBrandUrls,isRejectedBrandMedia } from '@/lib/brand-media';
import BrandPortfolio from '@/components/brand-portfolio';
import GalleryMedia from '@/components/gallery-media';

export const metadata:Metadata={title:'The Lookbook',description:'A closer look at the craft, care, and artistry of MahLovely Studio.'};
export const dynamic='force-dynamic';

export default async function Gallery({searchParams}:{searchParams:Promise<{category?:string;artist?:string}>}){
  const q=await searchParams;
  const [categories,artists]=await Promise.all([getCategories(),getArtists()]);
  let items:Awaited<ReturnType<typeof db.galleryItem.findMany<{include:{artist:true,category:true,service:true}}>>>=[];
  try{
    items=await db.galleryItem.findMany({
      where:{published:true,category:q.category?{slug:q.category}:undefined,artist:q.artist?{slug:q.artist}:undefined},
      include:{artist:true,category:true,service:true},orderBy:{displayOrder:'asc'},take:72
    });
  }catch{}
  const showShante=(!q.artist||q.artist==='shante')&&(!q.category||q.category==='esthetics');
  const showLocs=(!q.artist||q.artist==='shante')&&(!q.category||q.category==='locs');
  const showCee=(!q.artist||q.artist==='christina')&&(!q.category||q.category==='braids');
  const customItems=items.filter(item=>!isRejectedBrandMedia(item.imageUrl)&&!allOriginalBrandUrls.has(item.imageUrl||item.videoUrl||''));
  const anyWork=showShante||showCee||showLocs||customItems.length>0;
  return <>
    <section className="brand-gallery-hero">
      <div className="container brand-gallery-hero-inner">
        <div className="brand-gallery-hero-copy"><p className="eyebrow">MahLovely studio / the work</p><h1>The lookbook<span>.</span></h1><p>Real artistry, up close. Explore the details, the process, and the finished looks that make each artist&apos;s work their own.</p><span className="brand-gallery-hero-number">01 — BEAUTY WITH INTENTION</span></div>
        <div className="brand-gallery-hero-visuals">
          <div className="brand-gallery-visual brand-gallery-visual-one"><Image src={brandCollections.shante.photos[1].src} alt={brandCollections.shante.photos[1].alt} fill priority sizes="(max-width: 760px) 45vw, 20vw" className="brand-image"/></div>
          <div className="brand-gallery-visual brand-gallery-visual-two"><Image src={brandCollections.christina.photos[1].src} alt={brandCollections.christina.photos[1].alt} fill priority sizes="(max-width: 760px) 55vw, 27vw" className="brand-image"/></div>
        </div>
      </div>
    </section>
    <section className="section-tight brand-gallery-body"><div className="container">
      <div className="brand-gallery-filters"><span className="eyebrow">Browse the work</span>
        <div className="filter-row">
          <Link className={'filter-pill'+(!q.category&&!q.artist?' active':'')} href="/gallery">All work</Link>
          {artists.map(a=><Link className={'filter-pill'+(q.artist===a.slug?' active':'')} key={a.slug} href={`/gallery?artist=${a.slug}`}>{a.displayName}</Link>)}
          {categories.map(c=><Link className={'filter-pill'+(q.category===c.slug?' active':'')} key={c.slug} href={`/gallery?category=${c.slug}`}>{c.name}</Link>)}
        </div>
      </div>
      {showShante&&<section className="brand-gallery-artist" aria-label="Shante portfolio">
        <div className="brand-gallery-artist-heading"><span className="brand-gallery-index">01 / ARTIST</span><h2>Shante<span>.</span></h2><p>MAH ESTI / facials, body care &amp; spa experiences</p><Link className="text-link" href="/artists/shante">Meet the artist ↗</Link></div>
        <BrandPortfolio artistSlug="shante" mode="full"/><p className="mah-lookbook-link"><Link className="button button-dark" href="/mah-esti">Explore MAH ESTI treatments ↗</Link></p>
      </section>}
      {showLocs&&<section className="brand-gallery-artist" aria-label="GET TWISTED loc portfolio">
        <div className="brand-gallery-artist-heading"><span className="brand-gallery-index">GET TWISTED / SHANTE</span><h2>The loc edit<span>.</span></h2><p>Retwists, finished styles &amp; loc care</p><Link className="text-link" href="/artists/shante">Meet Shante ↗</Link></div>
        <BrandPortfolio artistSlug="shante" discipline="locs" mode="full"/>
      </section>}
      {showCee&&<section className="brand-gallery-artist" aria-label="Cee portfolio">
        <div className="brand-gallery-artist-heading"><span className="brand-gallery-index">02 / ARTIST</span><h2>Cee<span>.</span></h2><p>Braiding &amp; natural hair</p><Link className="text-link" href="/artists/christina">Meet the artist ↗</Link></div>
        <BrandPortfolio artistSlug="christina" mode="full"/>
      </section>}
      {customItems.length>0&&<section className="brand-gallery-extra">
        <div className="section-heading"><div><p className="eyebrow">More from the studio</p><h2>Recent work.</h2></div></div>
        <div className="gallery-grid">{customItems.map(item=><figure className="gallery-item" key={item.id}>
          <GalleryMedia item={item}/>{item.beforeUrl&&item.afterUrl&&<div className="brand-before-after"><Image src={item.beforeUrl} alt={'Before: '+item.altText} width={350} height={500} unoptimized={item.beforeUrl.startsWith('http')}/><Image src={item.afterUrl} alt={'After: '+item.altText} width={350} height={500} unoptimized={item.afterUrl.startsWith('http')}/></div>}
          <figcaption className="gallery-caption"><strong>{item.caption||item.altText}</strong><span>{item.artist?.displayName}{item.service&&<> · <Link className="text-link" href={`/services/${item.service.slug}`}>See service ↗</Link></>}</span></figcaption>
        </figure>)}</div>
      </section>}
      {!anyWork&&<div className="empty-state"><h3>Something beautiful is in the works.</h3><p>Explore another artist or view all available work.</p><Link className="button button-outline" href="/gallery">View all work ↗</Link></div>}
    </div></section>
    <section className="cta-band brand-closing"><p className="eyebrow">Loved what you saw?</p><h2>Make it yours.</h2><Link className="button button-light" href="/book">Book your next visit ↗</Link></section>
  </>;
}
