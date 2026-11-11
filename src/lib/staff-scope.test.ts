import {describe,it,expect} from 'vitest';
import {staffArtistId,staffCanViewIntakes,allowedStaffSection,belongsToStaff} from './staff-scope';

const shante={role:'ADMIN' as const,artist:{id:'shante-id',slug:'shante'}};
const cee={role:'ADMIN' as const,artist:{id:'cee-id',slug:'christina'}};
const owner={role:'OWNER' as const,artist:null};
describe('artist-scoped ADMIN CRM permissions',()=>{
 it('keeps the owner studio-wide and ties each ADMIN to its assigned artist',()=>{
  expect(staffArtistId(owner)).toBeNull();
  expect(staffArtistId(shante)).toBe('shante-id');
  expect(staffArtistId(cee)).toBe('cee-id');
  expect(()=>staffArtistId({role:'ADMIN',artist:null})).toThrow('Artist assignment required');
 });
 it('restricts private intake access regardless of ADMIN role',()=>{
  expect(staffCanViewIntakes(owner)).toBe(true);
  expect(staffCanViewIntakes(shante)).toBe(true);
  expect(staffCanViewIntakes(cee)).toBe(false);
 });
 it('denies studio-wide admin pages and other artists records',()=>{
  expect(allowedStaffSection(cee,'appointments')).toBe(true);
  expect(allowedStaffSection(cee,'clients')).toBe(true);
  expect(allowedStaffSection(cee,'inquiries')).toBe(true);
  expect(allowedStaffSection(cee,'team')).toBe(false);
  expect(allowedStaffSection(cee,'settings')).toBe(false);
  expect(allowedStaffSection(cee,'analytics')).toBe(false);
  expect(belongsToStaff(cee,'shante-id')).toBe(false);
  expect(belongsToStaff(cee,'cee-id')).toBe(true);
 });
});
