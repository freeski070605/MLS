export type BrandPhoto={src:string;original:string;alt:string;caption:string;position?:string};
export type BrandFilm={src:string;original:string;poster:string;title:string};
type BrandCollection={name:string;discipline:string;intro:string;photos:BrandPhoto[];films:BrandFilm[]};

const optimized=(folder:'Ke'|'Titi',name:string)=>`/brand/editorial/${folder.toLowerCase()}-${name.replace(/\.(png|jpe?g|heic)$/i,'.webp')}`;
const photo=(folder:'Ke'|'Titi',filename:string,alt:string,caption:string,position='center'):BrandPhoto=>({src:optimized(folder,filename),original:`/brand/${folder}/${filename}`,alt,caption,position});
const film=(folder:'Ke'|'Titi',filename:string,title:string,poster:string,edit?:string):BrandFilm=>({src:edit?`/brand/editorial/${edit}.mp4`:`/brand/${folder}/${filename}`,original:`/brand/${folder}/${filename}`,poster,title});

export const ceeHeroPhoto:BrandPhoto=photo('Titi','IMG_6519.png','Radial braid pattern with purple beads by Cee','The braid edit','center 35%');
export const ceeBookingPhoto:BrandPhoto={src:'/brand/curated/cee-braids-feature.webp',original:'/brand/Titi/7EACAEFE-4995-4049-8792-1FAF4518A447.mp4',alt:'Finished braided bun with clearly visible braid pattern by Cee',caption:'A finished look',position:'center 40%'};

export const locCollection:BrandCollection={
  name:'Shante',discipline:'GET TWISTED · loc artistry',intro:'Retwists, precise parts, finished styles and the care behind every loc look.',
  photos:[
    photo('Ke','IMG_9173.JPG','Finished loc updo with precise parting by Shante','The finished updo','center 36%'),
    photo('Ke','IMG_0455.JPG','Copper loc updo styled by Shante','A warm finish','center 40%'),
    photo('Ke','IMG_0104.JPG','Neat loc style photographed from above','Clean parts','center 44%'),
    photo('Ke','IMG_2724.JPG','Back view of a styled copper loc updo','The shape'),
  ],
  films:[
    film('Ke','IMG_1755.mp4','Loc style reveal by Shante',optimized('Ke','IMG_9173.JPG')),
    film('Ke','recorded-31849307613849.mp4','Finished loc look by Shante',optimized('Ke','IMG_0455.JPG'))
  ]
};

export const brandCollections:Record<'shante'|'christina',BrandCollection>={
  shante:{
    name:'Shante',discipline:'MAH ESTI · skin & body care',intro:'The ritual and the care behind MAH ESTI skin and body treatments.',
    photos:[
      photo('Ke','Dolphin_Radar_20261111082823.png','Client during a MAH ESTI facial treatment','The ritual','center 48%'),
      photo('Ke','Dolphin_Radar_20261111082827.png','Facial treatment in the MAH ESTI studio','The treatment'),
      photo('Ke','Dolphin_Radar_20261111082842.png','MAH ESTI body treatment setup','The care')
    ],
    films:[
      film('Ke','Dolphin_Radar_20261111082815.mp4','MAH ESTI facial ritual',optimized('Ke','Dolphin_Radar_20261111082823.png')),
      film('Ke','Dolphin_Radar_20261111082840.mp4','MAH ESTI facial treatment',optimized('Ke','Dolphin_Radar_20261111082827.png'))
    ]
  },
  christina:{
    name:'Cee',discipline:'Braiding & natural hair',intro:'Distinct braid patterns, clean parts, and finished looks from Cee’s chair.',
    photos:[
      ceeHeroPhoto,
      photo('Titi','IMG_1718.png','Long finished braids seen from behind','Length and detail','center 43%'),
      ceeBookingPhoto,
    ],
    films:[
      film('Titi','7EACAEFE-4995-4049-8792-1FAF4518A447.mp4','Braided bun and bead detail by Cee','/brand/curated/cee-braids-feature.webp'),
      film('Titi','BC3ED02A-588C-4C69-8718-9950689904D5.mp4','Radial braid pattern by Cee','/brand/Titi/posters/BC3ED02A-588C-4C69-8718-9950689904D5.jpg')
    ]
  }
};

export const rejectedBrandMediaUrls=new Set([
  '/brand/Titi/IMG_1714.png','/brand/editorial/titi-IMG_1714.webp',
  '/brand/Titi/IMG_1720.png','/brand/editorial/titi-IMG_1720.webp',
  '/brand/Titi/11116604-C8BC-46E4-A638-46E23C1E9138.mp4',
  '/brand/Titi/posters/11116604-C8BC-46E4-A638-46E23C1E9138.jpg',
  '/brand/editorial/cee-hero.webp','/brand/editorial/cee-cornrows.mp4'
]);
export const isRejectedBrandMedia=(url:string|null|undefined)=>{
  if(!url)return false;
  try{return rejectedBrandMediaUrls.has(decodeURIComponent(new URL(url,'https://mahlovely.local').pathname));}
  catch{return rejectedBrandMediaUrls.has(url.split(/[?#]/,1)[0]);}
};
export const hasRejectedBrandMedia=(item:{imageUrl?:string|null;videoUrl?:string|null;posterUrl?:string|null;beforeUrl?:string|null;afterUrl?:string|null;images?:string[]})=>
  [item.imageUrl,item.videoUrl,item.posterUrl,item.beforeUrl,item.afterUrl,...(item.images||[])].some(isRejectedBrandMedia);
const legacySeededCeeMedia=['IMG_5393.png','IMG_5394.png','IMG_5395.png','IMG_5396.png','370CAC18-0C44-4CE3-9EEB-71AC5FF2BE55.mp4','3BE97116-CC8E-4546-A9B0-7068D1A9C021.mp4','DB0DD0FB-AD07-4CA4-B54D-C50B197117D8.mp4','DFACA024-3E24-411F-B148-75C226E2E76B.mp4','IMG_1838.mp4'];
export const allOriginalBrandUrls=new Set<string>([...Object.values(brandCollections),locCollection].flatMap(c=>[...c.photos.map(p=>p.original),...c.films.flatMap(f=>[f.src,f.original])]).concat(legacySeededCeeMedia.map(name=>`/brand/Titi/${name}`)));
