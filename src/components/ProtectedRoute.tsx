import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/context/tokenContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with the intended location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}