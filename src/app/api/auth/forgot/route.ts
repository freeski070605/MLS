import { NextRequest,NextResponse } from 'next/server';
import { randomBytes,createHash } from 'crypto';
import { z } from 'zod';
import { db } from '@/lib/db';
import { queueNotification } from '@/lib/notifications';
import { safeOrigin,limit } from '@/lib/http';
export async function POST(req:NextRequest){if(!safeOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403});if(!await limit(req,'forgot',5,60))return NextResponse.json({error:'Please try again later'},{status:429});const parsed=z.object({email:z.email()}).safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Invalid email'},{status:400});const email=parsed.data.email.toLowerCase();const user=await db.user.findUnique({where:{email}});if(user){const token=randomBytes(32).toString('hex');await db.user.update({where:{id:user.id},data:{resetTokenHash:createHash('sha256').update(token).digest('hex'),resetExpiresAt:new Date(Date.now()+3600000)}});await queueNotification('password_reset',email,undefined,{link:`${req.nextUrl.origin}/reset-password?token=${token}`})}return NextResponse.json({ok:true})}
