import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Eye, Monitor, FlaskConical, BookOpen } from "lucide-react";
import type { Faculty } from "@shared/schema";

export default function About() {
  const { data: faculty, isLoading } = useQuery<Faculty[]>({
    queryKey: ['/api/faculty'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-20" data-testid="about-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-96 mx-auto mb-8" />
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20" data-testid="about-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About Our Department</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dedicated to excellence in computer science education, research, and innovation since 1999
          </p>
        </div>
        
        {/* Mission and Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Card className="hover-lift">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Target className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
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
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be recognized as a premier computer science department that produces globally competitive 
                graduates, conducts impactful research, and serves as a hub for technological innovation 
                and entrepreneurship in the region.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Department Statistics */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Students Enrolled</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Faculty Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">95%</div>
            <div className="text-muted-foreground">Placement Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">25+</div>
            <div className="text-muted-foreground">Years of Excellence</div>
          </div>
        </div>
        
        {/* Faculty Section */}
        {faculty && faculty.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Distinguished Faculty</h2>
              <p className="text-muted-foreground">Meet our team of world-class educators and researchers</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {faculty.map((member) => (
                <Card key={member.id} className="text-center hover-lift" data-testid={`faculty-${member.id}`}>
                  <CardContent className="p-6">
                    <img 
                      src={member.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face`}
                      alt={`${member.name} - ${member.position}`}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{member.name}</h3>
                    <p className="text-accent text-sm font-medium mb-2">{member.position}</p>
                    <p className="text-muted-foreground text-sm mb-3">{member.specialization}</p>
                    {member.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-3">{member.bio}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Infrastructure */}
        <Card className="mb-20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Infrastructure & Facilities</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Computer Laboratories</h3>
                <p className="text-muted-foreground text-sm">8 state-of-the-art computer laboratories equipped with the latest hardware and software for hands-on learning</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Research Laboratories</h3>
                <p className="text-muted-foreground text-sm">Specialized research labs for AI, Machine Learning, Cybersecurity, and Data Science research projects</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Digital Library</h3>
                <p className="text-muted-foreground text-sm">Extensive digital collection with access to international journals, research papers, and technical resources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our History</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="mb-6">
                Established in 1999, the Computer Science Department at Vishweshwarayya Institute of 
                Engineering & Technology has been at the forefront of technological education for over 
                two decades. What started as a small department with a handful of faculty and students 
                has grown into one of the most respected computer science programs in the region.
              </p>
              <p className="mb-6">
                Over the years, we have continuously evolved our curriculum to keep pace with the 
                rapidly changing technology landscape. From the early days of basic programming 
                languages to today's focus on artificial intelligence, machine learning, and 
                cybersecurity, we have always been ahead of the curve.
              </p>
              <p>
                Today, our alumni work in leading technology companies worldwide, and our faculty 
                are recognized experts in their respective fields. We continue to build on our 
                legacy of excellence while preparing for the challenges and opportunities of tomorrow.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
