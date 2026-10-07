import { content } from '@/lib/site';
export const metadata={title:'Privacy'};
export default async function Privacy(){const body=await content('legal.privacy','We collect the information you provide when contacting or booking with MahLovely Studio. Your account and appointment details are used to manage your visits. Contact the studio to ask about your personal information.');return <section className="section"><div className="container prose"><p className="eyebrow">Legal</p><h1>Privacy.</h1><p style={{whiteSpace:'pre-wrap'}}>{body}</p></div></section>}
