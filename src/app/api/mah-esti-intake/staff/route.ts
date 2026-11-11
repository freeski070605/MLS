import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {currentUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {safeOrigin,limit,errorResponse} from '@/lib/http';
import {encryptIntake,intakeReady} from '@/lib/mah-esti-security';
import {estheticianFields} from '@/lib/mah-esti-intake';

export const runtime='nodejs';
const schema=z.object({
  id:z.string().regex(/^[0-9a-f]{24}$/i),
  status:z.enum(['new','reviewed','follow-up','completed']),
  notes:z.record(z.string(),z.string().max(2000))
});
export async function POST(req:NextRequest){
 if(!safeOrigin(req))return errorResponse('Invalid origin',403);
 const user=await currentUser();
 if(!user||!['OWNER','ADMIN','ARTIST'].includes(user.role)||user.role==='ARTIST'&&user.artist?.slug!=='shante')return errorResponse('Forbidden',403);
 if(!intakeReady())return errorResponse('Secure intake encryption is not configured',503);
 try{
  if(!await limit(req,'mah-esti-staff',20,60))return errorResponse('Please try again later',429);
  const raw=await req.text();if(raw.length>25000)return errorResponse('Notes too long',413);
  const data=schema.parse(JSON.parse(raw));
  const allowed=new Set(estheticianFields.map(f=>f.key));
  if(Object.keys(data.notes).some(k=>!allowed.has(k)))return errorResponse('Invalid notes',400);
  await db.mahEstiIntake.update({where:{id:data.id},data:{encryptedNotes:encryptIntake({notes:data.notes,updatedBy:user.id,updatedAt:new Date().toISOString()}),status:data.status}});
  return NextResponse.json({ok:true});
 }catch{return errorResponse('Could not save confidential notes',400)}
}
