import { NextRequest,NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
const schema=z.object({name:z.enum(['page_view','service_view','artist_view','booking_started','service_selected','booking_abandoned','booking_completed','cta_click','contact_submitted']),path:z.string().max(500).optional(),entityId:z.string().max(100).optional(),source:z.string().max(100).optional()});
export async function POST(req:NextRequest){let body:unknown;try{body=await req.json()}catch{return NextResponse.json({ok:false,error:'Invalid request body'},{status:400})}const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({ok:false,error:'Invalid analytics event'},{status:400});try{await db.analyticsEvent.create({data:parsed.data});return NextResponse.json({ok:true})}catch(error){console.error('Failed to store analytics event',error);return NextResponse.json({ok:false,error:'Analytics is temporarily unavailable'},{status:503})}}
