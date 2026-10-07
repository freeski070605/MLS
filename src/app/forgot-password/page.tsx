import AuthForm from '../login/auth-form';
export const metadata={title:'Reset Password'};
export default function Forgot(){return <section className="section"><div className="container" style={{maxWidth:570}}><h1>Reset your password.</h1><AuthForm mode="forgot"/></div></section>}
