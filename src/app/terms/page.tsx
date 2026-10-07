import { content } from '@/lib/site';
export const metadata={title:'Terms'};
export default async function Terms(){const body=await content('legal.terms','Please review the published studio policies before booking. Service details and estimates are shown on the relevant service page and at checkout.');return <section className="section"><div className="container prose"><p className="eyebrow">Legal</p><h1>Terms.</h1><p style={{whiteSpace:'pre-wrap'}}>{body}</p></div></section>}
