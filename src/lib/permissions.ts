import type { UserRole } from '@prisma/client';
export function canManage(userRole: UserRole, entityArtistId?: string, userArtistId?: string) {
  return userRole === 'OWNER' || userRole === 'ADMIN' || (userRole === 'ARTIST' && !!entityArtistId && entityArtistId === userArtistId);
}
