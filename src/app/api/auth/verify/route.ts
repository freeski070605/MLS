import { NextRequest,NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { db } from '@/lib/db';
export async function GET(req:NextRequest){const token=req.nextUrl.searchParams.get('token');if(!token)return NextResponse.redirect(new URL('/login?verified=invalid',req.url));const user=await db.user.findFirst({where:{verificationTokenHash:createHash('sha256').update(token).digest('hex'),verificationExpiresAt:{gt:new Date()}}});if(!user)return NextResponse.redirect(new URL('/login?verified=invalid',req.url));await db.user.update({where:{id:user.id},data:{verifiedAt:new Date(),verificationTokenHash:null,verificationExpiresAt:null}});return NextResponse.redirect(new URL('/account',req.url))}
