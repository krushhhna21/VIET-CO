import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, FileImage, Code } from "lucide-react";
import { Link } from "wouter";
import type { Note } from "@shared/schema";
import React from "react";

export default function NotesSection() {
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey:
      selectedSemester === "all"
        ? ['/api/notes?published=true']
        : [`/api/notes?semester=${encodeURIComponent(selectedSemester)}&published=true`],
  });

  // Debug: log notes data and selected semester to verify what is being received and filtered
  React.useEffect(() => {
    console.log('Notes data:', notes);
    console.log('Selected semester:', selectedSemester);
  }, [notes, selectedSemester]);

  const semesters = ["all", "Semester 1", "Semester 2", "Semester 3", "Semester 4"];

  const getFileIcon = (fileType?: string | null) => {
    if (!fileType) return FileText;
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('image')) return FileImage;
    if (fileType.includes('code')) return Code;
    return FileText;
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-muted" data-testid="notes-section-loading">
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
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 mb-4" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="notes" className="py-20 bg-muted" data-testid="notes-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Study Materials</h2>
          <p className="text-muted-foreground">Access lecture notes, assignments, and resources</p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {semesters.map((semester) => (
            <Button
              key={semester}
              variant={selectedSemester === semester ? "default" : "outline"}
              onClick={() => setSelectedSemester(semester)}
              className="rounded-full"
              data-testid={`semester-filter-${semester.toLowerCase().replace(' ', '-')}`}
            >
              {semester === "all" ? "All" : semester}
            </Button>
          ))}
        </div>
        
        {/* Notes Grid */}
        {notes && notes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.slice(0, 6).map((note) => {
              const FileIcon = getFileIcon(note.fileType);
              return (
                <Card key={note.id} className="hover-lift" data-testid={`note-card-${note.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileIcon className="text-primary h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {note.semester}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{note.title}</h4>
                    {note.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{note.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {note.fileSize && <span>{note.fileSize}</span>}
                        {note.subject && <span> • {note.subject}</span>}
                      </div>
                      <Button size="sm" className="hover-lift" data-testid={`download-${note.id}`}>
                        <Download className="mr-1 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedSemester === "all" 
                ? "No study materials available at the moment." 
                : `No study materials available for ${selectedSemester}.`}
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/notes">
            <Button className="hover-lift" data-testid="view-all-notes">
              View All Notes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
