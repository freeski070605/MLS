export type IntakeField={key:string;label:string;type:'text'|'date'|'email'|'tel'|'textarea'|'radio'|'checks'|'scale';options?:string[];required?:boolean};
export type IntakeSection={title:string;lead?:string;fields:IntakeField[]};
const opts=(key:string,label:string,options:string[],type:'radio'|'checks'='checks',required=false):IntakeField=>({key,label,type,options,required});
const input=(key:string,label:string,type:IntakeField['type']='text',required=false):IntakeField=>({key,label,type,required});
export const intakeSections:IntakeSection[]=[
 {title:'01 | Client information',fields:[
  input('fullName','Full name','text',true),input('dateOfBirth','Date of birth','date',true),input('phone','Phone','tel',true),input('email','Email','email',true),input('pronouns','Pronouns (optional)'),input('consultationDate','Date of consultation','date',true),input('emergencyContact','Emergency contact name / phone'),
  opts('heardAbout','How did you hear about MAH ESTI?',['Instagram','Facebook','TikTok','Referral','Google','Other'],'radio'),
  input('heardOther','Other referral source')
 ]},
 {title:'02 | Skin goals & concerns',lead:'What would you like to improve? Check all that apply.',fields:[
  opts('skinConcerns','Skin concerns',['Acne / breakouts','Acne marks / scars','Hyperpigmentation','Dark spots','Dryness','Oiliness','Fine lines / wrinkles','Rosacea / redness','Sensitivity','Uneven texture','Visible pores','Dullness','Blackheads','Whiteheads','Sun damage','Other']),
  input('skinConcernsOther','Other concerns'),
  opts('skinDescription','How would you describe your skin?',['Oily','Dry','Combination','Normal','Sensitive','Unsure'],'radio'),
  opts('fitzpatrick','Fitzpatrick skin type (if known)',['I','II','III','IV','V','VI','Unsure'],'radio'),
  input('topThreeGoals','Your top three skincare goals','textarea')
 ]},
 {title:'03 | Current skincare routine',fields:[
  input('morningProducts','Morning products (including active ingredients)','textarea'),
  input('eveningProducts','Evening products (including active ingredients)','textarea'),
  input('exfoliation','Exfoliation frequency / product'),
  opts('sunscreen','Do you use sunscreen daily?',['Yes','No','Sometimes'],'radio')
 ]},
 {title:'04 | Lifestyle & wellness',fields:[
  opts('water','Daily water intake',['Under 2 cups','2–4 cups','5–8 cups','Over 8 cups'],'radio'),
  opts('sleep','Average nightly sleep',['Under 5 hours','6–7 hours','8+ hours'],'radio'),
  {key:'stress',label:'Stress level (1–10)',type:'scale'},
  opts('smoking','Smoking / vaping',['Yes','No'],'radio'),
  opts('alcohol','Alcohol use',['Never','Occasionally','Frequently'],'radio')
 ]},
 {title:'05 | Health & medical history',lead:'Check any current or past conditions that may affect treatment.',fields:[
  opts('conditions','Medical conditions',['Pregnant','Breastfeeding','Diabetes','Cancer / treatment','Lupus','Thyroid condition','Autoimmune condition','Epilepsy / seizures','High blood pressure','Cold sores / HSV','Psoriasis','Eczema','Rosacea','Recent surgery','Metal implants','Pacemaker','Claustrophobia','None of the above']),
  input('medicalDetails','Details / dates / precautions','textarea')
 ]},
 {title:'06 | Medications & allergies',fields:[
  opts('medications','Medications or topical treatments used currently or recently',['Isotretinoin (Accutane)','Tretinoin / retinoids','Antibiotics','Steroids','Blood thinners','Hormonal medication','Other','None']),
  input('medicationDetails','Medication name, strength, last use / date (if relevant)','textarea'),
  opts('allergies','Known allergies or sensitivities',['Latex','Aspirin','Nuts','Fragrance','Essential oils','Salicylic acid','Glycolic acid','Lidocaine','Aloe','Adhesives','Other','None known']),
  input('reactionDetails','Reaction(s) and severity','textarea')
 ]},
 {title:'07 | Recent skin & cosmetic treatments',fields:[
  opts('recentTreatments','Have you recently had any of the following?',['Facial waxing','Chemical peel','Microneedling','Botox / fillers','Laser treatment','Spray tan','Other','None']),
  input('treatmentDates','Treatment, location, and exact date(s)','textarea')
 ]},
 {title:'08 | Current health status & safety screening',lead:'Some symptoms or concerns may require a modified or postponed service.',fields:[
  opts('currentConcerns','Current or recent concerns',['Cold / flu symptoms','Fever','Cough','Sore throat','COVID-19 / exposure','Pink eye','Active cold sore','Open cut / wound','Skin infection','Contagious rash','Poison ivy / oak','Sunburn','Sprain / strain','Swelling / inflammation','Bruising','Recent injury','Neck pain','Back pain','Severe headache / migraine','Dizziness','Difficulty lying flat','Recent hospitalization','Recent surgery','Taking antibiotics','Other','None of the above']),
  input('symptomDetails','Symptoms, affected area, date of onset, and any medical advice received','textarea'),
  opts('emergencySymptoms','Are you currently experiencing a serious or potentially life-threatening symptom or condition (such as chest pain, severe trouble breathing, fainting, or a severe allergic reaction)?',['Yes','No'],'radio',true),
  input('additionalHealth','Additional health information, restrictions, accessibility needs, or concerns','textarea')
 ]},
 {title:'09 | Experience personalization',fields:[
  opts('intention','What is your intention for today?',['Relaxation','Self-care','Stress relief','Glowing skin','Acne care','Hydration','Brightening','Age-supportive care']),
  opts('aroma','Aromatherapy preference (subject to suitability)',['Lavender','Eucalyptus','Citrus','Peppermint','Unscented'],'radio'),
  opts('beverage','Preferred beverage (subject to availability / allergies)',['Cucumber mint','Hibiscus tea','Citrus water','Seasonal beverage','Plain water'],'radio'),
  opts('massage','Massage pressure preference',['Light','Medium','Firm','No massage'],'radio'),
  opts('conversation','Conversation preference',['Quiet relaxation','Light conversation','Enjoy chatting'],'radio'),
  input('comfortPreferences','Comfort, scent, ingredient, beverage or other preferences','textarea')
 ]}
];
export const consentText='I confirm that the information I have provided is accurate and complete to the best of my knowledge. I agree to inform MAH ESTI of any changes before or during my appointment. I understand that certain symptoms, medications, injuries, contagious conditions, and other health concerns may require a service to be modified, deferred, or rescheduled. I understand that results vary, no specific outcome is guaranteed, and aftercare is important.\n\nI understand this consultation does not replace medical evaluation. I may ask questions and decline or stop a service. The esthetician will explain the proposed treatment, material risks, and alternatives before proceeding. My signature below confirms the information and acknowledgments above; service-specific informed consent will be obtained as appropriate.';
export const estheticianFields:IntakeField[]=[
 input('observedSkin','Observed skin type / condition','textarea'),
 input('contraindications','Observed concerns / contraindications','textarea'),
 opts('serviceDecision','Service decision',['Proceed','Modify service','Defer / reschedule','Refer for medical evaluation'],'radio'),
 input('precautions','Reason / modifications / precautions','textarea'),
 input('treatmentPerformed','Treatment performed and products used','textarea'),
 input('aftercare','Homecare / aftercare recommendations','textarea'),
 input('followup','Follow-up / next appointment'),
 input('estheticianName','Esthetician name / signature'),
 input('estheticianDate','Date','date')
];
