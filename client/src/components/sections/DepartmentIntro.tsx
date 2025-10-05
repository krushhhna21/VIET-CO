import React from "react";
import { Button } from "@/components/ui/button";

const DepartmentIntro: React.FC = () => {
  return (
    <section id="department-intro" className="py-32 bg-background relative overflow-hidden" data-testid="department-intro">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            <div className="inline-block bg-primary/20 text-primary px-6 py-3 rounded-full text-sm font-bold mb-8 glass-effect">
              ESTABLISHED 1999
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" data-testid="intro-title">
              Leading Computer Science Education Since
              <span className="text-gradient block mt-2"> Two Decades</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed font-light" data-testid="intro-description">
              Our Computer Science Department stands at the forefront of technological education and innovation. 
              With state-of-the-art laboratories, renowned faculty, and industry partnerships, we prepare students 
              for the challenges of tomorrow's digital world.
            </p>
            
            <div className="grid grid-cols-3 gap-8 mb-12">
              <div className="text-center premium-card p-6 rounded-2xl hover-lift">
                <div className="text-4xl font-bold text-gradient mb-2" data-testid="stat-students">500+</div>
                <div className="text-sm text-muted-foreground font-medium">Students</div>
              </div>
              <div className="text-center premium-card p-6 rounded-2xl hover-lift" style={{animationDelay: '0.2s'}}>
                <div className="text-4xl font-bold text-gradient mb-2" data-testid="stat-faculty">50+</div>
                <div className="text-sm text-muted-foreground font-medium">Faculty</div>
              </div>
              <div className="text-center premium-card p-6 rounded-2xl hover-lift" style={{animationDelay: '0.4s'}}>
                <div className="text-4xl font-bold text-gradient mb-2" data-testid="stat-placement">95%</div>
                <div className="text-sm text-muted-foreground font-medium">Placement</div>
              </div>
            </div>
            
            <Button 
              className="premium-gradient text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-glow-lg transition-all duration-300 hover-lift group"
              data-testid="learn-more-button"
            >
              <span className="group-hover:scale-105 transition-transform duration-200">Learn More About Us</span>
            </Button>
          </div>
          
          <div className="relative animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="relative premium-card p-8 rounded-3xl hover-lift">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Students working in modern computer laboratory" 
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="intro-image"
              />
              <div className="absolute -bottom-8 -left-8 bg-accent/90 text-accent-foreground p-8 rounded-2xl shadow-2xl glass-effect backdrop-blur-sm animate-glow">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm font-medium">Lab Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(DepartmentIntro);
