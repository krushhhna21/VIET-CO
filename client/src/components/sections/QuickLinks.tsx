import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, Calendar, Book, Camera } from "lucide-react";

const QuickLinks: React.FC = () => {
  const quickLinks = [
    {
      title: "Latest News",
      description: "Stay updated with department announcements and achievements",
      icon: Newspaper,
      href: "/news",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      title: "Upcoming Events",
      description: "Workshops, seminars, and technical competitions",
      icon: Calendar,
      href: "/events",
      bgColor: "bg-accent/10",
      iconColor: "text-accent"
    },
    {
      title: "Study Notes",
      description: "Access lecture notes, assignments, and study materials",
      icon: Book,
      href: "/notes",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      title: "Media Gallery",
      description: "Photos and videos from events and activities",
      icon: Camera,
      href: "/media",
      bgColor: "bg-accent/10",
      iconColor: "text-accent"
    }
  ];

  return (
    <section id="quick-links" className="py-16 bg-muted" data-testid="quick-links">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Quick Access</h2>
          <p className="text-muted-foreground">Everything you need, just a click away</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <Link key={index} href={link.href}>
              <Card className="hover-lift cursor-pointer transition-all duration-200" data-testid={`quick-link-${link.title.toLowerCase().replace(' ', '-')}`}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${link.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <link.icon className={`${link.iconColor} h-6 w-6`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{link.title}</h3>
                  <p className="text-muted-foreground text-sm">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(QuickLinks);
