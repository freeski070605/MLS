import type {Prisma,UserRole} from '@prisma/client';
import {staffArtistId} from './staff-scope';

type InquiryViewer={role:UserRole;artist?:{id:string;slug:string}|null};

/** Restrict assigned admins to their own inquiries. Legacy Cee booking
 * requests predate the artistId field, so identify ONLY the exact old subject
 * created by our own historical booking endpoint, not arbitrary unassigned
 * contact messages. */
export function inquiryWhereForStaff(user:InquiryViewer):Prisma.InquiryWhereInput{
 const own=staffArtistId(user);
 if(!own)return {};
 if(user.artist?.slug==='christina')return {OR:[
   {artistId:own},
   {artistId:null,subject:{in:['Titi booking request — Cee','Cee booking request']}}
 ]};
 return {artistId:own};
}
