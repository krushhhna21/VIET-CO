import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/">
              <div className="flex items-center space-x-3 mb-6 cursor-pointer">
                <img 
                  src="/logo.png" 
                  alt="VIET Logo" 
                  className="w-16 h-16 object-contain"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    console.error('Error loading logo:', e);
                    // Try with relative path
                    e.currentTarget.src = 'public/logo.png';
                  }}
                  onLoad={() => console.log('Logo loaded successfully')}
                />
                <div>
                  <h3 className="font-bold text-foreground">VIET</h3>
                  <p className="text-xs text-muted-foreground">Computer Department</p>
                </div>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Shri Vishweshwar Shikshan Prasarak Mandal's<br />
              VISHWESHWARAYYA INSTITUTE OF ENGINEERING AND TECHNOLOGY<br />
              Approved by AICTE New Delhi, Affiliated to MSBTE Mumbai.<br />
              DTE Mumbai, Govt. of Maharashtra<br />
              Accreditated by National Board of Accreditation, New Delhi
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="social-facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="social-twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="social-linkedin"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="social-youtube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    About Department
                  </span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Admissions
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Academic Programs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Research
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Career Services
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/notes">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    Study Materials
                  </span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Online Library
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Student Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Faculty Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Alumni Network
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt text-muted-foreground mt-1"></i>
                <span className="text-muted-foreground">
                  Dilip Nagar, Almala Tq. Ausa Dist. Latur - 413556 (M.S.)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-muted-foreground"></i>
                <span className="text-muted-foreground">9421091410, 9834288118, 9049994555, 9890990606</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-muted-foreground"></i>
                <span className="text-muted-foreground">vishpoly@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © VIET 2024. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
