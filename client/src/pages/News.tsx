import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Search, Calendar } from 'lucide-react';
import { Link } from 'wouter';
import type { News } from '@shared/schema';

export default function News() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['/api/news?published=true'],
  });

  const categories = ['all', 'Achievement', 'Research', 'Industry', 'Academic'];

  const filteredNews = news?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen py-20" data-testid="news-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="w-full h-48" />
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
    <div className="min-h-screen py-20" data-testid="news-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Latest News & Updates</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed about department activities, achievements, and announcements
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search news articles..."
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

        {/* Featured Article */}
        {filteredNews.length > 0 && (
          <Card className="mb-12 overflow-hidden hover-lift" data-testid={`featured-news-${filteredNews[0].id}`}>
            <div className="grid lg:grid-cols-2">
              {filteredNews[0].image && (
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={filteredNews[0].image}
                    alt={filteredNews[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                  </div>
                </div>
              )}
              <CardContent className="p-8 lg:p-12">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="outline">{filteredNews[0].category}</Badge>
                  {filteredNews[0].publishedAt && (
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(filteredNews[0].publishedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">{filteredNews[0].title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                  {filteredNews[0].excerpt}
                </p>
                <Link href={`/news/${filteredNews[0].id}`}>
                  <Button className="hover-lift" data-testid={`read-featured-${filteredNews[0].id}`}>
                    Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>
        )}

        {/* News Grid */}
        {filteredNews.length > 1 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {filteredNews.slice(1).map((article) => (
              <Card key={article.id} className="overflow-hidden hover-lift" data-testid={`news-article-${article.id}`}>
                {article.image && (
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline">{article.category}</Badge>
                    {article.publishedAt && (
                      <span className="text-muted-foreground text-xs">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{article.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  <Link href={`/news/${article.id}`}>
                    <button className="inline-flex items-center text-primary text-sm font-medium hover:text-primary/80" data-testid={`read-more-${article.id}`}>
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No articles found matching your criteria.'
                : 'No news articles available at the moment.'
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
