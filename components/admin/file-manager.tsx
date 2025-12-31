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
  FileText,
  Music,
  Film,
  Image as ImageIcon,
  Loader2,
  MoreVertical,
  Copy,
  Pencil,
  Download,
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileObject | null>(null);
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

  const handleDownload = async (file: FileObject) => {
    const url = getPublicUrl(file.name);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const openPreview = (file: FileObject) => {
    setPreviewFile(file);
    setPreviewOpen(true);
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
            ) : activeTab === 'audio' || activeTab === 'file' ? (
              /* LIST VIEW */
              <div className="rounded-md border">
                <div className="bg-muted grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-3 text-sm font-medium">
                  <div className="w-8">
                    <input
                      type="checkbox"
                      checked={files.length > 0 && selectedFiles.length === files.length}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedFiles(files.map(f => f.name));
                        } else {
                          setSelectedFiles([]);
                        }
                      }}
                      className="accent-primary h-4 w-4 rounded border-gray-300"
                      aria-label="Selecionar todos os arquivos"
                    />
                  </div>
                  <div>Nome</div>
                  <div className="hidden sm:block">Tamanho</div>
                  <div className="hidden sm:block">Data</div>
                  <div className="w-10"></div>
                </div>
                <div className="divide-y">
                  {files.map(file => {
                    const isSelected = selectedFiles.includes(file.name);
                    const fileExt = file.name.split('.').pop()?.toLowerCase();
                    let Icon = FileIcon;
                    if (fileExt === 'pdf') Icon = FileText;
                    if (fileExt === 'mp3' || fileExt === 'wav' || fileExt === 'ogg') Icon = Music;

                    return (
                      <div
                        key={file.id}
                        className={`hover:bg-muted/50 grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 p-3 text-sm transition-colors ${isSelected ? 'bg-muted/50' : ''}`}
                        onClick={e => {
                          if (
                            (e.target as HTMLElement).closest('button') ||
                            (e.target as HTMLElement).closest('.dropdown') ||
                            (e.target as HTMLElement).tagName === 'INPUT'
                          )
                            return;
                          openPreview(file);
                        }}
                      >
                        <div className="flex w-8 items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFileSelection(file.name)}
                            className="accent-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                            onClick={e => e.stopPropagation()}
                            aria-label={`Selecionar ${file.name}`}
                          />
                        </div>
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="truncate" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                        <div className="text-muted-foreground hidden sm:block">
                          {((file.metadata?.size || 0) / 1024 / 1024).toFixed(2)} MB
                        </div>
                        <div className="text-muted-foreground hidden sm:block">
                          {new Date(file.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="dropdown h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openPreview(file)}>
                                <FileIcon className="mr-2 h-4 w-4" /> Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(file)}>
                                <Download className="mr-2 h-4 w-4" /> Baixar
                              </DropdownMenuItem>
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
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* GRID VIEW - Updated to be smaller (more columns) */
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {files.map(file => (
                  <div
                    key={file.id}
                    className={`group relative rounded-lg border p-2 transition-all hover:shadow-md ${selectedFiles.includes(file.name) ? 'ring-primary bg-accent/20 ring-2' : ''}`}
                    onClick={e => {
                      if (
                        (e.target as HTMLElement).closest('button') ||
                        (e.target as HTMLElement).closest('.dropdown') ||
                        (e.target as HTMLElement).tagName === 'VIDEO' ||
                        (e.target as HTMLElement).closest('.video-player-controls') // Assuming custom player might have this
                      )
                        return;
                      openPreview(file);
                    }}
                  >
                    <div
                      className="bg-background/80 absolute top-1 left-1 z-20 rounded-br-md p-0.5 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 data-[checked=true]:opacity-100"
                      data-checked={selectedFiles.includes(file.name)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.name)}
                        onChange={() => toggleFileSelection(file.name)}
                        className="accent-primary h-3 w-3 cursor-pointer rounded border-gray-300 shadow-sm"
                        onClick={e => e.stopPropagation()}
                        aria-label={`Selecionar ${file.name}`}
                      />
                    </div>

                    <div className="bg-muted/20 relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-md">
                      {activeTab === 'images' ? (
                        <Image
                          src={getPublicUrl(file.name)}
                          alt={file.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full">
                          <CustomVideoPlayer
                            src={getPublicUrl(file.name)}
                            className="h-full w-full"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="w-full truncate text-xs font-medium" title={file.name}>
                        {file.name}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="dropdown h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openPreview(file)}>
                            <FileIcon className="mr-2 h-4 w-4" /> Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(file)}>
                            <Download className="mr-2 h-4 w-4" /> Baixar
                          </DropdownMenuItem>
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
                    <div className="text-muted-foreground mt-0.5 text-[10px]">
                      {((file.metadata?.size || 0) / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Floating Action Bar */}
      {selectedFiles.length > 0 && userRole === 'admin' && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="bg-popover text-popover-foreground flex items-center gap-4 rounded-xl border p-4 shadow-xl">
            <span className="font-medium">{selectedFiles.length} selecionado(s)</span>
            <div className="bg-border h-4 w-px" />
            <Button variant="destructive" size="sm" onClick={() => initDelete()}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Selecionados
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSelectedFiles([])}
            >
              <Trash2 className="h-4 w-4 rotate-45" />{' '}
              {/* Using Trash as X since X is not imported yet, wait I should use X if I import it or use Trash rotated as hack or just text */}
            </Button>
          </div>
        </div>
      )}

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

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="w-full max-w-4xl overflow-hidden border-none bg-black/95 p-0 text-white">
          <DialogTitle className="sr-only">Visualização do Arquivo</DialogTitle>
          <div className="relative flex max-h-[85vh] min-h-[40vh] flex-col items-center justify-center">
            {previewFile && (
              <div className="flex h-full w-full items-center justify-center p-4">
                {activeTab === 'images' ? (
                  <div className="relative h-full min-h-[50vh] w-full">
                    <Image
                      src={getPublicUrl(previewFile.name)}
                      alt={previewFile.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : activeTab === 'video' ? (
                  <div className="w-full max-w-3xl">
                    <CustomVideoPlayer
                      src={getPublicUrl(previewFile.name)}
                      className="aspect-video w-full"
                    />
                  </div>
                ) : activeTab === 'audio' ? (
                  <div className="w-full max-w-md space-y-4 rounded-xl bg-zinc-900 p-6">
                    <div className="text-center">
                      <Music className="text-primary mx-auto mb-4 h-16 w-16" />
                      <h3 className="mb-6 truncate text-lg font-medium">{previewFile.name}</h3>
                    </div>
                    <CustomAudioPlayer src={getPublicUrl(previewFile.name)} className="w-full" />
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <FileIcon className="mx-auto mb-6 h-24 w-24 text-gray-500" />
                    <h3 className="mb-2 text-xl font-medium">{previewFile.name}</h3>
                    <p className="mb-8 text-gray-400">
                      Este arquivo não pode ser visualizado diretamente.
                    </p>
                    <Button onClick={() => handleDownload(previewFile)} size="lg">
                      <Download className="mr-2 h-5 w-5" /> Baixar Arquivo
                    </Button>
                  </div>
                )}
              </div>
            )}
            {previewFile && (activeTab === 'images' || activeTab === 'video') && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Button
                  variant="secondary"
                  onClick={() => handleDownload(previewFile)}
                  className="border-none bg-white/10 text-white shadow-lg backdrop-blur-sm hover:bg-white/20"
                >
                  <Download className="mr-2 h-4 w-4" /> Baixar Original
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
