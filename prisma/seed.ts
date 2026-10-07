import { PrismaClient, PriceType } from '@prisma/client';
import { hash } from 'bcryptjs';
import { artistRenamePatch,legacyArtistProfiles,type LegacyArtistProfile } from './artist-names';
const db=new PrismaClient();
async function ensureArtist(profile:LegacyArtistProfile){
  const [legacy,current]=await Promise.all([db.artist.findUnique({where:{slug:profile.legacySlug}}),db.artist.findUnique({where:{slug:profile.slug}})]);
  if(legacy&&current&&legacy.id!==current.id)throw new Error(`Both legacy and public artist profiles exist for ${profile.displayName}; reconcile them before seeding.`);
  const artist=legacy||current;
  if(!artist)return db.artist.create({data:{slug:profile.slug,name:profile.displayName,displayName:profile.displayName,roleLabels:[...profile.roleLabels],specialties:[...profile.specialties],bio:profile.bio,displayOrder:profile.displayOrder}});
  const changes=artistRenamePatch(artist,profile);
  return Object.keys(changes).length?db.artist.update({where:{id:artist.id},data:changes}):artist;
}
async function main(){
  for(const profile of legacyArtistProfiles){
    const [legacy,current]=await Promise.all([db.artist.findUnique({where:{slug:profile.legacySlug},select:{id:true}}),db.artist.findUnique({where:{slug:profile.slug},select:{id:true}})]);
    if(legacy&&current&&legacy.id!==current.id)throw new Error(`Both legacy and public artist profiles exist for ${profile.displayName}; reconcile them before seeding.`);
  }
  const categories=[
    {slug:'braids',name:'Braids',description:'Natural-hair and protective braided styles.',displayOrder:1},
    {slug:'natural-hair',name:'Natural Hair',description:'Care and styling for your natural texture.',displayOrder:2},
    {slug:'locs',name:'Locs',description:'Loc artistry and care tailored to you.',displayOrder:3},
    {slug:'esthetics',name:'Esthetics',description:'Intentional esthetic care tailored to you.',displayOrder:4}
  ];
  for(const category of categories){
    const existing=await db.category.findUnique({where:{slug:category.slug}});
    const oldDescription=category.slug==='locs'?'Loc artistry and care by Ke.':category.slug==='esthetics'?'Intentional esthetic care by Ke.':null;
    await db.category.upsert({where:{slug:category.slug},create:category,update:oldDescription&&existing?.description===oldDescription?{description:category.description}:{}});
  }
  const shante=await ensureArtist(legacyArtistProfiles[0]);
  const christina=await ensureArtist(legacyArtistProfiles[1]);
  const serviceData:{slug:string;name:string;category:string;priceType:PriceType;priceMin?:number;priceMax?:number;description?:string;order:number}[]=[
    {slug:'all-braiding-styles',name:'All Braiding Styles',category:'braids',priceType:'STARTING',priceMin:10000,description:'Natural-hair and protective braided styles. Final pricing varies depending on desired style, length, braid size, and hair density.',order:1},
    {slug:'silk-press',name:'Silk Press',category:'natural-hair',priceType:'FIXED',priceMin:6500,order:2},
    {slug:'curls',name:'Curls',category:'natural-hair',priceType:'FIXED',priceMin:7500,order:3},
    {slug:'wash-n-go',name:'Wash-N-Go',category:'natural-hair',priceType:'FIXED',priceMin:5500,order:4},
    {slug:'foundation-braid-down',name:'Foundation Braid Down',category:'braids',priceType:'RANGE',priceMin:5000,priceMax:7000,description:'Pricing depends on the desired foundation and finished look.',order:5},
    {slug:'kids-braids',name:'Kids Braids',category:'braids',priceType:'VARIES',order:6},
    {slug:'adult-natural-hair-braids',name:'Adult Natural Hair Braids',category:'braids',priceType:'VARIES',order:7},
    {slug:'trim',name:'Trim',category:'natural-hair',priceType:'VARIES',order:8}
  ];
  for(const s of serviceData){ const category=await db.category.findUniqueOrThrow({where:{slug:s.category}}); await db.service.upsert({where:{slug:s.slug},create:{slug:s.slug,name:s.name,categoryId:category.id,priceType:s.priceType,priceMin:s.priceMin,priceMax:s.priceMax,shortDescription:s.description,description:s.description,displayOrder:s.order,featured:s.order<5,bookingEnabled:false,artists:{create:{artistId:christina.id}}},update:{}}); }
  const blocks=[
    ['home.hero.eyebrow','MAHLOVELY STUDIO'],['home.hero.title','Your Hair. Your Skin. Your Crown.'],['home.hero.body','Natural Hair · Braids · Locs · Esthetics'],['home.intro.title','Two artists. One lovely experience.'],['home.intro.body','Professional hair care, protective styling, loc artistry, and esthetic care come together under one studio brand.'],['about.intro','MahLovely Studio brings two artists together around healthy hair, beauty, confidence, and intentional self-care. Every visit begins with you.']
  ];
  for(const [key,body] of blocks){
    const existing=await db.contentBlock.findUnique({where:{key}});
    const oldAbout='MahLovely Studio brings Ke and Titi together around healthy hair, beauty, confidence, and intentional self-care. Every visit begins with you.';
    await db.contentBlock.upsert({where:{key},create:{key,body,status:'PUBLISHED'},update:key==='about.intro'&&existing?.body===oldAbout?{body}:{}});
  }
  const settings:{key:string;value:object|string}[]=[{key:'contact',value:{}},{key:'heroImage',value:'/images/editorial-hero.png'},{key:'navigation',value:[{label:'Home',href:'/'},{label:'Services',href:'/services'},{label:'Artists',href:'/artists'},{label:'Gallery',href:'/gallery'},{label:'About',href:'/about'},{label:'Policies',href:'/policies'},{label:'Contact',href:'/contact'}]},{key:'heroCtas',value:{primary:{label:'Book an appointment',href:'/book'},secondary:{label:'Explore services',href:'/services'}}},{key:'bookingRules',value:{allowSelfServiceCancel:false,allowSelfServiceReschedule:false,cancelBeforeHours:0,rescheduleBeforeHours:0}}];
  for(const entry of settings)await db.siteSetting.upsert({where:{key:entry.key},create:entry,update:{}});
  const policyNames=['Deposits','Cancellations','Rescheduling','Late Arrivals','No-Shows','Guests','Hair Preparation','Children','Refunds','Esthetics','Health & Safety','Appointment Expectations'];
  for(let i=0;i<policyNames.length;i++){const title=policyNames[i];const slug=title.toLowerCase().replace(/[^a-z0-9]+/g,'-');await db.policy.upsert({where:{slug},create:{slug,title,body:'',status:'DRAFT',displayOrder:i},update:{}});}
  const templates=[
    ['email_verification','Verify your MahLovely account','<p>Use this link to verify your email: <a href="{{link}}">Verify email</a></p>'],
    ['password_reset','Reset your MahLovely password','<p>Use this link to reset your password: <a href="{{link}}">Reset password</a></p>'],
    ['booking_confirmation','Your MahLovely appointment','<p>Thank you, {{name}}. Your appointment reference is {{reference}} for {{date}} at {{time}}.</p><p>{{preparation}}</p>'],
    ['deposit_receipt','Your MahLovely deposit receipt','<p>Your deposit for appointment {{reference}} has been received.</p>'],
    ['appointment_reminder','Your MahLovely appointment is coming up','<p>{{name}}, your {{service}} appointment is coming up. Reference: {{reference}}.</p><p>{{preparation}}</p>'],
    ['appointment_cancelled','Your MahLovely appointment was cancelled','<p>Appointment {{reference}} has been cancelled.</p>'],
    ['appointment_rescheduled','Your MahLovely appointment has changed','<p>Appointment {{reference}} has been rescheduled.</p>'],
    ['aftercare_follow_up','After your MahLovely visit','<p>Thank you for visiting us for {{service}}.</p><p>{{aftercare}}</p>'],
    ['review_request','How was your MahLovely visit?','<p>Thank you for visiting MahLovely Studio.</p>']
  ];
  for(const [event,subject,body] of templates)await db.notificationTemplate.upsert({where:{event_channel:{event,channel:'email'}},create:{event,channel:'email',subject,body,active:false},update:{}});
  const email=process.env.SEED_OWNER_EMAIL, password=process.env.SEED_OWNER_PASSWORD;
  if(email && password){await db.user.upsert({where:{email},create:{email,role:'OWNER',passwordHash:await hash(password,12),verifiedAt:new Date()},update:{}});}
  console.log('Seeded MahLovely content. Booking stays disabled until durations, schedules, and policies are configured.');
  void shante;
}
main().finally(()=>db.$disconnect());
