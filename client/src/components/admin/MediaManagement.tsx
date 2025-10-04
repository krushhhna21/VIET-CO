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
import { Plus, Edit, Trash2, Image, Video } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Media, InsertMedia } from '@shared/schema';

export default function MediaManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<Media | null>(null);
  const [formData, setFormData] = useState<Partial<InsertMedia>>({
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image',
    category: '',
    alt: '',
    published: true, // Default to published
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertMedia) => apiRequest('POST', '/api/media', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({ title: 'Media item uploaded successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to upload media item', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertMedia> }) =>
      apiRequest('PUT', `/api/media/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({ title: 'Media item updated successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to update media item', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({ title: 'Media item deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete media item', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      mediaUrl: '',
      mediaType: 'image',
      category: '',
      alt: '',
      published: false,
    });
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validCategories = ["Events", "Workshops", "Campus Life", "Awards", "Faculty"];
    if (!formData.title || !formData.mediaUrl || !formData.mediaType || !formData.category || !validCategories.includes(formData.category)) {
      toast({ title: 'Please fill in all required fields and select a valid category', variant: 'destructive' });
      return;
    }

    const mediaData: InsertMedia = {
      title: formData.title,
      description: formData.description || undefined,
      mediaUrl: formData.mediaUrl,
      mediaType: formData.mediaType,
      category: formData.category,
      alt: formData.alt || undefined,
      uploadedBy: undefined, // This should be set by the backend
      published: formData.published || false,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: mediaData });
    } else {
      createMutation.mutate(mediaData);
    }
  };

  const handleEdit = (item: Media) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      category: item.category,
      alt: item.alt || '',
      published: item.published,
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="media-management-loading">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="media-management">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Management</h2>
        <Button onClick={() => setIsCreating(true)} data-testid="button-create-media">
          <Plus className="mr-2 h-4 w-4" />
          Add Media
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card data-testid="media-form">
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Media Item' : 'Add Media Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter media title"
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Media Type *</label>
                  <Select
                    value={formData.mediaType || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, mediaType: value as 'image' | 'video' }))}
                  >
                    <SelectTrigger data-testid="select-media-type">
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Workshops">Workshops</SelectItem>
                      <SelectItem value="Campus Life">Campus Life</SelectItem>
                      <SelectItem value="Awards">Awards</SelectItem>
                      <SelectItem value="Faculty">Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Alt Text</label>
                  <Input
                    value={formData.alt || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="Enter alt text for accessibility"
                    data-testid="input-alt"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Media URL *</label>
                <Input
                  value={formData.mediaUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, mediaUrl: e.target.value }))}
                  placeholder="Enter media URL"
                  data-testid="input-media-url"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter media description"
                  rows={3}
                  data-testid="textarea-description"
                />
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

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-media"
                >
                  {editingItem ? 'Update Media' : 'Add Media'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-media">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Media Items ({media?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {media && media.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg overflow-hidden"
                  data-testid={`media-item-${item.id}`}
                >
                  <div className="relative aspect-video">
                    {item.mediaType === 'image' ? (
                      <img
                        src={item.mediaUrl}
                        alt={item.alt || item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <Badge variant={item.published ? 'default' : 'secondary'}>
                        {item.published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="outline">{item.mediaType}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{item.category}</p>
                    {item.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        data-testid={`button-edit-${item.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(item.id)}
                        data-testid={`button-delete-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No media items found. Upload your first media item to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
