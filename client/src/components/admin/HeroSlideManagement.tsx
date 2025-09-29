import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { 
  Plus,
  Edit,
  Trash2,
  Monitor,
  Calendar,
  Newspaper,
  Trophy,
  Handshake,
  Eye,
  EyeOff
} from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'main' | 'events' | 'news' | 'achievement' | 'partnership';
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SlideFormData {
  title: string;
  subtitle: string;
  description: string;
  type: 'main' | 'events' | 'news' | 'achievement' | 'partnership';
  isActive: boolean;
  order: number;
}

const slideTypeIcons = {
  main: Monitor,
  events: Calendar,
  news: Newspaper,
  achievement: Trophy,
  partnership: Handshake,
};

const slideTypeLabels = {
  main: 'Main Highlight',
  events: 'Event Highlight',
  news: 'News Highlight',
  achievement: 'Achievement',
  partnership: 'Partnership',
};

export default function HeroSlideManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState<SlideFormData>({
    title: '',
    subtitle: '',
    description: '',
    type: 'main',
    isActive: true,
    order: 1,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { logout } = useAuth();

  // Helper function to handle authentication errors
  const handleAuthError = (error: any, response?: Response) => {
    console.log('Error details:', { error, response, status: response?.status });
    
    // Only logout on specific authentication failures with exact error messages
    const isAuthError = response?.status === 401 || response?.status === 403;
    const hasAuthMessage = error.message?.includes('Invalid or expired token') || 
                          error.message?.includes('Access token required') ||
                          error.message?.includes('Admin access required');
    
    // Log for debugging
    console.log('Auth error check:', { isAuthError, hasAuthMessage, errorMessage: error.message });
    
    if (isAuthError && hasAuthMessage) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
      logout();
      return true; // Indicate that we handled the auth error
    }
    
    // Don't logout for other types of errors
    return false; // Not an auth error
  };

  // Fetch hero slides
  const { data: slides, isLoading } = useQuery<HeroSlide[]>({
    queryKey: ['/api/hero-slides'],
  });

  // Create slide mutation
  const createSlideMutation = useMutation({
    mutationFn: async (slideData: SlideFormData) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(slideData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Failed to create slide');
        (error as any).response = response;
        throw error;
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-slides'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success!",
        description: `Hero slide "${data.title}" has been created successfully.`,
        variant: "default",
      });
    },
    onError: (error: any) => {
      const wasAuthError = handleAuthError(error, error.response);
      if (!wasAuthError) {
        toast({
          title: "Error",
          description: error.message || "Failed to create hero slide. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Update slide mutation
  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SlideFormData> }) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Failed to update slide');
        (error as any).response = response;
        throw error;
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-slides'] });
      setIsDialogOpen(false);
      resetForm();
      setEditingSlide(null);
      toast({
        title: "Success!",
        description: `Hero slide "${data.title}" has been updated successfully.`,
        variant: "default",
      });
    },
    onError: (error: any) => {
      const wasAuthError = handleAuthError(error, error.response);
      if (!wasAuthError) {
        toast({
          title: "Error",
          description: error.message || "Failed to update hero slide. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Delete slide mutation
  const deleteSlideMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Failed to delete slide');
        (error as any).response = response;
        throw error;
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-slides'] });
      toast({
        title: "Success!",
        description: "Hero slide has been deleted successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      const wasAuthError = handleAuthError(error, error.response);
      if (!wasAuthError) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete hero slide. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Toggle slide active status
  const toggleSlideStatus = (slide: HeroSlide) => {
    updateSlideMutation.mutate({
      id: slide.id,
      data: { isActive: !slide.isActive }
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      type: 'main',
      isActive: true,
      order: slides ? slides.length + 1 : 1,
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingSlide(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      type: slide.type,
      isActive: slide.isActive,
      order: slide.order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    console.log('Is editing?', !!editingSlide);
    
    if (editingSlide) {
      updateSlideMutation.mutate({
        id: editingSlide.id,
        data: formData
      });
    } else {
      createSlideMutation.mutate(formData);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingSlide(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Hero Slide Management</h2>
          <p className="text-muted-foreground">Manage your homepage slideshow content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter slide title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Enter slide subtitle"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter slide description"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Slide Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(slideTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive" className="text-sm">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createSlideMutation.isPending || updateSlideMutation.isPending}
                >
                  {createSlideMutation.isPending || updateSlideMutation.isPending 
                    ? (editingSlide ? 'Updating...' : 'Creating...') 
                    : (editingSlide ? 'Update Slide' : 'Create Slide')
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {slides && slides.length > 0 ? (
          slides.map((slide) => {
            const IconComponent = slideTypeIcons[slide.type];
            return (
              <Card key={slide.id} className={`${!slide.isActive ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="text-primary h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{slide.title}</h3>
                          <Badge variant={slide.type === 'main' ? 'default' : 'secondary'}>
                            {slideTypeLabels[slide.type]}
                          </Badge>
                          {slide.isActive ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Eye className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500 border-gray-500">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-primary font-medium mb-1">{slide.subtitle}</p>
                        <p className="text-muted-foreground text-sm mb-2">{slide.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Order: {slide.order} • Created: {new Date(slide.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSlideStatus(slide)}
                        disabled={updateSlideMutation.isPending}
                      >
                        {slide.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(slide)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSlideMutation.mutate(slide.id)}
                        disabled={deleteSlideMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hero slides found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first hero slide to showcase your department's highlights.
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Slide
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}