import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { News } from "@shared/schema";

export default function LatestNews() {
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['/api/news', { published: true }],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-muted" data-testid="latest-news-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-20 bg-muted" data-testid="latest-news">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Latest News & Updates</h2>
          <p className="text-muted-foreground">Stay informed about department activities and achievements</p>
        </div>
        
        {news && news.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {news.slice(0, 3).map((article) => (
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
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    {article.publishedAt && (
                      <span className="text-muted-foreground text-xs">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{article.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  <Link href={`/news/${article.id}`}>
                    <button className="inline-flex items-center text-primary text-sm font-medium hover:text-primary/80" data-testid={`read-more-${article.id}`}>
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No news articles available at the moment.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/news">
            <Button className="hover-lift" data-testid="view-all-news">
              View All News
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
