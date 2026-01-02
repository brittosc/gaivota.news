'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Upload } from 'lucide-react';
import { removeImageMetadata, sanitizeFileName } from '@/lib/file-utils';
import { toast } from 'sonner';
import { createBrowserClient } from '@supabase/ssr';
import { cn } from '@/lib/utils';
import { FileLibrary } from './file-library';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string | string[], options?: { target?: string }) => void;
  type: 'image' | 'youtube' | 'link' | 'audio' | 'gallery' | 'video' | 'file';
  initialUrl?: string; // For editing existing links
}

function CircularProgress({ value, className }: { value: number; className?: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
        <circle
          className="text-muted stroke-current"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className="text-primary stroke-current transition-all duration-300 ease-in-out"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <span className="text-foreground absolute text-xs font-medium">{Math.round(value)}%</span>
    </div>
  );
}

export function MediaUploadModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  initialUrl = '',
}: MediaUploadModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [stripMetadata, setStripMetadata] = useState(true);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  const handleConfirm = () => {
    if (!url) {
      onClose();
      return;
    }
    const options = type === 'link' ? { target: openInNewTab ? '_blank' : '_self' } : undefined;
    onConfirm(url, options);
    onClose();
    setUrl('');
    setOpenInNewTab(true);
  };

  const resetUploadState = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setCurrentFileIndex(0);
    setTotalFiles(0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (
      type !== 'image' &&
      type !== 'audio' &&
      type !== 'gallery' &&
      type !== 'video' &&
      type !== 'file'
    ) {
      toast.error('O upload é suportado apenas para imagens, áudio, vídeo e arquivos no momento.');
      return;
    }

    setIsUploading(true);
    setTotalFiles(files.length);
    setCurrentFileIndex(0);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      let bucketName = 'blog-images';
      if (type === 'audio') bucketName = 'blog-audio';
      if (type === 'video') bucketName = 'blog-video';
      if (type === 'file') bucketName = 'blog-files';

      for (let i = 0; i < files.length; i++) {
        setCurrentFileIndex(i + 1);
        setUploadProgress(10); // Start progress for this file

        let file = files[i];

        // Metadata stripping for images
        if (type === 'image' && stripMetadata) {
          try {
            file = await removeImageMetadata(file);
          } catch (e) {
            console.error('Failed to strip metadata', e);
          }
        }

        const fileExt = file.name.split('.').pop();
        const safeName = sanitizeFileName(file.name.replace(`.${fileExt}`, ''));
        const fileName = `${Date.now()}-${safeName}.${fileExt}`;
        const filePath = `${fileName}`;

        // Simulated progress update for better UX since Supabase doesn't give granular progress
        const interval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        clearInterval(interval);
        setUploadProgress(100);

        if (uploadError) {
          console.error(`Error uploading file ${file.name} to ${bucketName}:`, uploadError);

          if (uploadError.message.includes('exceeded the maximum allowed size')) {
            toast.error(
              `Erro: O arquivo ${file.name} é muito grande. Aumente o limite do bucket no Supabase.`
            );
          } else {
            toast.error(`Erro ao enviar ${file.name}: ${uploadError.message}`);
          }
          continue;
        }

        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);

        // Small delay to show 100% completion before next file
        await new Promise(resolve => setTimeout(resolve, 300));
        setUploadProgress(0); // Reset for next file
      }

      if (uploadedUrls.length > 0) {
        toast.success(`${uploadedUrls.length} arquivo(s) enviado(s) com sucesso!`);

        if (type === 'gallery') {
          onConfirm(uploadedUrls);
        } else if (uploadedUrls.length === 1) {
          setUrl(uploadedUrls[0]);
          onConfirm(uploadedUrls[0]);
        } else {
          onConfirm(uploadedUrls);
        }
        onClose();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Error uploading files:', error);
      toast.error('Erro ao enviar arquivos: ' + errorMessage);
    } finally {
      resetUploadState();
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'image':
        return 'Insert Image';
      case 'gallery':
        return 'Insert Gallery';
      case 'youtube':
        return 'Insert YouTube Video';
      case 'audio':
        return 'Insert Audio';
      case 'video':
        return 'Insert Video (Upload)';
      case 'file':
        return 'Anexar Arquivo';
      case 'link':
        return 'Insert Link';
    }
  };

  const getAcceptType = () => {
    switch (type) {
      case 'image':
      case 'gallery':
        return 'image/*';
      case 'audio':
        return 'audio/*';
      case 'video':
        return 'video/*';
      default:
        // For file type or others
        return '*/*';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!isUploading) onClose(); // Prevent closing while uploading
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription className="hidden">
            Dialog for uploading or selecting media.
          </DialogDescription>
        </DialogHeader>

        {type === 'image' ||
        type === 'audio' ||
        type === 'gallery' ||
        type === 'video' ||
        type === 'file' ? (
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="library">Library</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4 py-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="picture">
                  {type === 'audio'
                    ? 'Áudio'
                    : type === 'video'
                      ? 'Vídeo'
                      : type === 'file'
                        ? 'Arquivo'
                        : 'Imagens'}
                </Label>

                {isUploading ? (
                  <div className="bg-muted/10 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8">
                    <CircularProgress value={uploadProgress} className="mb-4 h-20 w-20" />
                    <div className="space-y-1 text-center">
                      <p className="text-lg font-semibold">Enviando...</p>
                      <p className="text-muted-foreground text-sm">
                        Arquivo {currentFileIndex} de {totalFiles}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`hover:bg-muted/20 border-muted-foreground/25 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors`}
                    onDragOver={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isUploading) return;

                      const droppedFiles = e.dataTransfer.files;
                      if (!droppedFiles || droppedFiles.length === 0) return;

                      // Basic validation
                      const validFiles: File[] = [];

                      for (let i = 0; i < droppedFiles.length; i++) {
                        const file = droppedFiles[i];
                        if (
                          (type === 'image' || type === 'gallery') &&
                          !file.type.startsWith('image/')
                        ) {
                          toast.error(`Ignorado: ${file.name} (não é imagem)`);
                          continue;
                        }
                        if (type === 'audio' && !file.type.startsWith('audio/')) {
                          toast.error(`Ignorado: ${file.name} (não é áudio)`);
                          continue;
                        }
                        if (type === 'video' && !file.type.startsWith('video/')) {
                          toast.error(`Ignorado: ${file.name} (não é vídeo)`);
                          continue;
                        }
                        // File type accepts everything, no check needed
                        validFiles.push(file);
                      }

                      if (validFiles.length > 0) {
                        const dataTransfer = new DataTransfer();
                        validFiles.forEach(file => dataTransfer.items.add(file));
                        const fakeEvent = {
                          target: { files: dataTransfer.files },
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        handleFileUpload(fakeEvent);
                      }
                    }}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload className="text-muted-foreground h-8 w-8" />
                      <div className="text-muted-foreground text-sm">
                        <span className="text-primary font-semibold">Clique para enviar</span> ou
                        arraste e solte
                        <br />
                        {type === 'audio' ? 'áudios' : type === 'video' ? 'vídeos' : 'imagens'} aqui
                      </div>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      accept={getAcceptType()}
                      multiple={type === 'image' || type === 'gallery' || type === 'file'}
                    />
                  </div>
                )}

                {type === 'image' && (
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <input
                      type="checkbox"
                      id="stripMeta"
                      checked={stripMetadata}
                      onChange={e => setStripMetadata(e.target.checked)}
                      className="border-input h-4 w-4 rounded"
                    />
                    <label
                      htmlFor="stripMeta"
                      className="text-muted-foreground text-sm select-none"
                    >
                      Remover metadados (Privacidade)
                    </label>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="library" className="space-y-4 py-4">
              <FileLibrary
                type={type as 'image' | 'gallery' | 'audio' | 'video' | 'file'}
                onSelect={url => {
                  if (type === 'gallery') {
                    // For library selection in gallery mode, maybe we just append to a list?
                    // For now, let's treat select as "Add this one".
                    // If user wants multiple, they probably should use a specialized gallery manager, but here we can just confirm immediately.
                    onConfirm([url]);
                  } else {
                    onConfirm(url);
                  }
                  onClose();
                }}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4 py-4">
            {/* Link/Youtube input form remains same */}
            <div className="space-y-2">
              <Label htmlFor="url">{type === 'youtube' ? 'YouTube URL' : 'Link URL'}</Label>
              <Input
                id="url"
                placeholder={
                  type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://example.com'
                }
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </div>
            {type === 'link' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="openInNewTab"
                  className="text-primary focus:ring-primary border-input h-4 w-4 rounded"
                  checked={openInNewTab}
                  onChange={e => setOpenInNewTab(e.target.checked)}
                />
                <label htmlFor="openInNewTab" className="cursor-pointer text-sm">
                  Open in new tab
                </label>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          {!isUploading &&
            type !== 'image' &&
            type !== 'audio' &&
            type !== 'video' &&
            type !== 'gallery' &&
            type !== 'file' && <Button onClick={handleConfirm}>Insert</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
