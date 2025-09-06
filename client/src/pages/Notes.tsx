import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, Search, Filter } from 'lucide-react';
import type { Note } from '@shared/schema';

export default function Notes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ['/api/notes', { published: true }],
  });

  const semesters = ['all', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  
  // Extract unique subjects from notes
  const subjects = notes ? ['all', ...Array.from(new Set(notes.map(note => note.subject)))] : ['all'];

  const filteredNotes = notes?.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.description && note.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSemester = selectedSemester === 'all' || note.semester === selectedSemester;
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSemester && matchesSubject;
  }) || [];

  const getFileIcon = (fileType?: string | null) => {
    // You could extend this to show different icons based on file type
    return FileText;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20" data-testid="notes-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20" data-testid="notes-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Study Materials</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access lecture notes, assignments, and study resources for all semesters
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-12">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search notes, subjects, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg py-3"
              data-testid="search-input"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                <Filter className="inline h-4 w-4 mr-1" />
                Semester
              </label>
              <div className="flex gap-2 flex-wrap">
                {semesters.map((semester) => (
                  <Button
                    key={semester}
                    variant={selectedSemester === semester ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSemester(semester)}
                    data-testid={`semester-filter-${semester.toLowerCase().replace(' ', '-')}`}
                  >
                    {semester === 'all' ? 'All Semesters' : semester}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Subject
              </label>
              <div className="flex gap-2 flex-wrap">
                {subjects.slice(0, 6).map((subject) => (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject(subject)}
                    data-testid={`subject-filter-${subject.toLowerCase().replace(' ', '-')}`}
                  >
                    {subject === 'all' ? 'All Subjects' : subject}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Showing {filteredNotes.length} {filteredNotes.length === 1 ? 'result' : 'results'}
            {(searchTerm || selectedSemester !== 'all' || selectedSubject !== 'all') && (
              <Button
                variant="link"
                size="sm"
                onClick={() => { setSearchTerm(''); setSelectedSemester('all'); setSelectedSubject('all'); }}
                className="ml-2 p-0 h-auto"
                data-testid="clear-filters"
              >
                Clear all filters
              </Button>
            )}
          </p>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
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
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2">{note.title}</h3>
                    <p className="text-accent text-sm font-medium mb-2">{note.subject}</p>
                    
                    {note.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{note.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div>
                        <span>File: {note.fileName}</span>
                        {note.fileSize && <span className="ml-2">• {note.fileSize}</span>}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full hover-lift" 
                      onClick={() => window.open(note.fileUrl, '_blank')}
                      data-testid={`download-${note.id}`}
                    >
                      <Download className="mr-2 h-4 w-4" /> 
                      Download
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm || selectedSemester !== 'all' || selectedSubject !== 'all' 
                ? 'No study materials found'
                : 'No study materials available'
              }
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedSemester !== 'all' || selectedSubject !== 'all'
                ? 'Try adjusting your search criteria or clear the filters.'
                : 'Study materials will be available here once uploaded by faculty.'
              }
            </p>
            {(searchTerm || selectedSemester !== 'all' || selectedSubject !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => { setSearchTerm(''); setSelectedSemester('all'); setSelectedSubject('all'); }}
                data-testid="clear-all-filters"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
