import AuthForm from '../login/auth-form';
export const metadata={title:'Choose a New Password'};
export default async function Reset({searchParams}:{searchParams:Promise<{token?:string}>}){const q=await searchParams;return <section className="section"><div className="container" style={{maxWidth:570}}><h1>Choose a new password.</h1><AuthForm mode="reset" token={q.token}/></div></section>}
