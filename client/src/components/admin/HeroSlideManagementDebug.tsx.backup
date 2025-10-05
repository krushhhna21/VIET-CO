import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Plus, Monitor } from 'lucide-react';

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

const HeroSlideManagementDebug: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { logout } = useAuth();

  // Fetch hero slides
  const { data: slides, isLoading, error } = useQuery<HeroSlide[]>({
    queryKey: ['/api/hero-slides'],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Debug logging
  console.log('HeroSlideManagementDebug:', { 
    slides, 
    isLoading, 
    error, 
    slidesLength: slides?.length 
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Hero Slide Management (Debug)</h2>
        <p className="text-muted-foreground">Loading hero slides...</p>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Hero Slide Management (Debug)</h2>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Hero Slides</h3>
          <p className="text-destructive/80">{error?.message || 'Unknown error occurred'}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const openSimpleDialog = () => {
    console.log('Opening simple dialog...');
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Hero Slide Management (Debug)</h2>
          <p className="text-muted-foreground">Simplified version for debugging</p>
        </div>
        
        {/* Simple button without Dialog component */}
        <Button onClick={openSimpleDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Slide (Debug)
        </Button>
      </div>

      {/* Simple dialog state indicator */}
      {isDialogOpen && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Debug Dialog Open</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a simple dialog replacement for debugging.</p>
            <Button onClick={() => setIsDialogOpen(false)} className="mt-4">
              Close
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {slides && slides.length > 0 ? (
          slides.map((slide) => (
            <Card key={slide.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Monitor className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{slide.title}</h3>
                      <p className="text-primary font-medium mb-1">{slide.subtitle}</p>
                      <p className="text-muted-foreground text-sm mb-2">{slide.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Order: {slide.order} • Created: {new Date(slide.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hero slides found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first hero slide to showcase your department's highlights.
              </p>
              <Button onClick={openSimpleDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Slide (Debug)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HeroSlideManagementDebug;