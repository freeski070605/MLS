import { NextRequest,NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { safeOrigin,errorResponse } from '@/lib/http';
export async function POST(req:NextRequest){if(!safeOrigin(req))return errorResponse('Invalid origin',403);const parsed=z.object({token:z.string().min(32),password:z.string().min(12).max(128)}).safeParse(await req.json());if(!parsed.success)return errorResponse('Invalid request');const tokenHash=createHash('sha256').update(parsed.data.token).digest('hex');const user=await db.user.findFirst({where:{resetTokenHash:tokenHash,resetExpiresAt:{gt:new Date()}}});if(!user)return errorResponse('This link has expired',400);await db.$transaction([db.user.update({where:{id:user.id},data:{passwordHash:await hash(parsed.data.password,12),resetTokenHash:null,resetExpiresAt:null}}),db.session.deleteMany({where:{userId:user.id}})]);return NextResponse.json({ok:true})}
