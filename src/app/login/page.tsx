import type { Metadata } from 'next';
import AuthForm from './auth-form';
export const metadata:Metadata={title:'Sign In'};
export default function Login(){return <section className="section"><div className="container" style={{maxWidth:570}}><p className="eyebrow">Your MahLovely account</p><h1>Welcome back.</h1><AuthForm mode="login"/></div></section>}
