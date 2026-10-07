import type { Metadata } from 'next';
import Link from 'next/link';
import { getArtists } from '@/lib/catalog';
export const metadata:Metadata={title:'Our Artists',description:'Meet the artists of MahLovely Studio.'};
export default async function Artists(){const artists=await getArtists();return <><section className="page-hero"><div className="container"><p className="eyebrow">The people behind MahLovely</p><h1>Meet your artists.</h1><p>Each artist brings a distinct craft and a shared commitment to a thoughtful experience.</p></div></section><section className="section"><div className="container artist-grid">{artists.map(a=><Link className="artist-card" key={a.slug} href={`/artists/${a.slug}`}><p className="eyebrow">Artist</p><h3>{a.displayName}</h3><p>{a.roleLabels.join(' + ')}</p><p>{a.bio}</p><span className="text-link">Meet {a.displayName} ↗</span></Link>)}</div></section></>}
