import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {db} from '@/lib/db';
import {safeOrigin,limit,errorResponse} from '@/lib/http';
import {encryptIntake,intakeReady} from '@/lib/mah-esti-security';
import {intakeSections} from '@/lib/mah-esti-intake';
import {waxingSections} from '@/lib/mah-esti-waxing';

export const runtime='nodejs';
const schema=z.object({
  answers:z.record(z.string(),z.union([z.string().max(2000),z.array(z.string().max(160)).max(30)])),
  signature:z.string().trim().min(2).max(150),
  kind:z.enum(['facial','waxing']).optional().default('facial'),
  initials:z.string().trim().min(1).max(12).optional(),
  acknowledgments:z.array(z.boolean()).length(3).optional(),
  accepted:z.literal(true),
  service:z.string().max(160).optional().default('')
});

export async function POST(req:NextRequest){
  if(!safeOrigin(req))return errorResponse('Invalid origin',403);
  if(!intakeReady())return errorResponse('Confidential intake submission is not configured',503);
  try{
    if(!await limit(req,'mah-esti-intake',3,60))return errorResponse('Too many submissions. Please try again later.',429);
    const raw=await req.text();
    if(raw.length>40000)return errorResponse('Form exceeds the maximum length',413);
    const parsed=schema.parse(JSON.parse(raw));
    const sections=parsed.kind==='waxing'?waxingSections:intakeSections;
    if(parsed.kind==='facial'&&!parsed.initials)throw new Error('Health/safety initials are required');
    if(parsed.kind==='waxing'&&(!parsed.acknowledgments||!parsed.acknowledgments.every(Boolean)))throw new Error('Safety acknowledgments are required');
    const keys=new Map(sections.flatMap(section=>section.fields.map(field=>[field.key,field] as const)));
    for(const [key,value] of Object.entries(parsed.answers)){
      const field=keys.get(key);
      if(!field)throw new Error('Unknown form field');
      if(field.type==='checks'&&(!Array.isArray(value)||value.some(v=>!field.options?.includes(v))))throw new Error('Invalid selection');
      if(field.type==='radio'&&(!field.options?.includes(value as string)||Array.isArray(value)))throw new Error('Invalid selection');
      if(!['checks','radio'].includes(field.type)&&Array.isArray(value))throw new Error('Invalid answer');
    }
    for(const field of sections.flatMap(s=>s.fields).filter(f=>f.required)){
      const value=parsed.answers[field.key];
      if(typeof value==='string'?!value.trim():!Array.isArray(value)||value.length===0)throw new Error('A required answer is missing');
    }
    if(parsed.kind==='facial'&&parsed.answers.emergencySymptoms!=='No')return errorResponse('Do not proceed with treatment. Seek immediate medical care; call 911 for an emergency.',400);
    if(parsed.kind==='waxing'&&parsed.answers.urgentConcern==='Yes'&&!String(parsed.answers.urgentConcernDetails||'').trim())return errorResponse('Please explain the urgent concern. Seek immediate medical care if necessary.',400);
    const payload={
      kind:parsed.kind,
      formVersion:parsed.kind==='waxing'?'MAH ESTI Waxing | Client Consultation & Intake / 2026-11-11':'MAH ESTI Facial Client Consultation & Skin Analysis / 2026-11-11',
      answers:parsed.answers,service:parsed.service,
      signature:parsed.signature,initials:parsed.initials||null,
      acknowledgments:parsed.kind==='waxing'?parsed.acknowledgments:null,
      consentAccepted:true, signedAt:new Date().toISOString()
    };
    const record=await db.mahEstiIntake.create({data:{encryptedPayload:encryptIntake(payload)}});
    return NextResponse.json({ok:true,reference:record.id},{headers:{'Cache-Control':'no-store'}});
  }catch(e){
    if(e instanceof z.ZodError||e instanceof SyntaxError)return errorResponse('Please review your answers and try again.',400);
    if(e instanceof Error&&['Unknown form field','Invalid selection','Invalid answer','A required answer is missing','Health/safety initials are required','Safety acknowledgments are required'].includes(e.message))return errorResponse(e.message,400);
    return errorResponse('We could not save your consultation securely. Please try again later.',503);
  }
}
