import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/news", label: "News" },
    { href: "/events", label: "Events" },
    { href: "/notes", label: "Notes" },
    { href: "/media", label: "Media" },
    { href: "/contact", label: "Contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search query:", searchQuery);
  };

  return (
    <nav className="glass-effect shadow-dark-lg border-b border-border/20 sticky top-0 z-50 backdrop-blur-xl" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Premium Logo */}
          <Link href="/" data-testid="logo-link">
            <div className="flex items-center space-x-4 cursor-pointer group">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="VIET Logo" 
                  className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    console.error('Error loading logo:', e);
                    e.currentTarget.src = 'public/logo.png';
                  }}
                  onLoad={() => console.log('Logo loaded successfully')}
                />
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors duration-300"></div>
              </div>
              <div className="group-hover:translate-x-1 transition-transform duration-300">
                <h1 className="text-xl font-bold text-gradient">VIET</h1>
                <p className="text-sm text-muted-foreground font-medium">Computer Department</p>
              </div>
            </div>
          </Link>

          {/* Premium Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  <span
                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer rounded-xl relative group ${
                      location === link.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${
                      location === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Premium Search */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-12 glass-effect border-primary/20 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 rounded-xl"
                data-testid="search-input"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 p-1 rounded-lg hover:bg-primary/10"
                data-testid="search-button"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Premium Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground font-medium px-3 py-2 glass-effect rounded-xl">
                  Welcome, <span className="text-primary font-semibold">{user.username}</span>
                </span>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button size="sm" className="premium-gradient text-white rounded-xl hover:shadow-glow transition-all duration-300 hover-lift" data-testid="admin-dashboard-button">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="glass-effect border-primary/30 hover:bg-primary/20 rounded-xl transition-all duration-300 hover-lift"
                  data-testid="logout-button"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/admin">
                <Button size="sm" className="premium-gradient text-white rounded-xl hover:shadow-glow transition-all duration-300 hover-lift" data-testid="admin-login-button">
                  Admin Login
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-button"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4" data-testid="mobile-menu">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                >
                  <div
                    className={`block px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      location === link.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 relative">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
                data-testid="mobile-search-input"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                data-testid="mobile-search-button"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
