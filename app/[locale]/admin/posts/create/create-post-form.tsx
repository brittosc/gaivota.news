'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { env } from '@/lib/env';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { Database } from '@/lib/database.types';
import { MediaUploadModal } from '@/components/editor/media-upload-modal';
import Image from 'next/image';

type Post = Database['public']['Tables']['posts']['Row'];

interface CreatePostFormProps {
  initialData?: Post;
}

export default function CreatePostForm({ initialData }: CreatePostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(initialData?.content || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSubmit = async (published: boolean, event?: React.MouseEvent) => {
    event?.preventDefault();
    setLoading(true);

    if (!content.trim()) {
      toast.error('O conteúdo do post é obrigatório');
      setLoading(false);
      return;
    }

    const form = document.querySelector('form') as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;

    try {
      // Validation: Check for empty content (stripping HTML)
      const strippedContent = content.replace(/<[^>]*>?/gm, '').trim();
      if (!strippedContent) {
        toast.error('O conteúdo do post não pode estar vazio.');
        setLoading(false);
        return;
      }

      // Check for duplicate Title or Slug
      const { data: existingPosts, error: checkError } = await supabase
        .from('posts')
        .select('id, title, slug')
        .or(`title.eq.${title},slug.eq.${slug}`);

      if (checkError) throw checkError;

      const duplicate = existingPosts?.find(p => p.id !== initialData?.id);
      if (duplicate) {
        if (duplicate.title === title) {
          toast.error('Já existe um post com este título.');
          setLoading(false);
          return;
        }
        if (duplicate.slug === slug) {
          toast.error('Já existe um post com este slug (URL).');
          setLoading(false);
          return;
        }
      }

      const postData = {
        title,
        slug,
        content,
        published,
        featured_image: featuredImage || null,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (initialData) {
        const { error: updateError } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('posts').insert(postData);
        error = insertError;
      }

      if (error) throw error;

      toast.success(
        initialData
          ? `Post ${published ? 'publicado' : 'salvo'} com sucesso!`
          : `Post ${published ? 'criado' : 'salvo como rascunho'} com sucesso!`
      );

      if (initialData) {
        // If updating, go to the post page to see changes
        router.push(`/blog/${slug}`);
      } else {
        // If creating, also go to the post page to see the new post
        router.push(`/blog/${slug}`);
      }
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao salvar post: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MediaUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={url => setFeaturedImage(url)}
        type="image"
        initialUrl={featuredImage || ''}
      />
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Título do post"
            defaultValue={initialData?.title}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            required
            placeholder="titulo-do-post"
            defaultValue={initialData?.slug}
          />
          <p className="text-muted-foreground text-xs">URL amigável para o post.</p>
        </div>

        <div className="space-y-2">
          <Label>Imagem de Capa</Label>
          <div className="flex flex-col gap-4">
            {featuredImage && (
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border">
                <Image
                  src={featuredImage}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => setFeaturedImage('')}
                >
                  <span className="sr-only">Remover</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="w-fit"
            >
              {featuredImage ? 'Alterar Imagem' : 'Adicionar Imagem'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Conteúdo</Label>
          <div className="min-h-100">
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={e => handleSubmit(false, e)}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar como Rascunho'}
          </Button>
          <Button type="button" onClick={e => handleSubmit(true, e)} disabled={loading}>
            {loading ? 'Salvando...' : initialData?.published ? 'Atualizar Post' : 'Publicar'}
          </Button>
        </div>
      </form>
    </>
  );
}
