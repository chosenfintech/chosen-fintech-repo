'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

/** True when the signed-in user is an ADMIN (deletes & user management). */
export function useIsAdmin(): boolean {
  return useSelector((state: RootState) => state.auth.user?.role === 'ADMIN');
}
