import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Event, InsertEvent } from '@shared/schema';

export default function EventManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<InsertEvent>>({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    endDate: '',
    time: '',
    category: '',
    image: '',
    registrationRequired: false,
    maxParticipants: undefined,
    published: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertEvent) => apiRequest('POST', '/api/events', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ title: 'Event created successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to create event', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertEvent> }) =>
      apiRequest('PUT', `/api/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ title: 'Event updated successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to update event', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ title: 'Event deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete event', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      eventDate: '',
      endDate: '',
      time: '',
      category: '',
      image: '',
      registrationRequired: false,
      maxParticipants: undefined,
      published: false,
    });
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.eventDate || !formData.category) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const eventData: InsertEvent = {
      title: formData.title,
      description: formData.description,
      location: formData.location || undefined,
      eventDate: new Date(formData.eventDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      time: formData.time || undefined,
      category: formData.category,
      image: formData.image || undefined,
      registrationRequired: formData.registrationRequired || false,
      maxParticipants: formData.maxParticipants || undefined,
      published: formData.published || false,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: eventData });
    } else {
      createMutation.mutate(eventData);
    }
  };

  const handleEdit = (item: Event) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      location: item.location || '',
      eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
      time: item.time || '',
      category: item.category,
      image: item.image || '',
      registrationRequired: item.registrationRequired,
      maxParticipants: item.maxParticipants || undefined,
      published: item.published,
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="event-management-loading">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="event-management">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Button onClick={() => setIsCreating(true)} data-testid="button-create-event">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card data-testid="event-form">
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Event' : 'Create Event'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Seminar">Seminar</SelectItem>
                      <SelectItem value="Competition">Competition</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Event Date *</label>
                  <Input
                    type="date"
                    value={formData.eventDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                    data-testid="input-event-date"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    data-testid="input-end-date"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    value={formData.time || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    data-testid="input-time"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter event location"
                    data-testid="input-location"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Participants</label>
                  <Input
                    type="number"
                    value={formData.maxParticipants || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || undefined }))}
                    placeholder="Enter maximum participants"
                    data-testid="input-max-participants"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={formData.image || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Enter image URL"
                  data-testid="input-image"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter event description"
                  rows={4}
                  data-testid="textarea-description"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="registrationRequired"
                    checked={formData.registrationRequired || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationRequired: e.target.checked }))}
                    data-testid="checkbox-registration-required"
                  />
                  <label htmlFor="registrationRequired" className="text-sm font-medium">Registration Required</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    data-testid="checkbox-published"
                  />
                  <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-event"
                >
                  {editingItem ? 'Update Event' : 'Create Event'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-event">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>All Events ({events?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border border-border rounded-lg p-4 flex justify-between items-start"
                  data-testid={`event-item-${event.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <Badge variant={event.published ? 'default' : 'secondary'}>
                        {event.published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </span>
                      {event.location && <span>📍 {event.location}</span>}
                      {event.registrationRequired && <span>🎫 Registration Required</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(event)}
                      data-testid={`button-edit-${event.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(event.id)}
                      data-testid={`button-delete-${event.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No events found. Create your first event to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
