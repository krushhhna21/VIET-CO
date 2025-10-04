import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { authService, type User, type AuthResponse } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface LoginCredentials {
  username: string;
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clear(); // Clear corrupted auth data
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Force navigation with state update
  const navigateToAdmin = useCallback(() => {
    // Force a complete re-render by updating the location
    setLocation('/admin');
    
    // Also use window.location as a fallback
    if (window.location.pathname !== '/admin') {
      setTimeout(() => {
        window.history.pushState({}, '', '/admin');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 50);
    }
  }, [setLocation]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      return response.json();
    },
    onSuccess: (data) => {
      // Immediately update auth state
      authService.setToken(data.token);
      authService.setUser(data.user);
      setUser(data.user);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.username}!`,
      });

      // Clear any cached data and invalidate queries
      queryClient.invalidateQueries();
      
      // Force navigation with multiple approaches for reliability
      if (data.user.role === 'admin') {
        // Immediate navigation
        setLocation('/admin');
        
        // Backup navigation methods
        setTimeout(() => {
          if (window.location.pathname !== '/admin') {
            navigateToAdmin();
          }
        }, 100);
        
        // Final fallback
        setTimeout(() => {
          if (window.location.pathname !== '/admin') {
            window.location.href = '/admin';
          }
        }, 500);
      } else {
        setLocation('/');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    },
  });

  const logout = () => {
    authService.clear();
    setUser(null);
    queryClient.clear(); // Clear all cached data
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });

    setLocation('/');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    logout,
  };
}
