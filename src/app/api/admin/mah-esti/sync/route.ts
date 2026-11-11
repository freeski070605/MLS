import { NextRequest,NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { safeOrigin,errorResponse } from '@/lib/http';
import { mahSections } from '@/lib/mah-esti';

// Deliberately opt-in: do not mutate the production catalog during a Vercel build.
// Re-running this import does not overwrite edited service descriptions, prices,
// publishing states or online-booking configuration.
export async function POST(req:NextRequest){
  if(!safeOrigin(req))return errorResponse('Invalid origin',403);
  const user=await currentUser();
  if(!user||user.role!=='OWNER')return errorResponse('Forbidden',403);
  try{
    const artist=await db.artist.findFirst({
      where:{slug:{in:['shante','ke']}},
      select:{id:true,slug:true}
    });
    if(!artist)return errorResponse('Shante’s artist profile was not found. Create the artist before syncing the MAH ESTI menu.',409);

    const category=await db.category.upsert({
      where:{slug:'esthetics'},
      create:{slug:'esthetics',name:'Esthetics',description:'Facials, targeted body care and MAH ESTI spa experiences.',displayOrder:4},
      update:{}
    });
    const entries=mahSections.flatMap((section,sectionIndex)=>
      section.items.map((item,index)=>({section,sectionIndex,item,index}))
    );

    const results=await Promise.all(entries.map(async({section,sectionIndex,item,index})=>{
      const previouslyExists=await db.service.findUnique({where:{slug:item.slug},select:{id:true}});
      const service=await db.service.upsert({
        where:{slug:item.slug},
        create:{
          slug:item.slug,
          name:item.name,
          categoryId:category.id,
          shortDescription:item.description,
          description:[item.description,...(item.details||[])].join('\n'),
          priceType:'FIXED',
          priceMin:item.price*100,
          displayOrder:50+sectionIndex*20+index,
          tags:['MAH ESTI',section.id],
          featured:!!item.featured,
          active:true,
          bookingEnabled:false
        },
        update:{}
      });
      await db.serviceArtist.upsert({
        where:{serviceId_artistId:{serviceId:service.id,artistId:artist.id}},
        create:{serviceId:service.id,artistId:artist.id},
        update:{}
      });
      return previouslyExists?'existing':'new';
    }));
    await db.auditLog.create({data:{
      actorId:user.id,action:'sync',entity:'mah-esti-menu',
      after:{total:entries.length,created:results.filter(x=>x==='new').length,artistSlug:artist.slug}
    }});
    return NextResponse.json({
      ok:true,total:entries.length,
      created:results.filter(x=>x==='new').length,
      preserved:results.filter(x=>x==='existing').length
    });
  }catch(error){
    console.error('[mah-esti] Admin sync failed',error);
    return errorResponse('Could not sync MAH ESTI services. Check the server logs and try again.',503);
  }
}
