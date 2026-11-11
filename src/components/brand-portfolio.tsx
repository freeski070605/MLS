import Image from 'next/image';
import Link from 'next/link';
import { brandCollections,locCollection } from '@/lib/brand-media';

type Props={artistSlug:'shante'|'christina';mode?:'preview'|'full';discipline?:'esthetics'|'locs'};

export default function BrandPortfolio({artistSlug,mode='preview',discipline='esthetics'}:Props){
  const collection=artistSlug==='shante'&&discipline==='locs'?locCollection:brandCollections[artistSlug];
  const preview=mode==='preview';
  const photos=preview?collection.photos.slice(0,3):collection.photos;
  const films=preview?collection.films.slice(0,1):collection.films;
  return <div className="brand-portfolio">
    <div className="brand-portfolio-intro">
      <div><p className="eyebrow">The work / {collection.name}</p><h3>Made with intention.</h3></div>
      <p>{collection.intro}</p>
    </div>
    <div className={`brand-portfolio-photos ${preview?'is-preview':''}`}>
      {photos.map((photo,index)=><figure className="brand-photo" key={photo.original}>
        <div className="brand-photo-frame">
          <Image src={photo.src} alt={photo.alt} fill sizes={preview?'(max-width: 760px) 85vw, 33vw':'(max-width: 760px) 85vw, (max-width: 1100px) 45vw, 29vw'} style={{objectPosition:photo.position||'center'}} className="brand-image" loading="lazy"/>
        </div>
        <figcaption><span>{String(index+1).padStart(2,'0')} / {photo.caption}</span></figcaption>
      </figure>)}
    </div>
    <div className="brand-portfolio-motion">
      <div className="brand-motion-heading"><div><p className="eyebrow">In motion</p><h3>From the chair.</h3></div><span className="brand-small-note">Press play to see the work</span></div>
      <div className={`brand-films ${preview?'is-preview':''}`}>
        {films.map(film=><figure className="brand-film" key={film.src}>
          <div className="brand-film-frame">
            <video controls playsInline preload="none" poster={film.poster} aria-label={film.title}>
              <source src={film.src} type="video/mp4"/>
              Your browser does not support this video.
            </video>
          </div>
          <figcaption>{film.title}</figcaption>
        </figure>)}
      </div>
    </div>
    {preview&&<Link className="text-link brand-view-all" href={`/gallery?artist=${artistSlug}`}>Explore {collection.name}&apos;s full lookbook ↗</Link>}
  </div>;
}
