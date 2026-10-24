import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getArtists } from '@/lib/catalog';
export const metadata:Metadata={title:'Our Artists',description:'Meet the artists of MahLovely Studio.'};
export const dynamic='force-dynamic';
export default async function Artists(){const artists=await getArtists();return <><section className="page-hero"><div className="container"><p className="eyebrow">The people behind MahLovely</p><h1>Meet your artists.</h1><p>Each artist brings a distinct craft and a shared commitment to a thoughtful experience.</p></div></section><section className="section"><div className="container artist-grid">{artists.map(a=><Link className={`artist-card${a.photoUrl||a.coverUrl?' artist-card-image':''}`} key={a.slug} href={`/artists/${a.slug}`}>{(a.photoUrl||a.coverUrl)&&<Image src={a.photoUrl||a.coverUrl||''} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" loading="lazy" unoptimized={(a.photoUrl||a.coverUrl||'').startsWith('http')} className="artist-card-photo"/>}<p className="eyebrow">Artist</p><h3>{a.displayName}</h3><p>{a.roleLabels.join(' + ')}</p><p>{a.bio}</p><span className="text-link">Meet {a.displayName} ↗</span></Link>)}</div></section></>}
