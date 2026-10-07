import { describe,expect,it } from 'vitest';
import { artistRenamePatch,legacyArtistProfiles } from './artist-names';
const shante=legacyArtistProfiles[0];
describe('artist display-name migration',()=>{
  it('renames a legacy row without changing its identity or relationships',()=>{
    expect(artistRenamePatch({slug:'ke',name:'Ke',displayName:'Ke',bio:shante.legacyBio},shante)).toEqual({slug:'shante',name:'Shante',displayName:'Shante',bio:shante.bio});
  });
  it('preserves a later display-name correction',()=>{
    expect(artistRenamePatch({slug:'shante',name:'Shante',displayName:'Shante Johnson',bio:'Custom artist biography'},shante)).toEqual({});
  });
  it('can finish a partially migrated row without overwriting its edited copy',()=>{
    expect(artistRenamePatch({slug:'ke',name:'Ke',displayName:'Shante Johnson',bio:'Custom artist biography'},shante)).toEqual({slug:'shante',name:'Shante'});
  });
});
