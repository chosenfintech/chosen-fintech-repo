// src/utils/require-admin.ts
import { ForbiddenError } from '@/middlewares/error-handler';

/**
 * Guards admin-only actions (content create/update/delete/publish toggles).
 * Throws ForbiddenError when the session is not an admin.
 */
export function requireAdmin(session: { isAdmin: boolean }): void {
  if (!session.isAdmin) {
    throw new ForbiddenError('Admin access required');
  }
}
