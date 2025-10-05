import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Eye, Monitor, FlaskConical, BookOpen } from "lucide-react";
import type { Faculty } from "@shared/schema";

const AboutUs: React.FC = () => {
  const { data: faculty, isLoading } = useQuery<Faculty[]>({
    queryKey: ['/api/faculty'],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-background" data-testid="about-us-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto mb-16" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-32 mx-auto mb-2" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-background" data-testid="about-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">About Our Department</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dedicated to excellence in computer science education, research, and innovation
          </p>
        </div>
        
        {/* Mission and Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Card className="hover-lift">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Target className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide world-class education in computer science and engineering, fostering innovation, 
                critical thinking, and ethical leadership. We strive to prepare students for successful 
                careers in technology while contributing to societal advancement through cutting-edge research.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <Eye className="text-accent h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be recognized as a premier computer science department that produces globally competitive 
                graduates, conducts impactful research, and serves as a hub for technological innovation 
                and entrepreneurship in the region.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Faculty Section */}
        {faculty && faculty.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Our Faculty</h3>
              <p className="text-muted-foreground">Meet our distinguished team of educators and researchers</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {faculty.slice(0, 4).map((member) => (
                <Card key={member.id} className="text-center hover-lift" data-testid={`faculty-${member.id}`}>
                  <CardContent className="p-6">
                    <img 
                      src={member.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face`}
                      alt={`${member.name} - ${member.position}`}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h4 className="text-lg font-semibold text-foreground mb-2">{member.name}</h4>
                    <p className="text-accent text-sm font-medium mb-2">{member.position}</p>
                    <p className="text-muted-foreground text-sm">{member.specialization}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Infrastructure */}
        <Card className="hover-lift">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Infrastructure & Facilities</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Monitor className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Computer Labs</h4>
                  <p className="text-muted-foreground text-sm">8 state-of-the-art computer laboratories with latest hardware</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FlaskConical className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Research Labs</h4>
                  <p className="text-muted-foreground text-sm">Dedicated spaces for AI, ML, and cybersecurity research</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <BookOpen className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Digital Library</h4>
                  <p className="text-muted-foreground text-sm">Extensive collection of technical books and journals</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default React.memo(AboutUs);
