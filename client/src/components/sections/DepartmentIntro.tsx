import { Button } from "@/components/ui/button";

export default function DepartmentIntro() {
  return (
    <section id="department-intro" className="py-20 bg-background" data-testid="department-intro">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              ESTABLISHED 1999
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="intro-title">
              Leading Computer Science Education Since
              <span className="text-primary"> Two Decades</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed" data-testid="intro-description">
              Our Computer Science Department stands at the forefront of technological education and innovation. 
              With state-of-the-art laboratories, renowned faculty, and industry partnerships, we prepare students 
              for the challenges of tomorrow's digital world.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" data-testid="stat-students">500+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" data-testid="stat-faculty">50+</div>
                <div className="text-sm text-muted-foreground">Faculty</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" data-testid="stat-placement">95%</div>
                <div className="text-sm text-muted-foreground">Placement</div>
              </div>
            </div>
            
            <Button 
              className="hover-lift"
              data-testid="learn-more-button"
            >
              Learn More About Us
            </Button>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Students working in modern computer laboratory" 
              className="rounded-xl shadow-2xl w-full h-auto"
              data-testid="intro-image"
            />
            <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm">Lab Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
