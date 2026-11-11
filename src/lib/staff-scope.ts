import type {UserRole} from '@prisma/client';

export type StaffIdentity={role:UserRole;artist?:{id:string;slug:string}|null};

/** Owner can manage the studio. Every other staff account is restricted to
 * its linked artist. Missing artist assignments fail closed. */
export function staffArtistId(user:StaffIdentity):string|null{
 if(user.role==='OWNER')return null;
 if(!['ADMIN','ARTIST'].includes(user.role)||!user.artist?.id)throw new Error('Artist assignment required');
 return user.artist.id;
}
export function staffCanViewIntakes(user:StaffIdentity):boolean{
 return user.role==='OWNER'||(['ADMIN','ARTIST'].includes(user.role)&&user.artist?.slug==='shante');
}
export const artistSections=new Set(['calendar','appointments','services','artists','gallery','clients','inquiries']);
export const artistWriteSections=new Set(['appointments','services','artists','gallery','clients','inquiries','availability','blockedTimes']);
export function allowedStaffSection(user:StaffIdentity,section:string):boolean{
 return user.role==='OWNER'||(['ADMIN','ARTIST'].includes(user.role)&&!!user.artist?.id&&artistSections.has(section));
}
export function belongsToStaff(user:StaffIdentity,artistId:string|null|undefined):boolean{
 return user.role==='OWNER'||!!artistId&&artistId===user.artist?.id;
}
