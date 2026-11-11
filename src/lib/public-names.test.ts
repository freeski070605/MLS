import {describe,it,expect} from 'vitest';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {publicStudioCopy,publicStudioOptional} from './public-names';

describe('Shante customer-facing name',()=>{
 it('corrects legacy stored display text without touching other words',()=>{
  expect(publicStudioCopy('Ke offers facials. Book Ke\'s consultation today.')).toBe("Shante offers facials. Book Shante's consultation today.");
  expect(publicStudioCopy('Meet Ke — MAH ESTI by Ke')).toBe('Meet Shante — MAH ESTI by Shante');
  expect(publicStudioCopy('Kenya and Keisha')).toBe('Kenya and Keisha');
  expect(publicStudioCopy('Titi / Christina, booking with Titi')).toBe('Cee / Cee, booking with Cee');
  expect(publicStudioCopy("Titi's braids and Ke's facials")).toBe("Cee's braids and Shante's facials");
  expect(publicStudioOptional(null)).toBeNull();
 });
 it('has no hard-coded old public name in customer-facing JSX',()=>{
  const walk=(root:string):string[]=>readdirSync(root,{withFileTypes:true}).flatMap(entry=>{
   const full=join(root,entry.name);
   return entry.isDirectory()?walk(full):full.endsWith('.tsx')?[full]:[];
  });
  for(const file of [...walk(join(process.cwd(),'src/app')),...walk(join(process.cwd(),'src/components'))]){
   const code=readFileSync(file,'utf8')
     // Preserve the original asset folder and internal API identifiers.
     .replaceAll('/brand/Ke/','/brand/legacy-artist/')
     .replaceAll('/brand/Titi/','/brand/legacy-braider/')
     .replaceAll('ke-consultation','legacy-consultation');
   expect(code.match(/\bKe\b|\bTiti\b|\bChristina\b/g),`Unexpected old artist name in ${file}`).toBeNull();
  }
 });
});
