'use client';
export default function Error({reset}:{error:Error;reset:()=>void}){return <section className="section"><div className="container prose"><p className="eyebrow">Something went wrong</p><h1>Let&apos;s try that again.</h1><p>We could not load this page right now.</p><button className="button button-dark" onClick={reset}>Try again</button></div></section>}
