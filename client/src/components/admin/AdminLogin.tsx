import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { login, loginLoading, user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Handle successful login redirect
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin' && !loginLoading) {
      setLoginSuccess(true);
      
      // Multiple redirect attempts for reliability
      const redirectTimer = setTimeout(() => {
        setLocation('/admin');
      }, 500);

      // Fallback redirect
      const fallbackTimer = setTimeout(() => {
        if (window.location.pathname !== '/admin') {
          window.location.href = '/admin';
        }
      }, 1500);

      return () => {
        clearTimeout(redirectTimer);
        clearTimeout(fallbackTimer);
      };
    }
  }, [isAuthenticated, user, loginLoading, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      return;
    }
    login(credentials);
  };

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  // Show success state briefly before redirect
  if (loginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600 h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Login Successful!</h2>
            <p className="text-muted-foreground mb-4">Redirecting to admin dashboard...</p>
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8" data-testid="admin-login">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="text-primary-foreground h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-muted-foreground">Sign in to access the admin dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter your username"
                className="mt-1"
                data-testid="input-username"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                className="mt-1"
                data-testid="input-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginLoading || !credentials.username || !credentials.password}
              data-testid="button-login"
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
