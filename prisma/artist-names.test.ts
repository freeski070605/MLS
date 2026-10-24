import { describe,expect,it } from 'vitest';
import { artistRenamePatch,legacyArtistProfiles } from './artist-names';
const shante=legacyArtistProfiles[0];
const cee=legacyArtistProfiles[1];
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
<<<<<<< HEAD
  it('renames the prior Christina presentation to Cee while preserving later edits',()=>{
    expect(artistRenamePatch({slug:'christina',name:'Christina',displayName:'Christina',bio:cee.bio},cee)).toEqual({name:'Cee',displayName:'Cee'});
    expect(artistRenamePatch({slug:'christina',name:'Cee',displayName:'Cee Studio',bio:'Custom artist biography'},cee)).toEqual({});
=======
  it('updates Christina to Cee without changing the artist slug or relationships',()=>{
    expect(artistRenamePatch({slug:'christina',name:'Christina',displayName:'Christina',bio:cee.bio},cee)).toEqual({name:'Cee',displayName:'Cee'});
>>>>>>> 905bc683d96eb503d4d89787e770af45cca65c5a
  });
});
