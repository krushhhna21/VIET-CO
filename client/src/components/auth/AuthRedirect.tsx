import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export default function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If user just logged in as admin and not on admin page, redirect
    if (isAuthenticated && user?.role === 'admin' && location !== '/admin') {
      // Only redirect if we're on the admin login page
      if (location === '/admin' || location.includes('login')) {
        setLocation('/admin');
      }
    }
  }, [user, isAuthenticated, isLoading, location, setLocation]);

  return <>{children}</>;
}