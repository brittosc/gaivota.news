'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Supporter {
  id: string;
  name: string;
  avatar_url: string | null;
  link: string | null;
  active: boolean;
}

interface SupporterModalProps {
  supporter?: Supporter;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SupporterModal({ supporter, trigger, open, onOpenChange }: SupporterModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Form state
  const [name, setName] = useState(supporter?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(supporter?.avatar_url || '');
  const [link, setLink] = useState(supporter?.link || '');
  const [active, setActive] = useState(supporter?.active ?? true);
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = !!supporter;
  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('supporters')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('supporters').getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem: ' + errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('supporters')
          .update({
            name,
            avatar_url: avatarUrl,
            link,
            active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', supporter.id);
        if (error) throw error;
        toast.success('Apoiador atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('supporters')
          .insert([{ name, avatar_url: avatarUrl, link, active }]);
        if (error) throw error;
        toast.success('Apoiador criado com sucesso!');
      }

      setOpen(false);
      router.refresh();
      if (!isEditing) {
        setName('');
        setAvatarUrl('');
        setLink('');
        setActive(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar apoiador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Apoiador' : 'Novo Apoiador'}</DialogTitle>
          <DialogDescription>
            Adicione ou edite as informações do apoiador que aparecerá no site.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="pt-3 text-right">Logo</Label>
              <div className="col-span-3 space-y-4">
                <div
                  className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                    isUploading
                      ? 'bg-muted/50 cursor-not-allowed'
                      : 'hover:bg-muted/20 border-muted-foreground/25 cursor-pointer'
                  }`}
                  onClick={() =>
                    !isUploading && document.getElementById('supporter-logo-upload')?.click()
                  }
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="text-muted-foreground h-8 w-8" />
                    <div className="text-muted-foreground text-xs">
                      <span className="text-primary font-semibold">Clique para enviar</span>
                    </div>
                  </div>
                  <Input
                    id="supporter-logo-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    accept="image/*"
                  />
                </div>

                {avatarUrl && (
                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border">
                    <Image src={avatarUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}

                {isUploading && (
                  <p className="text-muted-foreground text-center text-xs">Enviando imagem...</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input
                id="link"
                value={link}
                onChange={e => setLink(e.target.value)}
                className="col-span-3"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Ativo
              </Label>
              <Switch id="active" checked={active} onCheckedChange={setActive} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || isUploading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
