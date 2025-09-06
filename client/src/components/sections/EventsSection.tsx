import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

export default function EventsSection() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events', { published: true }],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-background" data-testid="events-section-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-72 mx-auto" />
          </div>
          <Card className="mb-12">
            <div className="grid lg:grid-cols-2">
              <Skeleton className="w-full h-80" />
              <div className="p-8">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  const featuredEvent = events?.[0];
  const upcomingEvents = events?.slice(1, 4) || [];

  return (
    <section id="events" className="py-20 bg-background" data-testid="events-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground">Join us for workshops, seminars, and competitions</p>
        </div>
        
        {/* Featured Event */}
        {featuredEvent && (
          <Card className="overflow-hidden mb-12 hover-lift" data-testid={`featured-event-${featuredEvent.id}`}>
            <div className="grid lg:grid-cols-2">
              <div className="relative">
                <img 
                  src={featuredEvent.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&w=600&h=400&fit=crop"}
                  alt={featuredEvent.title}
                  className="w-full h-80 lg:h-full object-cover" 
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-accent-foreground">
                    Featured Event
                  </Badge>
                </div>
              </div>
              <CardContent className="p-8 lg:p-12">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">
                    {new Date(featuredEvent.eventDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">{featuredEvent.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredEvent.description}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  {featuredEvent.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">{featuredEvent.location}</span>
                    </div>
                  )}
                  {featuredEvent.time && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">{featuredEvent.time}</span>
                    </div>
                  )}
                </div>
                <Button className="hover-lift" data-testid={`register-${featuredEvent.id}`}>
                  Register Now
                </Button>
              </CardContent>
            </div>
          </Card>
        )}
        
        {/* Event Calendar */}
        {upcomingEvents.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover-lift" data-testid={`event-card-${event.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {event.category}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        {new Date(event.eventDate).getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{event.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between">
                    {event.time && (
                      <span className="text-muted-foreground text-xs">{event.time}</span>
                    )}
                    <Link href={`/events/${event.id}`}>
                      <button className="text-primary text-sm font-medium hover:text-primary/80" data-testid={`learn-more-${event.id}`}>
                        Learn More
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {(!events || events.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming events at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/events">
            <Button className="hover-lift" data-testid="view-all-events">
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
