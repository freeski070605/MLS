import type { Metadata } from 'next';
import AuthForm from '../login/auth-form';
export const metadata:Metadata={title:'Create Account'};
export default function Register(){return <section className="section"><div className="container" style={{maxWidth:570}}><p className="eyebrow">Your MahLovely account</p><h1>Join us.</h1><AuthForm mode="register"/></div></section>}
