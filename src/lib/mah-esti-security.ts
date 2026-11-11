import { createCipheriv,createDecipheriv,randomBytes } from 'node:crypto';

function getKey(){
  const raw=process.env.MAH_ESTI_INTAKE_KEY||'';
  if(!/^[0-9a-fA-F]{64}$/.test(raw))throw new Error('Secure intake encryption is not configured');
  return Buffer.from(raw,'hex');
}

export function intakeReady(){return /^[0-9a-fA-F]{64}$/.test(process.env.MAH_ESTI_INTAKE_KEY||'')}

export function encryptIntake(value:unknown){
  const iv=randomBytes(12);
  const cipher=createCipheriv('aes-256-gcm',getKey(),iv);
  const content=Buffer.from(JSON.stringify(value),'utf8');
  const ciphertext=Buffer.concat([cipher.update(content),cipher.final()]);
  return ['v1',iv.toString('base64'),cipher.getAuthTag().toString('base64'),ciphertext.toString('base64')].join('.');
}
export function decryptIntake<T>(stored:string):T{
  const [version,iv,tag,data]=stored.split('.');
  if(version!=='v1'||!iv||!tag||!data)throw new Error('Invalid encrypted intake');
  const decipher=createDecipheriv('aes-256-gcm',getKey(),Buffer.from(iv,'base64'));
  decipher.setAuthTag(Buffer.from(tag,'base64'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(data,'base64')),decipher.final()]).toString('utf8')) as T;
}
