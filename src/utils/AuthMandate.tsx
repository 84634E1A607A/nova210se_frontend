import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../App';
import React from 'react';

type Props = { children: React.ReactNode };

export function AuthMandate({ children }: Props): React.ReactElement | null {
  const { isAuthed } = useAuthContext();
  const location = useLocation();

  return isAuthed === true || location.pathname === '/login' ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
}
