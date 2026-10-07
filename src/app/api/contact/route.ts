import { NextRequest,NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { safeOrigin,limit,errorResponse } from '@/lib/http';
const schema=z.object({name:z.string().trim().min(2).max(120),email:z.email(),phone:z.string().max(30).optional(),subject:z.string().trim().min(2).max(150),message:z.string().trim().min(10).max(5000),website:z.string().optional()});
export async function POST(req:NextRequest){if(!safeOrigin(req))return errorResponse('Invalid origin',403);try{if(!await limit(req,'contact',5,60))return errorResponse('Please try again later',429);const data=schema.parse(await req.json());if(data.website)return NextResponse.json({ok:true});await db.inquiry.create({data:{name:data.name,email:data.email,phone:data.phone,subject:data.subject,message:data.message}});return NextResponse.json({ok:true})}catch(e){return errorResponse(e,e instanceof z.ZodError?400:503)}}
