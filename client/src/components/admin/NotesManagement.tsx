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
import { Plus, Edit, Trash2, FileText, Download } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Note, InsertNote } from '@shared/schema';

export default function NotesManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<Note | null>(null);
  const [formData, setFormData] = useState<Partial<InsertNote>>({
    title: '',
    description: '',
    subject: '',
    semester: '',
    fileUrl: '',
    fileName: '',
    fileSize: '',
    fileType: '',
    published: true, // Default to published
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ['/api/notes'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertNote) => apiRequest('POST', '/api/notes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      toast({ title: 'Study material uploaded successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to upload study material', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertNote> }) =>
      apiRequest('PUT', `/api/notes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      toast({ title: 'Study material updated successfully' });
      resetForm();
    },
    onError: () => {
      toast({ title: 'Failed to update study material', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      toast({ title: 'Study material deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete study material', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      semester: '',
      fileUrl: '',
      fileName: '',
      fileSize: '',
      fileType: '',
      published: false,
    });
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validSemesters = [
      "Semester 1", "Semester 2", "Semester 3", "Semester 4",
      "Semester 5", "Semester 6", "Semester 7", "Semester 8"
    ];
    if (!formData.title || !formData.subject || !formData.semester || !formData.fileUrl || !formData.fileName || !validSemesters.includes(formData.semester)) {
      toast({ title: 'Please fill in all required fields and select a valid semester', variant: 'destructive' });
      return;
    }

    const noteData: InsertNote = {
      title: formData.title,
      description: formData.description || undefined,
      subject: formData.subject,
      semester: formData.semester,
      fileUrl: formData.fileUrl,
      fileName: formData.fileName,
      fileSize: formData.fileSize || undefined,
      fileType: formData.fileType || undefined,
      uploadedBy: undefined, // This should be set by the backend
      published: formData.published || false,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: noteData });
    } else {
      createMutation.mutate(noteData);
    }
  };

  const handleEdit = (item: Note) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      subject: item.subject,
      semester: item.semester,
      fileUrl: item.fileUrl,
      fileName: item.fileName,
      fileSize: item.fileSize || '',
      fileType: item.fileType || '',
      published: item.published,
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="notes-management-loading">
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
    <div className="space-y-6" data-testid="notes-management">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Materials Management</h2>
        <Button onClick={() => setIsCreating(true)} data-testid="button-create-note">
          <Plus className="mr-2 h-4 w-4" />
          Add Study Material
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card data-testid="note-form">
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Study Material' : 'Add Study Material'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter material title"
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject *</label>
                  <Input
                    value={formData.subject || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter subject name"
                    data-testid="input-subject"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Semester *</label>
                  <Select
                    value={formData.semester || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
                  >
                    <SelectTrigger data-testid="select-semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semester 1">Semester 1</SelectItem>
                      <SelectItem value="Semester 2">Semester 2</SelectItem>
                      <SelectItem value="Semester 3">Semester 3</SelectItem>
                      <SelectItem value="Semester 4">Semester 4</SelectItem>
                      <SelectItem value="Semester 5">Semester 5</SelectItem>
                      <SelectItem value="Semester 6">Semester 6</SelectItem>
                      <SelectItem value="Semester 7">Semester 7</SelectItem>
                      <SelectItem value="Semester 8">Semester 8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">File Type</label>
                  <Select
                    value={formData.fileType || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fileType: value }))}
                  >
                    <SelectTrigger data-testid="select-file-type">
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="application/pdf">PDF</SelectItem>
                      <SelectItem value="application/vnd.ms-powerpoint">PowerPoint</SelectItem>
                      <SelectItem value="application/msword">Word Document</SelectItem>
                      <SelectItem value="text/plain">Text File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">File Name *</label>
                  <Input
                    value={formData.fileName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileName: e.target.value }))}
                    placeholder="Enter file name"
                    data-testid="input-file-name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">File Size</label>
                  <Input
                    value={formData.fileSize || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileSize: e.target.value }))}
                    placeholder="e.g., 2.3 MB"
                    data-testid="input-file-size"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">File URL *</label>
                <Input
                  value={formData.fileUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
                  placeholder="Enter file download URL"
                  data-testid="input-file-url"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter material description"
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
                  data-testid="button-submit-note"
                >
                  {editingItem ? 'Update Material' : 'Add Material'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-note">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle>All Study Materials ({notes?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {notes && notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="border border-border rounded-lg p-4 flex justify-between items-start"
                  data-testid={`note-item-${note.id}`}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="text-primary h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{note.title}</h3>
                        <Badge variant={note.published ? 'default' : 'secondary'}>
                          {note.published ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="outline">{note.semester}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        Subject: {note.subject}
                        {note.description && ` • ${note.description}`}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <span>File: {note.fileName}</span>
                        {note.fileSize && <span> • Size: {note.fileSize}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(note.fileUrl, '_blank')}
                      data-testid={`button-download-${note.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(note)}
                      data-testid={`button-edit-${note.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(note.id)}
                      data-testid={`button-delete-${note.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No study materials found. Upload your first material to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
