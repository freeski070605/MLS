import { NextRequest,NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';
import { safeOrigin } from '@/lib/http';
export async function POST(req:NextRequest){if(!safeOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403});await signOut();return NextResponse.json({ok:true})}
