import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Eye, Monitor, FlaskConical, BookOpen, ListChecks, Landmark } from "lucide-react";
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Department of Computer Engineering</h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Empowering rural talent through quality technical education, professional values, research mindset and technology-driven societal contribution.
          </p>
        </div>

        {/* Department Overview */}
        <Card className="hover-lift mb-20">
          <CardContent className="p-8 space-y-4 leading-relaxed text-muted-foreground">
            <div className="flex items-center gap-3 mb-2">
              <Landmark className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Department Overview</h2>
            </div>
            <p>The Department of Computer Engineering welcomes you to be a part of the thriving computer science engineering community and become visionaries and change makers of the future. Department came into existence in the year 2008 with an intake of 60.</p>
            <p>From the foundations of computer science to core courses, programming, and emerging technologies, our esteemed faculty members provide a broad range of varied learning opportunities. We want our students' education to serve as the cornerstone of their lifelong learning. Since the lifespan of the tools and techniques used today is shortened by steady and quick advancements in computing technologies, learning is an ongoing process that continues after getting a degree.</p>
            <p>Therefore, creating walking instructions in any language or package is not our goal. Instead, through microprojects, industry visits, guest lectures, student activities, and leadership events, they are given a solid foundation in computer science and problem-solving approaches and are made flexible to changes with a heavy emphasis on context and project-based learning.</p>
            <p>We think that this teaching-learning methodology, when combined with real-world experience obtained through industrial training in reputable companies, prepares our students to meet the demands of the software sector. We have no doubt that our students are deserving of the organization they join.</p>
            <p>Also our department is having MoUs with some of the best organizations and trying to strengthen them further.</p>
          </CardContent>
        </Card>

        {/* Vision & Mission */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Card className="hover-lift">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <Eye className="text-accent h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">OUR VISION</h2>
              <p className="text-muted-foreground leading-relaxed">To provide quality technical education in rural area.</p>
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Target className="text-primary h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">OUR MISSION</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed text-sm md:text-base">
                <li>To impart eco-friendly advanced engineering knowledge.</li>
                <li>To inculcate ethical and moral values among budding engineers.</li>
                <li>Establishment of mentoring system for all-round personal and Professional enhancement.</li>
                <li>To make students aware social and national responsibilities.</li>
                <li>To encourage students to pursue higher education and take Competitive and career enhancement courses.</li>
                <li>To create technology based society which is the need of modern era.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Program Outcomes */}
        <Card className="hover-lift mb-16">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <ListChecks className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Program Outcomes (POs)</h2>
            </div>
            <ul className="list-decimal pl-6 space-y-3 text-muted-foreground leading-relaxed text-sm md:text-base">
              <li><strong>PO-1 Basic & Discipline specific knowledge:</strong> Apply knowledge of basic mathematics, sciences and basic engineering fundamental and engineering specialization to solve the engineering problem.</li>
              <li><strong>PO-2 Problem analysis:</strong> Identify and analyze well-defined engineering problems using codified standard methods.</li>
              <li><strong>PO-3 Design/ development of solutions:</strong> Design solutions for well-defined technical problems and assist with the design of systems components or processes to meet specified needs.</li>
              <li><strong>PO-4 Engineering Tools, Experimentation and Testing:</strong> Apply modern engineering tools and appropriate technique to conduct standard tests and measurements.</li>
              <li><strong>PO-5 Engineering practices for society, sustainability and environment:</strong> Apply appropriate technology in context of society, sustainability, environment and ethical practices.</li>
              <li><strong>PO-6 Project Management:</strong> Use engineering management principles individually, as a team member or a leader to manage projects and effectively communicate about well- defined engineering activities.</li>
              <li><strong>PO-7 Life-long learning:</strong> Ability to analyze individual needs and engage in updating in the context of technological changes.</li>
            </ul>
          </CardContent>
        </Card>

        {/* PEOs */}
        <Card className="hover-lift mb-16">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Program Educational Objectives (PEOs)</h2>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground leading-relaxed text-sm md:text-base">
              <li><strong>PEO 1:</strong> Provide socially responsible, environment friendly solutions to Computer engineering related broad-based problems adapting professional ethics.</li>
              <li><strong>PEO 2:</strong> Provide socially responsible, environment friendly solutions to Computer engineering related broad-based problems adapting professional ethics.</li>
              <li><strong>PEO 3:</strong> Solve broad-based problems individually and as a team member communicating effectively in the world of work.</li>
            </ul>
          </CardContent>
        </Card>

        {/* PSOs */}
        <Card className="hover-lift mb-20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Program Specific Outcomes (PSOs)</h2>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground leading-relaxed text-sm md:text-base">
              <li><strong>PSO-1 Computer Software and Hardware Usage:</strong> Use state-of-the-art technologies for operation and application of computer software and hardware.</li>
              <li><strong>PSO-2 Computer Engineering Maintenance:</strong> Maintain computer engineering related software and hardware systems.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Faculty Section */}
        {faculty && faculty.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Faculty</h2>
              <p className="text-muted-foreground">Meet our distinguished team of educators and researchers</p>
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
                    <p className="text-muted-foreground text-sm mb-1">{member.specialization}</p>
                    {member.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-3">{member.bio}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Infrastructure & Facilities */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Infrastructure & Facilities</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Computer Labs</h3>
                <p className="text-muted-foreground text-sm">8 state-of-the-art computer laboratories with latest hardware</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Research Labs</h3>
                <p className="text-muted-foreground text-sm">Dedicated spaces for AI, ML and cybersecurity exploration</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-primary h-8 w-8" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Digital Library</h3>
                <p className="text-muted-foreground text-sm">Technical books, journals and digital research resources</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
