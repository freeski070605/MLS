import type { UserRole } from '@prisma/client';
/** Artist-linked ADMIN and ARTIST can manage only their assigned artist's records. */
export function canManage(userRole: UserRole, entityArtistId?: string, userArtistId?: string) {
  return userRole === 'OWNER' || ((userRole === 'ADMIN' || userRole === 'ARTIST') && !!entityArtistId && entityArtistId === userArtistId);
}
