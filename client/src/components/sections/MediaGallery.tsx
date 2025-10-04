import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { Media } from "@shared/schema";

const MediaGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { data: media, isLoading } = useQuery<Media[]>({
    queryKey:
      selectedCategory === "all"
        ? ['/api/media?published=true']
        : [`/api/media?category=${encodeURIComponent(selectedCategory)}&published=true`],
  });

  // Debug: log media data and selected category to verify what is being received and filtered
  React.useEffect(() => {
    console.log('Media data:', media);
    console.log('Selected category:', selectedCategory);
  }, [media, selectedCategory]);
  
  const categories = ["all", "Events", "Workshops", "Campus Life", "Awards"];

  if (isLoading) {
    return (
      <section className="py-20 bg-background" data-testid="media-gallery-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-72 mx-auto" />
          </div>
          <div className="flex justify-center gap-4 mb-12">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="w-full h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="media" className="py-20 bg-background" data-testid="media-gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Media Gallery</h2>
          <p className="text-muted-foreground">Capturing moments from events, workshops, and activities</p>
        </div>
        
        {/* Gallery Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
              data-testid={`category-filter-${category.toLowerCase()}`}
            >
              {category === "all" ? "All" : category}
            </Button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        {media && media.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                className="relative group rounded-xl overflow-hidden shadow-sm hover-lift cursor-pointer"
                data-testid={`media-item-${item.id}`}
              >
                <img 
                  src={item.mediaUrl} 
                  alt={item.alt || item.title}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-white/90">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedCategory === "all" 
                ? "No media items available at the moment." 
                : `No media items available in ${selectedCategory} category.`}
            </p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/media">
            <Button className="hover-lift" data-testid="view-full-gallery">
              View Full Gallery
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default React.memo(MediaGallery);
