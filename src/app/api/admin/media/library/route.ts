import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
export async function GET(){const user=await currentUser();if(!user||!['OWNER','ADMIN','ARTIST'].includes(user.role))return NextResponse.json({error:'Forbidden'},{status:403});const media=await db.media.findMany({orderBy:{createdAt:'desc'},take:200});return NextResponse.json(media)}
