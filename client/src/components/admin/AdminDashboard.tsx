import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Newspaper, 
  Calendar, 
  BookOpen, 
  Camera, 
  Users, 
  Mail,
  Plus,
  BarChart3
} from 'lucide-react';
import NewsManagement from './NewsManagement';
import EventManagement from './EventManagement';
import NotesManagement from './NotesManagement';
import MediaManagement from './MediaManagement';

interface DashboardStats {
  newsCount: number;
  eventsCount: number;
  notesCount: number;
  mediaCount: number;
  contactsCount: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard statistics
  const { data: newsData } = useQuery({ queryKey: ['/api/news'] });
  const { data: eventsData } = useQuery({ queryKey: ['/api/events'] });
  const { data: notesData } = useQuery({ queryKey: ['/api/notes'] });
  const { data: mediaData } = useQuery({ queryKey: ['/api/media'] });
  const { data: contactsData } = useQuery({ queryKey: ['/api/contacts'] });

  const stats: DashboardStats = {
    newsCount: newsData?.length || 0,
    eventsCount: eventsData?.length || 0,
    notesCount: notesData?.length || 0,
    mediaCount: mediaData?.length || 0,
    contactsCount: contactsData?.length || 0,
  };

  const quickActions = [
    {
      label: 'Add News Article',
      icon: Plus,
      action: () => setActiveTab('news'),
      color: 'bg-primary text-primary-foreground',
    },
    {
      label: 'Create Event',
      icon: Calendar,
      action: () => setActiveTab('events'),
      color: 'bg-accent text-accent-foreground',
    },
    {
      label: 'Upload Notes',
      icon: BookOpen,
      action: () => setActiveTab('notes'),
      color: 'bg-primary text-primary-foreground',
    },
  ];

  const StatCard = ({ title, value, icon: Icon, description }: {
    title: string;
    value: number;
    icon: any;
    description: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="text-primary h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8" data-testid="admin-dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your department's content and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="news" data-testid="tab-news">News</TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
          <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
          <TabsTrigger value="media" data-testid="tab-media">Media</TabsTrigger>
          <TabsTrigger value="contacts" data-testid="tab-contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Statistics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="News Articles"
              value={stats.newsCount}
              icon={Newspaper}
              description="Published articles"
            />
            <StatCard
              title="Events"
              value={stats.eventsCount}
              icon={Calendar}
              description="Upcoming events"
            />
            <StatCard
              title="Study Materials"
              value={stats.notesCount}
              icon={BookOpen}
              description="Available notes"
            />
            <StatCard
              title="Media Items"
              value={stats.mediaCount}
              icon={Camera}
              description="Gallery items"
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} p-6 h-auto flex flex-col items-center space-y-2`}
                    data-testid={`quick-action-${index}`}
                  >
                    <action.icon className="h-6 w-6" />
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity - Placeholder for future implementation */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Dashboard accessed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Content management system initialized</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <NewsManagement />
        </TabsContent>

        <TabsContent value="events">
          <EventManagement />
        </TabsContent>

        <TabsContent value="notes">
          <NotesManagement />
        </TabsContent>

        <TabsContent value="media">
          <MediaManagement />
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Contact messages will be displayed here. Total messages: {stats.contactsCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
