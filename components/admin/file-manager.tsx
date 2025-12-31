'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Trash2,
  Upload,
  FileIcon,
  Music,
  Film,
  Image as ImageIcon,
  Loader2,
  MoreVertical,
  Copy,
  Pencil,
  Paperclip,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CustomAudioPlayer } from '@/components/ui/custom-audio-player';
import { CustomVideoPlayer } from '@/components/ui/custom-video-player';

type FileObject = {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size?: number;
    [key: string]: unknown;
  };
};

const BUCKETS = {
  images: 'blog-images',
  audio: 'blog-audio',
  video: 'blog-video',
  file: 'blog-files',
};

export function FileManager({ userRole = 'user' }: { userRole?: 'admin' | 'editor' | 'user' }) {
  const [activeTab, setActiveTab] = useState<keyof typeof BUCKETS>('images');
  const [files, setFiles] = useState<FileObject[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<FileObject | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null); // If null, bulk delete
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'size-desc'>(
    'date-desc'
  );

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    // Supabase list options for sorting are limited (only by column), so we might sort client side or use basic sort
    // Let's use basic 'created_at' desc for initial fetch
    const { data, error } = await supabase.storage.from(BUCKETS[activeTab]).list(undefined, {
      sortBy: { column: 'created_at', order: 'desc' },
      limit: 100,
    });

    if (error) {
      console.error('Error fetching files:', error);
      toast.error('Erro ao carregar arquivos. Verifique se o bucket existe.');
    } else {
      const sortedData = data || [];
      if (sortBy === 'date-desc') {
        sortedData.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (sortBy === 'date-asc') {
        sortedData.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (sortBy === 'name-asc') {
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'size-desc') {
        sortedData.sort(
          (a, b) => ((b.metadata?.size as number) || 0) - ((a.metadata?.size as number) || 0)
        );
      }
      setFiles(sortedData);
    }
    setIsLoading(false);
  }, [activeTab, supabase.storage, sortBy]);

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sortBy]);

  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileName) ? prev.filter(f => f !== fileName) : [...prev, fileName]
    );
  };

  const initDelete = (name?: string) => {
    if (name) {
      setItemToDelete(name);
    } else {
      setItemToDelete(null);
      if (selectedFiles.length === 0) return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    let error;

    if (itemToDelete) {
      // Single delete
      const res = await supabase.storage.from(BUCKETS[activeTab]).remove([itemToDelete]);
      error = res.error;
    } else {
      // Bulk delete
      const res = await supabase.storage.from(BUCKETS[activeTab]).remove(selectedFiles);
      error = res.error;
    }

    if (error) {
      toast.error(`Erro ao excluir: ${error.message}`);
    } else {
      toast.success('Excluído com sucesso');
      if (itemToDelete) {
        setFiles(files.filter(f => f.name !== itemToDelete));
      } else {
        setFiles(files.filter(f => !selectedFiles.includes(f.name)));
        setSelectedFiles([]);
      }
    }
    setDeleteDialogOpen(false);
    setIsLoading(false);
  };

  // ... (handleFileUpload, handleDelete, handleRename, openRenameDialog, copyUrl, getPublicUrl omitted for brevity as they don't need changes except maybe usage of fetchFiles which works since it's captured in closure or updated)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage.from(BUCKETS[activeTab]).upload(fileName, file);

      if (error) {
        toast.error(`Erro ao enviar ${file.name}: ${error.message}`);
      } else {
        successCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} arquivo(s) enviado(s) com sucesso!`);
      fetchFiles();
    }
    setIsUploading(false);
    e.target.value = ''; // Reset input
  };

  const handleRename = async () => {
    if (!fileToRename || !newFileName) return;

    const { error } = await supabase.storage
      .from(BUCKETS[activeTab])
      .move(fileToRename.name, newFileName);

    if (error) {
      toast.error(`Erro ao renomear: ${error.message}`);
    } else {
      toast.success('Arquivo renomeado com sucesso');
      fetchFiles();
      setRenameDialogOpen(false);
    }
  };

  const openRenameDialog = (file: FileObject) => {
    setFileToRename(file);
    setNewFileName(file.name);
    setRenameDialogOpen(true);
  };

  const copyUrl = (fileName: string) => {
    const { data } = supabase.storage.from(BUCKETS[activeTab]).getPublicUrl(fileName);
    navigator.clipboard.writeText(data.publicUrl);
    toast.success('URL copiada para a área de transferência');
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from(BUCKETS[activeTab]).getPublicUrl(fileName);
    return data.publicUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciador de Arquivos</h2>
          <p className="text-muted-foreground">Gerencie seus arquivos de mídia e documentos.</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={value =>
              setSortBy(value as 'date-desc' | 'date-asc' | 'name-asc' | 'size-desc')
            }
          >
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Mais Recentes</SelectItem>
              <SelectItem value="date-asc">Mais Antigos</SelectItem>
              <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
              <SelectItem value="size-desc">Tamanho (Maior)</SelectItem>
            </SelectContent>
          </Select>
          {userRole === 'admin' && selectedFiles.length > 0 && (
            <Button variant="destructive" onClick={() => initDelete()}>
              <Trash2 className="mr-2 h-4 w-4" /> Excluir ({selectedFiles.length})
            </Button>
          )}
          <div className="relative">
            <Button disabled={isUploading} className="cursor-pointer" asChild>
              <label>
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Arquivo
                <Input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  multiple
                  accept={
                    activeTab === 'images'
                      ? 'image/*'
                      : activeTab === 'audio'
                        ? 'audio/*'
                        : activeTab === 'video'
                          ? 'video/*'
                          : activeTab === 'file'
                            ? '*/*'
                            : '*/*'
                  }
                />
              </label>
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="images"
        value={activeTab}
        onValueChange={v => {
          setActiveTab(v as keyof typeof BUCKETS);
          setSelectedFiles([]);
        }}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> Imagens
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music className="h-4 w-4" /> Áudio
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Film className="h-4 w-4" /> Vídeo
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2">
            <FileIcon className="h-4 w-4" /> Arquivos
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Arquivos no bucket: {BUCKETS[activeTab]}</CardTitle>
                <CardDescription>{files.length} arquivo(s) encontrado(s).</CardDescription>
              </div>
              {files.length > 0 && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="selectAll"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={files.length > 0 && selectedFiles.length === files.length}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedFiles(files.map(f => f.name));
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                  />
                  <label htmlFor="selectAll" className="text-sm">
                    Selecionar Todos
                  </label>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12">
                <FileIcon className="mb-4 h-10 w-10 opacity-50" />
                <p>Nenhum arquivo encontrado neste bucket.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {files.map(file => (
                  <div
                    key={file.id}
                    className={`group relative rounded-lg border p-3 transition-all hover:shadow-md ${selectedFiles.includes(file.name) ? 'ring-primary bg-accent/20 ring-2' : ''}`}
                    onClick={e => {
                      // Toggle selection on card click if not clicking interactive elements
                      if (
                        (e.target as HTMLElement).closest('button') ||
                        (e.target as HTMLElement).closest('.dropdown')
                      )
                        return;
                      toggleFileSelection(file.name);
                    }}
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.name)}
                        onChange={() => toggleFileSelection(file.name)}
                        className="h-4 w-4 rounded border-gray-300 shadow-sm"
                        onClick={e => e.stopPropagation()}
                      />
                    </div>

                    <div className="bg-muted/20 relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-md">
                      {activeTab === 'images' ? (
                        <Image
                          src={getPublicUrl(file.name)}
                          alt={file.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : activeTab === 'audio' ? (
                        <div className="w-full p-2">
                          <CustomAudioPlayer src={getPublicUrl(file.name)} className="w-full" />
                        </div>
                      ) : activeTab === 'file' ? (
                        <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-2">
                          <Paperclip className="mb-2 h-10 w-10" />
                        </div>
                      ) : (
                        <div className="h-full w-full">
                          <CustomVideoPlayer
                            src={getPublicUrl(file.name)}
                            className="h-full w-full"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-full truncate text-sm font-medium" title={file.name}>
                        {file.name}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="dropdown h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyUrl(file.name)}>
                            <Copy className="mr-2 h-4 w-4" /> Copiar Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openRenameDialog(file)}>
                            <Pencil className="mr-2 h-4 w-4" /> Renomear
                          </DropdownMenuItem>
                          {userRole === 'admin' && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => initDelete(file.name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {((file.metadata?.size || 0) / 1024 / 1024).toFixed(2)} MB •{' '}
                      {new Date(file.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear Arquivo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRename}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <CardDescription>
              Tem certeza que deseja excluir permanetemente{' '}
              {itemToDelete ? 'o item' : `os ${selectedFiles.length} itens selecionados`}?
              {itemToDelete && (
                <div className="mt-2 font-mono text-sm font-bold">{itemToDelete}</div>
              )}
            </CardDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
