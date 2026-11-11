export type BrandPhoto={src:string;original:string;alt:string;caption:string;position?:string};
export type BrandFilm={src:string;poster:string;title:string};
type BrandCollection={name:string;discipline:string;intro:string;photos:BrandPhoto[];films:BrandFilm[]};

const keRoot='/brand/Ke';
const ceeRoot='/brand/Titi';
const optimized=(folder:'Ke'|'Titi',name:string)=>`/brand/editorial/${folder.toLowerCase()}-${name.replace(/\.(png|jpe?g)$/i,'.webp')}`;
const photo=(folder:'Ke'|'Titi',filename:string,alt:string,caption:string,position='center'):BrandPhoto=>({
  src:optimized(folder,filename),
  original:`/brand/${folder}/${filename}`,
  alt,caption,position
});

export const brandCollections:Record<'shante'|'christina',BrandCollection>={
  shante:{
    name:'Shante',discipline:'MAH ESTI · skin & body care',
    intro:'A closer look at MAH ESTI: skin and body care by Shante. Loc portfolio photography is coming soon.',
    photos:[
      photo('Ke','Dolphin_Radar_20261111082823.png','MAH ESTI skincare portfolio by Shante','Skin rituals'),
      photo('Ke','Dolphin_Radar_20261111082827.png','MAH ESTI esthetics detail by Shante','The details'),
      photo('Ke','Dolphin_Radar_20261111082842.png','MAH ESTI skin and body care portfolio','The glow')
    ],
    films:[
      {src:`${keRoot}/Dolphin_Radar_20261111082815.mp4`,poster:optimized('Ke','Dolphin_Radar_20261111082823.png'),title:'MAH ESTI / 01'},
      {src:`${keRoot}/Dolphin_Radar_20261111082840.mp4`,poster:optimized('Ke','Dolphin_Radar_20261111082827.png'),title:'MAH ESTI / 02'},
      {src:`${keRoot}/Dolphin_Radar_20261111082844.mp4`,poster:optimized('Ke','Dolphin_Radar_20261111082842.png'),title:'MAH ESTI / 03'}
    ]
  },
  christina:{
    name:'Cee',discipline:'Braiding & natural hair',
    intro:'Technique, texture, and a finish made to be seen.',
    photos:[
      photo('Titi','IMG_1714.png','Braiding portfolio by Cee','The craft'),
      photo('Titi','IMG_1718.png','Hair artistry by Cee','The detail'),
      photo('Titi','IMG_1720.png','Finished style by Cee','The finish'),
      photo('Titi','IMG_5393.png','Hair portfolio by Cee','Style study / 01'),
      photo('Titi','IMG_5394.png','Hair portfolio by Cee','Style study / 02'),
      photo('Titi','IMG_5395.png','Hair portfolio by Cee','Style study / 03'),
      photo('Titi','IMG_5396.png','Hair portfolio by Cee','Style study / 04'),
      photo('Titi','IMG_6519.png','Hair portfolio by Cee','Style study / 05')
    ],
    films:[
      '11116604-C8BC-46E4-A638-46E23C1E9138.mp4',
      '370CAC18-0C44-4CE3-9EEB-71AC5FF2BE55.mp4',
      '3BE97116-CC8E-4546-A9B0-7068D1A9C021.mp4',
      '7EACAEFE-4995-4049-8792-1FAF4518A447.mp4',
      'BC3ED02A-588C-4C69-8718-9950689904D5.mp4',
      'DB0DD0FB-AD07-4CA4-B54D-C50B197117D8.mp4',
      'DFACA024-3E24-411F-B148-75C226E2E76B.mp4',
      'IMG_1838.mp4'
    ].map((filename,i)=>({
      src:`${ceeRoot}/${filename}`,
      poster:`${ceeRoot}/posters/${filename.replace(/\.mp4$/i,'.jpg')}`,
      title:`From Cee’s chair / ${String(i+1).padStart(2,'0')}`
    }))
  }
};

export const allOriginalBrandUrls=new Set<string>(Object.values(brandCollections).flatMap(c=>[
  ...c.photos.map(p=>p.original),...c.films.map(f=>f.src)
]));
