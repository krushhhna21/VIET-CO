import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToContent = () => {
    const nextSection = document.getElementById('department-intro');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
      {/* Premium 4K Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
           style={{
             backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2844&q=80')"
           }}>
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-primary/60 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Premium Hero Content */}
      <div className="relative z-10 text-center text-primary-foreground max-w-6xl mx-auto px-4 animate-slide-up">
        <div className="premium-card p-8 rounded-3xl mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight text-gradient" data-testid="hero-title">
            Computer Department
            <span className="block text-accent text-4xl md:text-5xl mt-4 font-light">
              Vishweshwarayya Institute of Engineering & Technology
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed font-light" data-testid="hero-description">
            Pioneering excellence in computer science education, research, and innovation. 
            Shaping the future of technology through cutting-edge curriculum and world-class faculty.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              onClick={scrollToContent}
              className="premium-gradient text-white px-10 py-6 rounded-2xl font-semibold text-xl hover:shadow-glow-lg transition-all duration-300 hover-lift animate-glow group"
              data-testid="explore-programs-button"
            >
              <span className="group-hover:scale-105 transition-transform duration-200">Explore Programs</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="glass-effect border-2 border-primary/50 text-primary-foreground px-10 py-6 rounded-2xl font-semibold text-xl hover:bg-primary/20 hover:border-primary transition-all duration-300 hover-lift backdrop-blur-sm"
              data-testid="virtual-tour-button"
            >
              Virtual Tour
            </Button>
          </div>
        </div>
      </div>
      
      {/* Premium Scroll Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary animate-bounce cursor-pointer group hover:scale-110 transition-transform duration-200"
        data-testid="scroll-indicator"
      >
        <div className="p-3 rounded-full glass-effect group-hover:bg-primary/20 transition-colors duration-200">
          <ChevronDown className="h-8 w-8" />
        </div>
      </button>
    </section>
  );
}
