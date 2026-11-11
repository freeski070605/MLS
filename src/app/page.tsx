import Image from 'next/image';
import Link from 'next/link';
import GalleryMedia from '@/components/gallery-media';
import { getArtists,getCategories,getServices } from '@/lib/catalog';
import { brandCollections,allOriginalBrandUrls,excludedBrandUrls } from '@/lib/brand-media';
import { content,priceLabel,setting } from '@/lib/site';
import { db } from '@/lib/db';

export const dynamic='force-dynamic';

export default async function Home(){
  const [artists,categories,services,heroTitle,heroBody,introTitle,introBody,heroCtas]=await Promise.all([
    getArtists(),getCategories(),getServices(),
    content('home.hero.title','Your Hair. Your Skin. Your Crown.'),
    content('home.hero.body','Natural Hair · Braids · Locs · Esthetics'),
    content('home.intro.title','Two artists. One lovely experience.'),
    content('home.intro.body','Professional hair care, protective styling, loc artistry, and esthetic care come together under one studio brand.'),
    setting('heroCtas',{primary:{label:'Book an appointment',href:'/book'},secondary:{label:'Explore services',href:'/services'}})
  ]);
  let gallery:Awaited<ReturnType<typeof db.galleryItem.findMany>>=[];
  let testimonials:{id:string;displayName:string;text:string;rating:number}[]=[];
  let social:{id:string;mediaUrl:string;destinationUrl:string;altText:string;platform:string}[]=[];
  try{[gallery,testimonials,social]=await Promise.all([
    db.galleryItem.findMany({where:{published:true,featured:true},take:3,orderBy:{displayOrder:'asc'}}),
    db.testimonial.findMany({where:{status:'PUBLISHED',featured:true},take:3,orderBy:{createdAt:'desc'}}),
    db.socialPost.findMany({where:{published:true,featured:true},take:4,orderBy:{displayOrder:'asc'}})
  ]);}catch{}
  const studioUpdates=gallery.filter(item=>!allOriginalBrandUrls.has(item.imageUrl||item.videoUrl||'')&&!excludedBrandUrls.has(item.imageUrl||item.videoUrl||''));
  const cee=brandCollections.christina;
  const shante=brandCollections.shante;
  return <>
    <section className="brand-hero">
      <div className="container brand-hero-inner">
        <div className="brand-hero-copy">
          <p className="eyebrow">A studio for every version of you</p>
          <h1>{heroTitle}</h1>
          <p className="brand-hero-subhead">{heroBody}</p>
          <div className="hero-actions">
            <Link className="button button-dark" href={heroCtas.primary.href}>{heroCtas.primary.label} ↗</Link>
            <Link className="button button-outline" href={heroCtas.secondary.href}>{heroCtas.secondary.label}</Link>
          </div>
          <div className="brand-hero-signature"><span>01 / 02</span><span>Two artists. One point of view.</span></div>
        </div>
        <div className="brand-hero-editorial" aria-label="A glimpse of MahLovely Studio's artists' work">
          <figure className="brand-hero-image brand-hero-image-main">
            <Image src={cee.photos[0].src} alt={cee.photos[0].alt} fill priority sizes="(max-width: 760px) 65vw, 32vw" className="brand-image"/>
            <figcaption><span>01</span> Braids by Cee</figcaption>
          </figure>
          <figure className="brand-hero-image brand-hero-image-side">
            <Image src={shante.photos[0].src} alt={shante.photos[0].alt} fill priority sizes="(max-width: 760px) 44vw, 20vw" className="brand-image"/>
            <figcaption><span>02</span> MAH ESTI by Shante</figcaption>
          </figure>
          <div className="brand-hero-seal"><Image src="/brand/mahlovely-logo-transparent.png" alt="MahLovely Studio" width={155} height={155}/></div>
        </div>
      </div>
      <div className="brand-hero-marquee" aria-hidden="true"><span>BEAUTY WITH INTENTION</span><span>THE ART OF YOUR CROWN</span><span>LOC ARTISTRY</span><span>NATURAL HAIR &amp; BRAIDS</span></div>
    </section>

    <section className="section brand-intro">
      <div className="container intro-grid">
        <div><p className="eyebrow">Welcome to MahLovely</p><h2>{introTitle}</h2></div>
        <div className="intro-copy"><div className="rule"/><p>{introBody}</p><p className="brand-intro-note">Real craft. Personal care. Beautiful outcomes.</p><Link className="text-link" href="/about">Our story ↗</Link></div>
      </div>
    </section>

    <section className="section dark-section brand-artists-section">
      <div className="container">
        <div className="section-heading"><div><p className="eyebrow">Behind the work</p><h2>Meet the artists.</h2></div><p className="section-intro">Different specialties. The same commitment to making every visit feel personal.</p></div>
        <div className="artist-grid">{artists.map(a=>{const portrait=a.photoUrl||a.coverUrl;return <Link className={'artist-card'+(portrait?' artist-card-image':'')} key={a.slug} href={`/artists/${a.slug}`}>
          {portrait&&<Image src={portrait} alt={a.displayName} fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized={portrait.startsWith('http')} className="artist-card-photo"/>}
          <p className="eyebrow">MahLovely artist</p><h3>{a.displayName}</h3><p className="brand-artist-role">{a.roleLabels.join(' + ')}</p><span className="text-link">Meet {a.displayName} ↗</span>
        </Link>})}</div>
      </div>
    </section>

    <section className="section brand-services-section">
      <div className="container">
        <div className="section-heading"><div><p className="eyebrow">The art of care</p><h2>Find your thing.</h2></div><Link className="text-link" href="/services">Explore the full menu ↗</Link></div>
        <div className="brand-category-grid">{categories.map((c,i)=>{
          const artwork=c.slug==='esthetics'?shante.photos[1]:c.slug==='braids'?cee.photos[1]:null;
          return <Link className={'brand-category'+(artwork?' has-art':'')} key={c.slug} href={`/services?category=${c.slug}`}>
            {artwork&&<Image src={artwork.src} alt={artwork.alt} fill sizes="(max-width: 760px) 100vw, 27vw" className="brand-image" loading="lazy"/>}
            <div className="brand-category-content"><span>0{i+1} / {c.name}</span><h3>{c.name}</h3><p>{c.description}</p><span className="brand-category-arrow">Explore ↗</span></div>
          </Link>})}</div>
      </div>
    </section>

    <section className="section brand-motion-section">
      <div className="container">
        <div className="brand-motion-title"><div><p className="eyebrow">The details are everything</p><h2>More than a finished look.</h2></div><p>It&apos;s the care, the hands, and the process behind it. Get a closer look at the artistry.</p></div>
        <div className="brand-motion-duo">
          {[{collection:shante,slug:'shante'},{collection:cee,slug:'christina'}].map(({collection,slug})=><article className="brand-motion-feature" key={slug}>
            <div className="brand-motion-video"><video controls playsInline preload="none" poster={collection.films[0].poster} aria-label={collection.films[0].title}><source src={collection.films[0].src} type="video/mp4"/>Your browser does not support this video.</video></div>
            <div className="brand-motion-info"><div><span className="eyebrow">From the chair / {collection.name}</span><h3>{collection.discipline}</h3></div><Link className="text-link" href={slug==='shante'?'/mah-esti':`/gallery?artist=${slug}`}>Explore the work ↗</Link></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="mah-home-promo"><div className="container mah-home-promo-inner">
      <div><p className="eyebrow">Introducing / MAH ESTI by Shante</p><h2>Redeem. Relax. <em>Glow.</em></h2><p>Signature facials, targeted body treatments and luxury spa experiences. Discover seven core facials, five body rituals and six curated packages.</p><Link className="button button-light" href="/mah-esti">Explore MAH ESTI ↗</Link></div>
      <div className="mah-home-promo-side"><span>THE MAH ESTI EDIT</span><strong>Skin, but make it personal.</strong><p>Your consultation is where it all begins.</p></div>
    </div></section>
        <section className="section brand-lookbook-section">
      <div className="container">
        <div className="section-heading"><div><p className="eyebrow">The lookbook</p><h2>Every detail tells a story.</h2></div><Link className="text-link" href="/gallery">View the lookbook ↗</Link></div>
        <div className="brand-lookbook-grid">
          {[{photo:cee.photos[2],artist:'Cee',slug:'christina'},{photo:shante.photos[2],artist:'Shante',slug:'shante'},{photo:cee.photos[3],artist:'Cee',slug:'christina'}].map(({photo,artist,slug},i)=><Link className="brand-lookbook-tile" key={photo.src} href={`/gallery?artist=${slug}`}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 95vw, 33vw" loading="lazy" className="brand-image"/>
            <span className="brand-lookbook-caption"><span>0{i+1} / {artist}</span><strong>{photo.caption}</strong><span>Discover ↗</span></span>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="section brand-featured-services"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Begin here</p><h2>Signature services.</h2></div><Link className="text-link" href="/services">The full menu ↗</Link></div>
      <div className="service-grid">{services.filter(s=>s.featured).slice(0,6).map(s=><article className="service-card" key={s.slug}>
        <p className="eyebrow">{s.category.name}</p><h3><Link href={`/services/${s.slug}`}>{s.name}</Link></h3>
        <p className="muted">{s.shortDescription||'Care and styling tailored to you.'}</p>
        <div className="card-bottom"><strong>{priceLabel(s)}</strong><Link className="text-link" href={`/services/${s.slug}`}>Explore ↗</Link></div>
      </article>)}</div>
    </div></section>

    {studioUpdates.length>0&&<section className="section brand-community-section"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Fresh from the studio</p><h2>Recently featured.</h2></div><Link className="text-link" href="/gallery">More work ↗</Link></div>
      <div className="gallery-grid">{studioUpdates.map(item=><figure className="gallery-item" key={item.id}><GalleryMedia item={item}/><figcaption className="gallery-caption">{item.caption||item.altText}</figcaption></figure>)}</div>
    </div></section>}

    {testimonials.length>0&&<section className="section brand-testimonials"><div className="container">
      <p className="eyebrow">Kind words</p><h2>From the chair.</h2><div className="service-grid">{testimonials.map(t=><blockquote className="service-card" key={t.id}>
        <p aria-label={`${t.rating} out of 5 stars`}>{'★'.repeat(t.rating)}</p><p>“{t.text}”</p><cite>— {t.displayName}</cite>
      </blockquote>)}</div>
    </div></section>}

    <section className="cta-band brand-closing"><p className="eyebrow">Your next chapter looks lovely</p><h2>Make room for your crown.</h2><p>Care, confidence, and artistry start with your next appointment.</p><Link className="button button-light" href="/book">Book your appointment ↗</Link></section>

    {social.length>0&&<section className="section-tight social-band"><div className="container">
      <p className="eyebrow">Keep up with the studio</p><h2>Follow the lovely.</h2><div className="gallery-grid">{social.map(post=><a className="gallery-item" key={post.id} href={post.destinationUrl} target="_blank" rel="noopener noreferrer">
        <Image src={post.mediaUrl} alt={post.altText} width={500} height={500} unoptimized={post.mediaUrl.startsWith('http')}/><span className="gallery-caption">{post.platform} ↗</span>
      </a>)}</div>
    </div></section>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BeautySalon',name:'MahLovely Studio',url:process.env.SITE_URL||'http://localhost:3000',image:`${process.env.SITE_URL||'http://localhost:3000'}/brand/mahlovely-logo.png`})}}/>
  </>;
}
