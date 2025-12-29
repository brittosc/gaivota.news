'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { createBrowserClient } from '@supabase/ssr';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void;
  type: 'image' | 'youtube' | 'link';
  initialUrl?: string; // For editing existing links
}

export function MediaUploadModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  initialUrl = '',
}: MediaUploadModalProps) {
  const [url, setUrl] = useState(initialUrl);
  // Placeholder for file upload logic
  const [isUploading, setIsUploading] = useState(false);

  const handleConfirm = () => {
    if (!url) {
      onClose(); // Treat empty as cancel/remove
      return;
    }
    onConfirm(url);
    onClose();
    setUrl(''); // Reset
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type !== 'image') {
      toast.error('O upload é suportado apenas para imagens no momento.');
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);

      setUrl(data.publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem: ' + errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'image':
        return 'Insert Image';
      case 'youtube':
        return 'Insert YouTube Video';
      case 'link':
        return 'Insert Link';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        {type === 'image' ? (
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="picture">Imagem</Label>
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isUploading
                    ? 'bg-muted/50 cursor-not-allowed'
                    : 'hover:bg-muted/20 border-muted-foreground/25 cursor-pointer'
                }`}
                onDragOver={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isUploading) return;

                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    // Manually trigger the file input handler logic
                    // Since handleFileUpload expects a ChangeEvent, we create a specialized handler or adapt it.
                    // Easier to just adapting the existing handler or creating a new one.
                    // Let's call the logic directly.
                    const fakeEvent = {
                      target: { files: [file] },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleFileUpload(fakeEvent);
                  } else if (file) {
                    toast.error('Por favor, solte apenas arquivos de imagem.');
                  }
                }}
                onClick={() => document.getElementById('picture')?.click()}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="text-muted-foreground h-8 w-8" />
                  <div className="text-muted-foreground text-sm">
                    <span className="text-primary font-semibold">Clique para enviar</span> ou
                    arraste e solte
                    <br />
                    uma imagem aqui
                  </div>
                </div>
                <Input
                  id="picture"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  accept="image/*"
                />
              </div>
              {isUploading && (
                <p className="text-muted-foreground text-center text-sm">Enviando imagem...</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
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
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isUploading}>
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
