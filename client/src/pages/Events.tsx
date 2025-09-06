import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, MapPin, Users, Search } from 'lucide-react';
import type { Event } from '@shared/schema';

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events', { published: true }],
  });

  const categories = ['all', 'Workshop', 'Seminar', 'Competition', 'Conference'];

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const upcomingEvents = filteredEvents.filter(event => new Date(event.eventDate) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.eventDate) < new Date());

  if (isLoading) {
    return (
      <div className="min-h-screen py-20" data-testid="events-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20" data-testid="events-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Events & Activities</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us for workshops, seminars, competitions, and conferences
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                data-testid={`category-filter-${category.toLowerCase()}`}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Upcoming Events</h2>
            
            {/* Featured Event */}
            {upcomingEvents.length > 0 && (
              <Card className="overflow-hidden mb-8 hover-lift" data-testid={`featured-event-${upcomingEvents[0].id}`}>
                <div className="grid lg:grid-cols-2">
                  <div className="relative">
                    <img 
                      src={upcomingEvents[0].image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&w=600&h=400&fit=crop"}
                      alt={upcomingEvents[0].title}
                      className="w-full h-80 lg:h-full object-cover" 
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground">Featured Event</Badge>
                    </div>
                  </div>
                  <CardContent className="p-8 lg:p-12">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline">{upcomingEvents[0].category}</Badge>
                      <div className="flex items-center text-primary text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(upcomingEvents[0].eventDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">{upcomingEvents[0].title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {upcomingEvents[0].description}
                    </p>
                    <div className="space-y-2 mb-6">
                      {upcomingEvents[0].location && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          {upcomingEvents[0].location}
                        </div>
                      )}
                      {upcomingEvents[0].time && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          {upcomingEvents[0].time}
                        </div>
                      )}
                      {upcomingEvents[0].maxParticipants && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          Max {upcomingEvents[0].maxParticipants} participants
                        </div>
                      )}
                    </div>
                    <Button className="hover-lift" data-testid={`register-${upcomingEvents[0].id}`}>
                      {upcomingEvents[0].registrationRequired ? 'Register Now' : 'Learn More'}
                    </Button>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Other Upcoming Events */}
            {upcomingEvents.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.slice(1).map((event) => (
                  <Card key={event.id} className="hover-lift" data-testid={`event-card-${event.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline">{event.category}</Badge>
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
                      
                      <div className="space-y-2 mb-4">
                        {event.location && (
                          <div className="flex items-center text-muted-foreground text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        )}
                        {event.time && (
                          <div className="flex items-center text-muted-foreground text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        )}
                        {event.registrationRequired && (
                          <div className="flex items-center text-accent text-xs font-medium">
                            <Users className="h-3 w-3 mr-1" />
                            Registration Required
                          </div>
                        )}
                      </div>
                      
                      <Button size="sm" className="w-full" data-testid={`learn-more-${event.id}`}>
                        {event.registrationRequired ? 'Register' : 'Learn More'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">Past Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="hover-lift opacity-75" data-testid={`past-event-${event.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary">{event.category}</Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-muted-foreground">
                          {new Date(event.eventDate).getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{event.title}</h4>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2">
                      {event.location && (
                        <div className="flex items-center text-muted-foreground text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      )}
                      {event.time && (
                        <div className="flex items-center text-muted-foreground text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No events found matching your criteria.'
                : 'No events available at the moment.'
              }
            </div>
            {(searchTerm || selectedCategory !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                data-testid="clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
