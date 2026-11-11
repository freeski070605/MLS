export type BrandPhoto={src:string;original:string;alt:string;caption:string;position?:string};
export type BrandFilm={src:string;original:string;poster:string;title:string};
type BrandCollection={name:string;discipline:string;intro:string;photos:BrandPhoto[];films:BrandFilm[]};

const optimized=(folder:'Ke'|'Titi',name:string)=>`/brand/editorial/${folder.toLowerCase()}-${name.replace(/\.(png|jpe?g|heic)$/i,'.webp')}`;
const photo=(folder:'Ke'|'Titi',filename:string,alt:string,caption:string,position='center'):BrandPhoto=>({src:optimized(folder,filename),original:`/brand/${folder}/${filename}`,alt,caption,position});
const film=(folder:'Ke'|'Titi',filename:string,title:string,poster:string,edit?:string):BrandFilm=>({src:edit?`/brand/editorial/${edit}.mp4`:`/brand/${folder}/${filename}`,original:`/brand/${folder}/${filename}`,poster,title});

export const ceeHeroPhoto:BrandPhoto={src:'/brand/editorial/cee-hero.webp',original:'/brand/Titi/11116604-C8BC-46E4-A638-46E23C1E9138.mp4',alt:'Finished cornrow braid pattern by Cee against a clean background',caption:'The braid edit',position:'center 42%'};
export const ceeBookingPhoto:BrandPhoto={src:'/brand/editorial/cee-booking.webp',original:'/brand/Titi/7EACAEFE-4995-4049-8792-1FAF4518A447.mp4',alt:'Finished braided bun with purple beads by Cee',caption:'A finished look',position:'center 43%'};

export const locCollection:BrandCollection={
  name:'Shante',discipline:'GET TWISTED · loc artistry',intro:'Retwists, precise parts, finished styles and the care behind every loc look.',
  photos:[
    photo('Ke','IMG_9173.JPG','Finished loc updo with precise parting by Shante','The finished updo','center 36%'),
    photo('Ke','IMG_0455.JPG','Copper loc updo styled by Shante','A warm finish','center 40%'),
    photo('Ke','IMG_0104.JPG','Neat loc style photographed from above','Clean parts','center 44%'),
    photo('Ke','IMG_1710.HEIC','Long retwisted locs with visible parting','The retwist','center 50%'),
    photo('Ke','IMG_2256_Original.HEIC','Close view of Shante’s loc parting technique','Technique, up close'),
    photo('Ke','IMG_2747.HEIC','Finished short loc style from above','The detail'),
    photo('Ke','IMG_2724.JPG','Back view of a styled copper loc updo','The shape'),
    photo('Ke','IMG_2743.HEIC','Short loc style with geometric parting','Another perspective')
  ],
  films:[
    film('Ke','IMG_1755.mp4','Loc style reveal by Shante','/brand/editorial/ke-IMG_1755-poster.webp','ke-loc-reveal'),
    film('Ke','recorded-31849307613849.mp4','Finished loc look by Shante','/brand/editorial/ke-recorded-poster.webp')
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
      film('Ke','Dolphin_Radar_20261111082815.mp4','MAH ESTI facial ritual','/brand/editorial/ke-esti-poster.webp'),
      film('Ke','Dolphin_Radar_20261111082840.mp4','MAH ESTI facial treatment','/brand/editorial/ke-esti-treatment-poster.webp')
    ]
  },
  christina:{
    name:'Cee',discipline:'Braiding & natural hair',intro:'Distinct braid patterns, clean parts, and finished looks from Cee’s chair.',
    photos:[
      ceeHeroPhoto,
      photo('Titi','IMG_1720.png','Side view of long braids styled by Cee','The full look','center 38%'),
      ceeBookingPhoto,
      photo('Titi','IMG_1718.png','Long finished braids seen from behind','Length and detail','center 43%'),
      photo('Titi','IMG_6519.png','Radial braid pattern with purple beads by Cee','A playful finish','center 35%')
    ],
    films:[
      film('Titi','11116604-C8BC-46E4-A638-46E23C1E9138.mp4','Precision cornrows by Cee','/brand/editorial/cee-hero.webp','cee-cornrows'),
      film('Titi','7EACAEFE-4995-4049-8792-1FAF4518A447.mp4','Braided bun and bead detail by Cee','/brand/editorial/cee-booking.webp','cee-beaded-bun'),
      film('Titi','BC3ED02A-588C-4C69-8718-9950689904D5.mp4','Radial braid pattern by Cee','/brand/Titi/posters/BC3ED02A-588C-4C69-8718-9950689904D5.jpg')
    ]
  }
};

export const rejectedBrandMediaUrls=new Set(['/brand/Titi/IMG_1714.png','/brand/editorial/titi-IMG_1714.webp']);
export const isRejectedBrandMedia=(url:string|null|undefined)=>!!url&&rejectedBrandMediaUrls.has(url);
const legacySeededCeeMedia=['IMG_5393.png','IMG_5394.png','IMG_5395.png','IMG_5396.png','370CAC18-0C44-4CE3-9EEB-71AC5FF2BE55.mp4','3BE97116-CC8E-4546-A9B0-7068D1A9C021.mp4','DB0DD0FB-AD07-4CA4-B54D-C50B197117D8.mp4','DFACA024-3E24-411F-B148-75C226E2E76B.mp4','IMG_1838.mp4'];
export const allOriginalBrandUrls=new Set<string>([...Object.values(brandCollections),locCollection].flatMap(c=>[...c.photos.map(p=>p.original),...c.films.flatMap(f=>[f.src,f.original])]).concat(legacySeededCeeMedia.map(name=>`/brand/Titi/${name}`)));
