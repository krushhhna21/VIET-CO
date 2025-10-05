import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'main' | 'events' | 'news' | 'achievement' | 'partnership';
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVirtualTourActive, setIsVirtualTourActive] = useState(false);
  const [tourProgress, setTourProgress] = useState(0);

  // Fetch hero slides from API
  const { data: apiSlides, isLoading } = useQuery<HeroSlide[]>({
    queryKey: ['/api/hero-slides'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fallback slides in case API fails or returns empty
  const fallbackSlides: HeroSlide[] = [
    {
      id: 'fallback-1',
      title: "Computer Department",
      subtitle: "Vishweshwarayya Institute of Engineering & Technology",
      description: "Pioneering excellence in computer science education, research, and innovation. Shaping the future of technology through cutting-edge curriculum and world-class faculty.",
      type: "main",
      isActive: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'fallback-2',
      title: "Innovation Hub",
      subtitle: "Fostering Tomorrow's Technology Leaders",
      description: "Experience world-class education in computer science with state-of-the-art labs, expert faculty, and industry partnerships that prepare you for the future.",
      type: "achievement",
      isActive: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  // Use API slides if available and active, otherwise fallback
  const slides = apiSlides && apiSlides.length > 0 
    ? apiSlides
        .filter(slide => slide.isActive)
        .sort((a, b) => a.order - b.order)
    : fallbackSlides;

  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  // Reset current slide when slides change
  useEffect(() => {
    setCurrentSlide(0);
  }, [apiSlides]);

  const scrollToContent = () => {
    const nextSection = document.getElementById('department-intro');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startVirtualTour = async () => {
    if (isVirtualTourActive) return;
    
    setIsVirtualTourActive(true);
    setTourProgress(0);
    
    // Array of section IDs to visit during the virtual tour
    const tourSections = [
      'department-intro',
      'quick-links',
      'about',
      'news', 
      'events',
      'notes',
      'media',
      'contact'
    ];

    try {
      // Scroll through each section with a delay
      for (let i = 0; i < tourSections.length; i++) {
        const section = document.getElementById(tourSections[i]);
        if (section) {
          // Update progress
          setTourProgress(((i + 1) / tourSections.length) * 100);
          
          section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
          
          // Wait for scroll animation and viewing time
          await new Promise(resolve => setTimeout(resolve, 2500));
        }
      }

      // Wait a bit at the bottom
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Scroll back to top (hero section)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Complete tour
      setTourProgress(100);

    } catch (error) {
      console.error('Virtual tour error:', error);
    } finally {
      // Reset tour state after a delay
      setTimeout(() => {
        setIsVirtualTourActive(false);
        setTourProgress(0);
      }, 2000);
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

  // Loading state
  if (isLoading) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        {/* Premium 4K Background with College Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
             style={{
               backgroundImage: "url('/viet-college.png')"
             }}>
          <div className="absolute inset-0 hero-gradient opacity-75"></div>
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 text-center text-primary-foreground max-w-6xl mx-auto px-4">
          <div className="glass-premium p-8 rounded-3xl mb-8 min-h-[500px] flex flex-col justify-center">
            <Skeleton className="h-6 w-24 mb-4 mx-auto bg-primary/20" />
            <Skeleton className="h-20 w-full mb-6 bg-primary/20" />
            <Skeleton className="h-16 w-3/4 mb-8 mx-auto bg-primary/20" />
            <Skeleton className="h-6 w-full mb-4 bg-primary/20" />
            <Skeleton className="h-6 w-5/6 mb-10 mx-auto bg-primary/20" />
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Skeleton className="h-14 w-48 bg-primary/20" />
              <Skeleton className="h-14 w-48 bg-primary/20" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
      {/* Virtual Tour Notification */}
      {isVirtualTourActive && (
        <div className="fixed top-6 right-6 z-50 glass-effect px-6 py-3 rounded-2xl border border-primary/30 backdrop-blur-sm tour-notification">
          <div className="flex items-center gap-3 text-primary-foreground">
            <svg className="animate-spin h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-semibold">Virtual Tour in Progress</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 h-2 bg-background/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary tour-progress-bar transition-all duration-300"
                    style={{ width: `${tourProgress}%` }}
                  />
                </div>
                <span className="text-xs text-primary">{Math.round(tourProgress)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="glass-premium p-8 rounded-3xl mb-8 min-h-[500px] flex flex-col justify-center relative overflow-hidden">
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
            
            {/* Empty state - should not normally show due to fallback slides */}
            {slides.length === 0 && (
              <div className="text-center">
                <div className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  WELCOME
                </div>
                <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight text-gradient">
                  VIET Computer Department
                  <span className="block text-accent text-4xl md:text-5xl mt-4 font-light">
                    Excellence in Technology Education
                  </span>
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed font-light">
                  Welcome to our department. Content is being updated.
                </p>
              </div>
            )}
            
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
              onClick={startVirtualTour}
              disabled={isVirtualTourActive}
              className={`virtual-tour-btn glass-effect border-2 border-primary/50 text-primary-foreground px-10 py-6 rounded-2xl font-semibold text-xl hover:bg-primary/20 hover:border-primary transition-all duration-300 hover-lift backdrop-blur-sm group relative overflow-hidden ${
                isVirtualTourActive ? 'animate-pulse cursor-not-allowed opacity-90' : ''
              }`}
              data-testid="virtual-tour-button"
            >
              {/* Progress bar for virtual tour */}
              {isVirtualTourActive && (
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300"
                  style={{ width: `${tourProgress}%` }}
                />
              )}
              <span className="flex items-center gap-2 relative z-10">
                {isVirtualTourActive ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Touring... {Math.round(tourProgress)}%</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Virtual Tour
                  </>
                )}
              </span>
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
};

export default React.memo(HeroSection);
