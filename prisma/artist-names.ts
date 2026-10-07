export const legacyArtistProfiles=[
  {legacySlug:'ke',slug:'shante',legacyName:'Ke',previousPublicNames:[] as const,displayName:'Shante',roleLabels:['Loc Artist','Esthetician'],specialties:['Locs','Esthetics'],legacyBio:'Healthy locs meet intentional skincare and self-care. Ke brings loc artistry and esthetic services together within a personalized beauty experience.',bio:'Healthy locs meet intentional skincare and self-care. Loc artistry and esthetic services come together within a personalized beauty experience.',displayOrder:1},
  {legacySlug:'titi',slug:'christina',legacyName:'Titi',previousPublicNames:['Christina'] as const,displayName:'Cee',roleLabels:['Natural Hair Stylist','Braider'],specialties:['Natural Hair','Braids'],legacyBio:'Natural hair care, protective styling and finished looks designed around your hair and the look you want.',bio:'Natural hair care, protective styling and finished looks designed around your hair and the look you want.',displayOrder:2}
] as const;
export type LegacyArtistProfile=(typeof legacyArtistProfiles)[number];
export function artistRenamePatch(artist:{slug:string;name:string;displayName:string;bio:string|null},profile:LegacyArtistProfile){
  const priorNames=[profile.legacyName,...profile.previousPublicNames].map(name=>name.toLowerCase());
  return {
    ...(artist.slug===profile.legacySlug?{slug:profile.slug}:{}),
    ...(priorNames.includes(artist.name.trim().toLowerCase())?{name:profile.displayName}:{}),
    ...(priorNames.includes(artist.displayName.trim().toLowerCase())?{displayName:profile.displayName}:{}),
    ...(artist.bio===profile.legacyBio?{bio:profile.bio}:{})
  };
}
