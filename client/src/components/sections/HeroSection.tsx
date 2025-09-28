import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Computer Department",
      subtitle: "Vishweshwarayya Institute of Engineering & Technology",
      description: "Pioneering excellence in computer science education, research, and innovation. Shaping the future of technology through cutting-edge curriculum and world-class faculty.",
      type: "main"
    },
    {
      id: 2,
      title: "Upcoming Events",
      subtitle: "Tech Symposium 2025 - October 15-17",
      description: "Join us for the biggest technology symposium featuring industry leaders, workshops, and competitions. Registration now open for all students and professionals.",
      type: "events"
    },
    {
      id: 3,
      title: "Latest News",
      subtitle: "New AI Research Lab Inaugurated",
      description: "Our department proudly announces the opening of a state-of-the-art Artificial Intelligence Research Lab equipped with the latest hardware and software for advanced research.",
      type: "news"
    },
    {
      id: 4,
      title: "Achievement Spotlight",
      subtitle: "Students Win National Coding Championship",
      description: "Our computer science students secured first place in the National Inter-College Coding Championship, competing against 200+ institutions across the country.",
      type: "achievement"
    },
    {
      id: 5,
      title: "Industry Partnership",
      subtitle: "New Collaboration with Tech Giants",
      description: "We've partnered with leading technology companies to provide internships, workshops, and placement opportunities for our students in cutting-edge domains.",
      type: "partnership"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToContent = () => {
    const nextSection = document.getElementById('department-intro');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getSlideColor = (type: string) => {
    switch (type) {
      case 'main': return 'from-blue-600 to-purple-600';
      case 'events': return 'from-green-600 to-teal-600';
      case 'news': return 'from-orange-600 to-red-600';
      case 'achievement': return 'from-yellow-600 to-orange-600';
      case 'partnership': return 'from-purple-600 to-pink-600';
      default: return 'from-blue-600 to-purple-600';
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
      {/* Premium 4K Background with College Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
           style={{
             backgroundImage: "url('/viet-college.png')"
           }}>
        <div className="absolute inset-0 hero-gradient opacity-75"></div>
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-primary/60 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Premium Hero Content with Slideshow */}
      <div className="relative z-10 text-center text-primary-foreground max-w-6xl mx-auto px-4">
        <div className="premium-card p-8 rounded-3xl mb-8 min-h-[500px] flex flex-col justify-center relative overflow-hidden">
          {/* Slide Indicator Dots */}
          <div className="absolute top-6 right-6 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-primary shadow-glow' 
                    : 'bg-primary/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          {/* Slideshow Content */}
          <div className="relative">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 transform ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0' 
                    : index < currentSlide 
                      ? 'opacity-0 -translate-x-full' 
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <div className={`inline-block px-4 py-2 rounded-full text-xs font-bold mb-4 bg-gradient-to-r ${getSlideColor(slide.type)} text-white`}>
                  {slide.type.toUpperCase()}
                </div>
                <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight text-gradient animate-slide-up" data-testid="hero-title">
                  {slide.title}
                  <span className="block text-accent text-4xl md:text-5xl mt-4 font-light">
                    {slide.subtitle}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed font-light animate-slide-up" style={{animationDelay: '0.2s'}} data-testid="hero-description">
                  {slide.description}
                </p>
              </div>
            ))}
            
            {/* Ensure content has minimum height */}
            <div className="opacity-0 pointer-events-none">
              <div className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-4">
                PLACEHOLDER
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                Placeholder Title
                <span className="block text-4xl md:text-5xl mt-4 font-light">
                  Placeholder Subtitle
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed font-light">
                Placeholder description text that ensures proper spacing and layout consistency.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
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

        {/* Slide Navigation Arrows */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="glass-effect p-3 rounded-full hover:bg-primary/20 transition-all duration-300 hover-lift group"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="glass-effect p-3 rounded-full hover:bg-primary/20 transition-all duration-300 hover-lift group"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
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
