import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'crypto';
import { db } from './db';
import { redirect } from 'next/navigation';
import type { UserRole } from '@prisma/client';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 86400000);
  await db.session.create({ data: { userId, tokenHash: hash(token), expiresAt } });
  (await cookies()).set('ml_session', token, { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', path:'/', expires:expiresAt });
}
export async function currentUser() {
  const token = (await cookies()).get('ml_session')?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { tokenHash:hash(token) }, include:{ user:{include:{artists:true,clients:true}} } });
  if (!session || session.expiresAt <= new Date()) return null;
  const { artists, clients, ...user } = session.user;
  return { ...user, artist: artists[0] ?? null, client: clients[0] ?? null };
}
export async function requireUser(roles?: UserRole[]) {
  const user = await currentUser();
  if (!user) redirect('/login');
  if (roles && !roles.includes(user.role)) redirect('/account');
  return user;
}
export async function signOut() {
  const jar = await cookies(); const token=jar.get('ml_session')?.value;
  if(token) await db.session.deleteMany({where:{tokenHash:hash(token)}});
  jar.delete('ml_session');
}
