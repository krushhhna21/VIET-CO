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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
           style={{
             backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
           }}>
        <div className="absolute inset-0 hero-gradient opacity-85"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center text-primary-foreground max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" data-testid="hero-title">
          Computer Department
          <span className="block text-accent text-3xl md:text-4xl mt-2">
            Vishweshwarayya Institute of Engineering & Technology
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed" data-testid="hero-description">
          Pioneering excellence in computer science education, research, and innovation. 
          Shaping the future of technology through cutting-edge curriculum and world-class faculty.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="gold-gradient text-accent-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all hover-lift"
            data-testid="explore-programs-button"
          >
            Explore Programs
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-foreground hover:text-primary transition-all hover-lift"
            data-testid="virtual-tour-button"
          >
            Virtual Tour
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary-foreground animate-bounce cursor-pointer"
        data-testid="scroll-indicator"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  );
}
