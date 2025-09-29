import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function Admin() {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before showing content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Loading state - show for a shorter time to avoid flickering
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted" data-testid="admin-loading">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted">
        {/* Header with back to home */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="back-to-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <AdminLogin />
      </div>
    );
  }

  // Authenticated but not admin
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted" data-testid="admin-unauthorized">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access the admin dashboard. 
              Only administrators can access this area.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Logged in as: <span className="font-medium">{user?.username}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Role: <span className="font-medium">{user?.role}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full" data-testid="go-home">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="destructive"
                onClick={() => window.location.reload()}
                className="flex-1"
                data-testid="try-different-account"
              >
                Try Different Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated admin - show dashboard
  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard-container">
      {/* Admin Header */}
      <div className="bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Shield className="text-primary-foreground h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                <p className="text-primary-foreground/80 text-sm">VIET Computer Department</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm">Welcome back,</p>
                <p className="text-sm font-medium">{user?.username}</p>
              </div>
              
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  data-testid="view-website"
                >
                  View Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <AdminDashboard />

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 VIET Computer Department. Admin Dashboard.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="/">
                <Button variant="link" size="sm" className="text-muted-foreground">
                  Public Website
                </Button>
              </Link>
              <span className="text-muted-foreground text-sm">
                Version 1.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
