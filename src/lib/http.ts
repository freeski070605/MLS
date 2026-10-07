import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { db } from './db';
export function safeOrigin(req:NextRequest){const origin=req.headers.get('origin');return !origin || new URL(origin).host===req.nextUrl.host}
export async function limit(req:NextRequest,name:string,max:number,minutes=15){const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';const sessionHash=createHash('sha256').update(`${name}:${ip}:${process.env.AUTH_SECRET||'dev'}`).digest('hex');const since=new Date(Date.now()-minutes*60000);const count=await db.analyticsEvent.count({where:{name:`rate:${name}`,sessionHash,createdAt:{gte:since}}});if(count>=max)return false;await db.analyticsEvent.create({data:{name:`rate:${name}`,sessionHash}});return true}
export function errorResponse(error:unknown,status=400){return NextResponse.json({error:error instanceof Error?error.message:'Request failed'},{status})}
