import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Play, Image as ImageIcon } from 'lucide-react';
import type { Media } from '@shared/schema';

export default function Media() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');

  const { data: media, isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media', { published: true }],
  });

  const categories = ['all', 'Events', 'Workshops', 'Campus Life', 'Awards', 'Faculty'];
  const mediaTypes = ['all', 'image', 'video'];

  const filteredMedia = media?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedMediaType === 'all' || item.mediaType === selectedMediaType;
    return matchesSearch && matchesCategory && matchesType;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20" data-testid="media-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="flex justify-center gap-4 mb-12">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="w-full h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20" data-testid="media-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Media Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Capturing moments from events, workshops, and campus activities
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-6 mb-12">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Categories</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                  data-testid={`category-filter-${category.toLowerCase()}`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </Button>
              ))}
            </div>
          </div>

          {/* Media Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Media Type</h3>
            <div className="flex justify-center gap-2">
              {mediaTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedMediaType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMediaType(type)}
                  className="rounded-full"
                  data-testid={`type-filter-${type}`}
                >
                  {type === 'all' ? 'All Media' : type === 'image' ? 'Images' : 'Videos'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8 text-center">
          <p className="text-muted-foreground">
            Showing {filteredMedia.length} {filteredMedia.length === 1 ? 'item' : 'items'}
            {(searchTerm || selectedCategory !== 'all' || selectedMediaType !== 'all') && (
              <Button
                variant="link"
                size="sm"
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedMediaType('all'); }}
                className="ml-2 p-0 h-auto"
                data-testid="clear-filters"
              >
                Clear all filters
              </Button>
            )}
          </p>
        </div>

        {/* Media Grid */}
        {filteredMedia.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <div 
                key={item.id} 
                className="relative group rounded-xl overflow-hidden shadow-sm hover-lift cursor-pointer bg-card"
                data-testid={`media-item-${item.id}`}
              >
                <div className="relative aspect-square">
                  {item.mediaType === 'image' ? (
                    <img 
                      src={item.mediaUrl} 
                      alt={item.alt || item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                  ) : (
                    <div 
                      className="w-full h-full bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${item.mediaUrl})` }}
                    >
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Media Type Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/50 text-white border-0">
                      {item.mediaType === 'image' ? (
                        <ImageIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <Play className="h-3 w-3 mr-1" />
                      )}
                      {item.mediaType}
                    </Badge>
                  </div>
                </div>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                        {item.category}
                      </Badge>
                      <button 
                        className="text-white/80 hover:text-white text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Open lightbox or full view
                          window.open(item.mediaUrl, '_blank');
                        }}
                        data-testid={`view-${item.id}`}
                      >
                        View Full Size
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm || selectedCategory !== 'all' || selectedMediaType !== 'all' 
                ? 'No media found'
                : 'No media available'
              }
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'all' || selectedMediaType !== 'all'
                ? 'Try adjusting your search criteria or clear the filters to see all available media.'
                : 'Media content will appear here once uploaded by faculty and administrators.'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all' || selectedMediaType !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedMediaType('all'); }}
                data-testid="clear-all-filters"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Statistics */}
        {filteredMedia.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {media?.filter(item => item.mediaType === 'image').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Images</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {media?.filter(item => item.mediaType === 'video').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Videos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {media?.filter(item => item.category === 'Events').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {media?.filter(item => item.category === 'Awards').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Awards</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
