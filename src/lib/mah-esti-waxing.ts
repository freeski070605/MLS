import type {IntakeField,IntakeSection} from './mah-esti-intake';
const input=(key:string,label:string,type:IntakeField['type']='text',required=false):IntakeField=>({key,label,type,required});
const select=(key:string,label:string,options:string[],type:'checks'|'radio'='checks',required=false):IntakeField=>({key,label,type,options,required});
export const waxingSections:IntakeSection[]=[
 {title:'01 | Client details',fields:[
  input('fullName','Full name','text',true),input('dateOfBirth','Date of birth','date',true),
  input('phone','Phone','tel',true),input('email','Email','email',true),
  input('emergencyContact','Emergency contact / phone'),
  input('appointmentDate','Date of appointment','date')
 ]},
 {title:'02 | Waxing service & skin history',fields:[
  select('waxAreas','Area(s) to be waxed',['Brows','Lip/Chin','Face','Underarms','Arms','Legs','Bikini','Brazilian','Back/Chest','Other'],'checks',true),
  input('otherWaxArea','Other waxing area'),
  select('firstWax','First time waxing?',['Yes','No'],'radio',true),
  input('lastWaxDate','Last wax / hair removal date','date'),
  select('priorReaction','Have you reacted to waxing, threading, depilatories or adhesives?',['Yes','No'],'radio',true),
  select('history','History of',['Ingrown hairs / folliculitis','Skin lifting / tearing','Excessive redness / bruising','Hyperpigmentation / scarring','Keloid scarring','None of the above']),
  input('priorReactionsDetails','Describe prior reactions, skin concerns, or areas to avoid','textarea')
 ]},
 {title:'03 | Products, medications & recent procedures',lead:'List any product or medication used currently or recently, including the area used and date last used. These may increase skin fragility or affect treatment decisions.',fields:[
  select('productsMedications','Products / medications',['Tretinoin / Retin-A / adapalene','Retinol / retinal / other retinoids','Isotretinoin (Accutane), now or previously','AHA/BHA exfoliants (glycolic, salicylic, etc.)','Benzoyl peroxide / acne treatments','Topical or oral corticosteroids','Antibiotics / other prescription medicines','Blood thinners / medicines affecting bruising','Skin lighteners / strong exfoliating products','None of the above']),
  input('productDetails','Product / medicine, treated area and last-use dates','textarea'),
  select('recentProcedures','Recent treatments',['Chemical peel / facial exfoliation','Laser / IPL / electrolysis','Microneedling / dermaplaning','Waxing / shaving / depilatory cream','Botox / fillers / cosmetic procedures','Tanning / sunburn / excessive sun exposure','Surgery / wound treatment','None of the above']),
  input('recentProcedureDetails','Dates / details','textarea')
 ]},
 {title:'04 | Allergies & medical conditions',fields:[
  select('allergiesConditions','Allergies & medical conditions',['Wax / rosin / colophony / adhesives','Latex','Fragrance / essential oils','Skin-care ingredients / topical anesthetics','Known food or other allergies','Diabetes / impaired wound healing','Eczema / psoriasis / dermatitis','Immune suppression / autoimmune condition','Bleeding / bruising disorder','Pregnant or breastfeeding','Other condition affecting skin or healing','None known']),
  input('allergyDetails','Allergies, reactions, relevant diagnoses, or precautions','textarea')
 ]},
 {title:'05 | Current health, injuries & contagious conditions',lead:'Disclose current or recent health concerns, even if they seem unrelated to waxing.',fields:[
  select('currentHealth','Current or recent concerns',['Fever / chills / cold or flu symptoms','Cough / sore throat / respiratory illness','COVID-19 or other contagious illness','Conjunctivitis (pink eye)','Cold sores / herpes outbreak','Contagious rash / suspected skin infection','Open wound / cut / abrasion / broken skin','Active acne lesions / boils / inflamed follicles','Sunburn / blistering / skin irritation','Unexplained swelling / inflammation','Recent sprain, strain or other injury','Bruising / tenderness in treatment area','Recent surgery / hospitalization','Neck / back pain or difficulty positioning','Dizziness / fainting / severe headache','Other symptoms or health concerns','None of the above']),
  input('healthDetails','Location, symptoms, onset date, injury details, or current treatment','textarea'),
  select('urgentConcern','Any urgent or potentially life-threatening health concern, severe allergic reaction history, or condition that may require special precautions?',['Yes','No'],'radio',true),
  input('urgentConcernDetails','If yes, please explain (do not wait for a waxing appointment to seek urgent care)','textarea')
 ]},
 {title:'07 | Client comfort & experience',fields:[
  select('comfort','Comfort preferences',['Quiet relaxation','Light conversation','Explain each step before proceeding','Unscented products if available','Extra attention to sensitive areas','Other preference']),
  input('otherComfort','Other preference'),
  input('anythingElse','Anything else you would like us to know?','textarea')
 ]}
];
export const waxingAcknowledgments=[
 'I have disclosed relevant health information and medication/product use.',
 'I will report any changes before treatment.',
 'I understand waxing can cause temporary redness, tenderness, ingrown hairs, irritation, bruising, skin lifting, burns, or pigment changes.'
];
export const waxingConsent='I have had the opportunity to ask questions, understand the proposed waxing service and possible risks, and consent to treatment only if the esthetician determines it is appropriate. I may stop the service at any time.';
export const waxingClearanceText='MAH ESTI may modify, postpone, or decline a service when skin condition, illness, medication use, injury, or other factors make waxing potentially unsafe. A referral to a qualified healthcare professional may be recommended. A client signature does not override a safety concern or guarantee clearance.';
export const waxingEstheticianFields:IntakeField[]=[
 select('serviceDecision','Assessment',['Proceed','Proceed with modifications','Defer / reschedule','Refer for medical evaluation'],'radio'),
 input('skinAssessment','Skin assessment / contraindications / reasons for decision','textarea'),
 input('waxUsed','Wax type / products used, area(s), modifications, patch test if performed','textarea'),
 select('aftercareReviewed','Aftercare reviewed',['Yes','No'],'radio'),
 select('questionsAddressed','Client questions addressed',['Yes','No'],'radio'),
 input('postTreatment','Post-treatment response / follow-up recommendations','textarea'),
 input('estheticianName','Esthetician name / signature'),
 input('estheticianDate','Date / time','text')
];
