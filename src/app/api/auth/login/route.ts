import { NextRequest,NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { errorResponse,limit,safeOrigin } from '@/lib/http';
export async function POST(req:NextRequest){if(!safeOrigin(req))return errorResponse('Invalid origin',403);try{if(!await limit(req,'login',10,15))return errorResponse('Please try again later',429);const input=z.object({email:z.email(),password:z.string()}).parse(await req.json());const user=await db.user.findUnique({where:{email:input.email.toLowerCase()}});if(!user?.passwordHash||!await compare(input.password,user.passwordHash))return errorResponse('Invalid email or password',401);await createSession(user.id);return NextResponse.json({ok:true,role:user.role})}catch(e){return errorResponse(e,e instanceof z.ZodError?400:503)}}
