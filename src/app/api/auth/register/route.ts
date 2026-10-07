import { NextRequest,NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { randomBytes,createHash } from 'crypto';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { errorResponse,limit,safeOrigin } from '@/lib/http';
import { queueNotification } from '@/lib/notifications';
const schema=z.object({name:z.string().trim().min(2).max(120),email:z.email(),password:z.string().min(12).max(128)});
export async function POST(req:NextRequest){if(!safeOrigin(req))return errorResponse('Invalid origin',403);try{if(!await limit(req,'register',5,60))return errorResponse('Please try again later',429);if(!process.env.RESEND_API_KEY||!process.env.EMAIL_FROM||!await db.notificationTemplate.findFirst({where:{event:'email_verification',channel:'email',active:true}}))return errorResponse('Account registration is not available yet. Guest booking remains available.',503);const input=schema.parse(await req.json());const email=input.email.toLowerCase();if(await db.user.findUnique({where:{email}}))return errorResponse('An account already exists for this email',409);const token=randomBytes(32).toString('hex');const user=await db.user.create({data:{email,passwordHash:await hash(input.password,12),verificationTokenHash:createHash('sha256').update(token).digest('hex'),verificationExpiresAt:new Date(Date.now()+24*3600000),clients:{connectOrCreate:[{where:{email},create:{email,name:input.name}}]}}});await createSession(user.id);await queueNotification('email_verification',email,undefined,{link:`${req.nextUrl.origin}/api/auth/verify?token=${token}`});return NextResponse.json({ok:true})}catch(e){return errorResponse(e,e instanceof z.ZodError?400:503)}}
