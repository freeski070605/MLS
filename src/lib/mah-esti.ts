export type MahService={slug:string;name:string;price:number;description:string;details?:string[];featured?:boolean};
export type MahSection={id:'facials'|'body'|'packages';eyebrow:string;title:string;intro:string;items:MahService[]};
export const mahSections:MahSection[]=[
 {id:'facials',eyebrow:'01 / THE SKIN EDIT',title:'Signature facials',intro:'Seven intentional treatments. Every service is personalized to your skin, your concerns, and your goals.',items:[
  {slug:'mah-signature-custom-facial',name:'MAH Signature Custom Facial',price:100,description:'Full skin analysis + customized treatment based on the client’s skin.',featured:true},
  {slug:'the-hydration-facial',name:'The Hydration Facial',price:105,description:'Dry/dehydrated skin, barrier support, plumping and glow.'},
  {slug:'clear-skin-facial',name:'Clear Skin Facial',price:110,description:'Acne-prone/oily/congested skin, extractions and clarifying treatment.'},
  {slug:'sensitive-skin-reset',name:'Sensitive Skin Reset',price:105,description:'Calming, soothing and strengthening compromised/sensitive skin.'},
  {slug:'ageless-glow-facial',name:'Ageless Glow Facial',price:120,description:'Mature skin, hydration, firmness and rejuvenation.'},
  {slug:'texture-refining-facial',name:'Texture Refining Facial',price:115,description:'Uneven texture, congestion, dullness and smoother-looking skin.'},
  {slug:'express-glow-facial',name:'Express Glow Facial',price:65,description:'Quick cleanse, exfoliation, mask, moisturizer + SPF.'}
 ]},
 {id:'body',eyebrow:'02 / BELOW THE SURFACE',title:'MAH body treatments',intro:'Care that goes beyond the face, with targeted body services made for texture, tone, and confidence.',items:[
  {slug:'the-mah-booty-facial',name:'The MAH Booty Facial',price:95,description:'Cleansing, exfoliation, extractions if needed, treatment mask, hydration, and finishing products.',details:['Best for: ingrowns, clogged pores, rough texture, post-breakout marks, and dull skin.'],featured:true},
  {slug:'booty-brightening-treatment',name:'Booty Brightening Treatment',price:115,description:'A targeted approach to flat dark marks and the appearance of hyperpigmentation.',details:['Cleansing, brightening exfoliation, targeted treatment, brightening mask, and hydration.']},
  {slug:'inner-thigh-brightening-treatment',name:'Inner-Thigh Brightening Treatment',price:85,description:'Targets the appearance of discoloration, friction-related darkening, and uneven texture.'},
  {slug:'underarm-brightening-treatment',name:'Underarm Brightening Treatment',price:75,description:'Targets the appearance of darkened underarms, buildup, and uneven tone.'},
  {slug:'back-facial',name:'Back Facial',price:110,description:'Deep cleanse, exfoliation, extractions as needed, mask, and hydration.'}
 ]},
 {id:'packages',eyebrow:'03 / YOUR TIME, REIMAGINED',title:'Signature spa experiences',intro:'More than a service. These are the MAH ESTI moments you carve out just for you.',items:[
  {slug:'redeem-relax-glow',name:'REDEEM. RELAX. GLOW.',price:135,description:'Your entry-level luxury experience.',details:['MAH Signature Custom Facial','Extended facial massage','Hand/arm massage','Signature MAH ESTI refreshment'],featured:true},
  {slug:'the-mah-glow-experience',name:'The MAH Glow Experience',price:165,description:'The signature package for the person who wants the full glow.',details:['MAH Signature Custom Facial','Enhanced exfoliation','Targeted treatment mask','Lip treatment','Hand/arm massage','Scalp massage','Signature refreshment'],featured:true},
  {slug:'head-to-cheeks-glow',name:'Head-to-Cheeks Glow',price:195,description:'Facial and body care come together in one memorable experience.',details:['Custom Facial','Booty Facial','Brightening treatment','Signature refreshment']},
  {slug:'body-glow-duo',name:'Body Glow Duo',price:150,description:'Choose two targeted areas for your body glow.',details:['Choose two: Booty treatment, Inner thighs, or Underarms']},
  {slug:'the-mah-full-glow',name:'The MAH Full Glow',price:250,description:'The full luxury transformation package.',details:['Custom Facial','Booty Brightening Treatment','Choice of Inner-Thigh OR Underarm Brightening','Lip treatment','Hand/arm massage','Signature refreshment'],featured:true},
  {slug:'mah-me-time-experience',name:'MAH Me-Time Experience',price:185,description:'For the client who needs to lie down, relax, and be pampered.',details:['Custom Facial','Extended facial/scalp massage','Hand/arm massage','Lip treatment','Relaxing aromatherapy element','MAH ESTI refreshment']}
 ]}
];
export const allMahServices=mahSections.flatMap(section=>section.items.map(item=>({...item,section:section.id})));
export const mahPrice=(price:number)=>`$${price}`;
