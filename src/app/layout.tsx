import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import { brand, setting, siteUrl } from '@/lib/site';
import { getArtists, getCategories } from '@/lib/catalog';
import AnalyticsClient from './analytics-client';

export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'MahLovely Studio | Hair, Locs & Esthetics',template:'%s | MahLovely Studio'},description:brand.description,openGraph:{title:'MahLovely Studio',description:brand.tagline,type:'website',images:['/images/editorial-hero.png']},icons:{icon:'/brand/mahlovely-logo.png',apple:'/brand/mahlovely-logo.png'},robots:{index:true,follow:true}};
export default async function RootLayout({children}:{children:React.ReactNode}){
  const [artists,categories,contact,mainNav]=await Promise.all([getArtists(),getCategories(),setting('contact',{} as {email?:string;phone?:string;address?:string;hours?:string;instagram?:string;tiktok?:string}),setting('navigation',[{label:'Home',href:'/'},{label:'Services',href:'/services'},{label:'Artists',href:'/artists'},{label:'Gallery',href:'/gallery'},{label:'About',href:'/about'},{label:'Policies',href:'/policies'},{label:'Contact',href:'/contact'}])]);
  return (
    <html lang="en">
      <body>
        <AnalyticsClient enabled={Boolean(process.env.MONGODB_URI)} />
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="site-header">
          <div className="nav-shell">
            <Link className="brand-lockup" href="/" aria-label="MahLovely Studio home">
              <Image src="/brand/mahlovely-logo.png" alt="" width={82} height={82} priority />
              <span className="wordmark"><span>MAHLOVELY</span><small>STUDIO</small></span>
            </Link>
            <nav className="desktop-nav" aria-label="Main navigation">
              {mainNav.filter(item => item.href.startsWith('/')).map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            </nav>
            <Link className="button button-dark header-book" href="/book">Book now <span aria-hidden="true">↗</span></Link>
            <details className="mobile-menu">
              <summary aria-label="Open menu">Menu <span>☰</span></summary>
              <nav aria-label="Mobile navigation">
                {mainNav.filter(item => item.href.startsWith('/')).map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
                <Link href="/faq">FAQ</Link>
                <Link href="/book">Book now</Link>
              </nav>
              <Link className="button button-dark header-book" href="/book">Book now <span aria-hidden="true">↗</span></Link>
            </details>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <Link className="footer-logo" href="/" aria-label="MahLovely Studio home">
                <Image src="/brand/mahlovely-logo.png" alt="MahLovely Studio" width={180} height={180} />
              </Link>
              <p>Your Hair. Your Skin. Your Crown.</p>
              <p>Hair artistry and esthetic care, together in one studio.</p>
            </div>
            <div>
              <h3>Explore</h3>
              <Link href="/services">Services</Link>
              <Link href="/artists">Artists</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/about">About</Link>
              <Link href="/appointment-prep">Appointment prep</Link>
            </div>
            <div>
              <h3>Discover</h3>
              {categories.map(c => <Link key={c.slug} href={`/services?category=${c.slug}`}>{c.name}</Link>)}
              {artists.map(a => <Link key={a.slug} href={`/artists/${a.slug}`}>{a.displayName}</Link>)}
            </div>
            <div>
              <h3>Connect</h3>
              {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
              {contact.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}
              {contact.address && <p>{contact.address}</p>}
              {contact.hours && <p>{contact.hours}</p>}
              {contact.instagram && <a href={contact.instagram} rel="noopener noreferrer" target="_blank">Instagram ↗</a>}
              {contact.tiktok && <a href={contact.tiktok} rel="noopener noreferrer" target="_blank">TikTok ↗</a>}
              <Link href="/contact">Contact us</Link>
            </div>
          </div>
          <div className="container footer-bottom">
            <span>© {new Date().getFullYear()} MahLovely Studio</span>
            <div>
              <Link href="/policies">Policies</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/accessibility">Accessibility</Link>
              <Link href="/search">Search</Link>
            </div>
          </div>
        </footer>
        <Link className="mobile-book-bar" href="/book">Book an appointment <span>↗</span></Link>
      </body>
    </html>
  );
}
