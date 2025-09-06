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
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { News, InsertNews } from '@shared/schema';

export default function NewsManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<News | null>(null);
  const [formData, setFormData] = useState<Partial<InsertNews>>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    published: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertNews) => apiRequest('POST', '/api/news', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: 'News article created successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to create news article', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertNews> }) =>
      apiRequest('PUT', `/api/news/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: 'News article updated successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to update news article', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: 'News article deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete news article', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      image: '',
      published: false,
    });
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const newsData: InsertNews = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      image: formData.image || undefined,
      published: formData.published || false,
      publishedAt: formData.published ? new Date().toISOString() : undefined,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: newsData });
    } else {
      createMutation.mutate(newsData);
    }
  };

  const handleEdit = (item: News) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      image: item.image || '',
      published: item.published,
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="news-management-loading">
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
    <div className="space-y-6" data-testid="news-management">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News Management</h2>
        <Button onClick={() => setIsCreating(true)} data-testid="button-create-news">
          <Plus className="mr-2 h-4 w-4" />
          Add News Article
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card data-testid="news-form">
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit News Article' : 'Create News Article'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter article title"
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
                      <SelectItem value="Achievement">Achievement</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Industry">Industry</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
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
                <label className="text-sm font-medium">Excerpt *</label>
                <Textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Enter article excerpt"
                  rows={3}
                  data-testid="textarea-excerpt"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content *</label>
                <Textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter article content"
                  rows={8}
                  data-testid="textarea-content"
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
                  data-testid="button-submit-news"
                >
                  {editingItem ? 'Update Article' : 'Create Article'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-news">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* News List */}
      <Card>
        <CardHeader>
          <CardTitle>All News Articles ({news?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {news && news.length > 0 ? (
            <div className="space-y-4">
              {news.map((article) => (
                <div
                  key={article.id}
                  className="border border-border rounded-lg p-4 flex justify-between items-start"
                  data-testid={`news-item-${article.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{article.title}</h3>
                      <Badge variant={article.published ? 'default' : 'secondary'}>
                        {article.published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{article.excerpt}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(article.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(article)}
                      data-testid={`button-edit-${article.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(article.id)}
                      data-testid={`button-delete-${article.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No news articles found. Create your first article to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
