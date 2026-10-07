import { db } from './db';
export const starterArtists=[
  {id:'shante',slug:'shante',displayName:'Shante',roleLabels:['Loc Artist','Esthetician'],bio:'Healthy locs meet intentional skincare and self-care. Loc artistry and esthetic services come together within a personalized beauty experience.',photoUrl:null,coverUrl:null,specialties:['Locs','Esthetics']},
  {id:'christina',slug:'christina',displayName:'Christina',roleLabels:['Natural Hair Stylist','Braider'],bio:'Natural hair care, protective styling and finished looks designed around your hair and the look you want.',photoUrl:null,coverUrl:null,specialties:['Braids','Natural Hair']}
];
export const starterCategories=[
  {id:'braids',slug:'braids',name:'Braids',description:'Natural-hair and protective braided styles.'},
  {id:'natural-hair',slug:'natural-hair',name:'Natural Hair',description:'Care and styling for your natural texture.'},
  {id:'locs',slug:'locs',name:'Locs',description:'Loc artistry and care tailored to you.'},
  {id:'esthetics',slug:'esthetics',name:'Esthetics',description:'Intentional esthetic care tailored to you.'}
];
export const starterServices=[
  {slug:'all-braiding-styles',name:'All Braiding Styles',category:'braids',priceType:'STARTING',priceMin:10000,priceMax:null,shortDescription:'Natural-hair and protective braided styles. Final pricing varies depending on desired style, length, braid size, and hair density.'},
  {slug:'silk-press',name:'Silk Press',category:'natural-hair',priceType:'FIXED',priceMin:6500,priceMax:null,shortDescription:null},
  {slug:'curls',name:'Curls',category:'natural-hair',priceType:'FIXED',priceMin:7500,priceMax:null,shortDescription:null},
  {slug:'wash-n-go',name:'Wash-N-Go',category:'natural-hair',priceType:'FIXED',priceMin:5500,priceMax:null,shortDescription:null},
  {slug:'foundation-braid-down',name:'Foundation Braid Down',category:'braids',priceType:'RANGE',priceMin:5000,priceMax:7000,shortDescription:'Pricing depends on the desired foundation and finished look.'},
  {slug:'kids-braids',name:'Kids Braids',category:'braids',priceType:'VARIES',priceMin:null,priceMax:null,shortDescription:null},
  {slug:'adult-natural-hair-braids',name:'Adult Natural Hair Braids',category:'braids',priceType:'VARIES',priceMin:null,priceMax:null,shortDescription:null},
  {slug:'trim',name:'Trim',category:'natural-hair',priceType:'VARIES',priceMin:null,priceMax:null,shortDescription:null}
];
export async function getArtists(){try{return await db.artist.findMany({where:{active:true},orderBy:{displayOrder:'asc'}})}catch{return starterArtists}}
export async function getCategories(){try{return await db.category.findMany({where:{active:true},orderBy:{displayOrder:'asc'}})}catch{return starterCategories}}
export async function getServices(){try{return await db.service.findMany({where:{active:true},include:{category:true,artists:{include:{artist:true}}},orderBy:{displayOrder:'asc'}})}catch{return starterServices.map(s=>({...s,id:s.slug,category:starterCategories.find(c=>c.slug===s.category)!,artists:[{artist:starterArtists[1]}],imageUrl:null,durationMinutes:null,bookingEnabled:false,featured:true,description:s.shortDescription,preparation:null,aftercare:null,depositType:'NONE',depositValue:null}))}}
