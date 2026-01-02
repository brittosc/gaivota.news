'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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

type Post = Database['public']['Tables']['posts']['Row'] & { author_custom_name?: string | null };

interface CreatePostFormProps {
  initialData?: Post;
}

export default function CreatePostForm({ initialData }: CreatePostFormProps) {
  const router = useRouter();
  const t = useTranslations('Admin.Posts');
  const [loading, setLoading] = useState(false);
  // Controlled inputs for auto-slug
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData?.slug);
  const [authorCustomName, setAuthorCustomName] = useState(initialData?.author_custom_name || '');

  const [content, setContent] = useState(initialData?.content || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || '');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD') // Split accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start
      .replace(/-+$/, ''); // Trim - from end
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slugManuallyEdited) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugManuallyEdited(true);
  };

  const handleSubmit = async (published: boolean, event?: React.MouseEvent) => {
    event?.preventDefault();
    setLoading(true);

    if (!content.trim()) {
      toast.error('O conteúdo do post é obrigatório');
      setLoading(false);
      return;
    }

    // Form data is now in state, but we can verify
    if (!title.trim()) {
      toast.error('O título é obrigatório');
      setLoading(false);
      return;
    }
    if (!slug.trim()) {
      toast.error('O slug é obrigatório');
      setLoading(false);
      return;
    }

    try {
      // Validation: Check for empty content (stripping HTML)
      const strippedContent = content.replace(/<[^>]*>?/gm, '').trim();
      if (!strippedContent) {
        toast.error('O conteúdo do post não pode estar vazio.');
        setLoading(false);
        return;
      }

      // Check for duplicate Title or Slug
      const safeTitle = title.replace(/"/g, '\\"');
      const safeSlug = slug.replace(/"/g, '\\"');

      const { data: existingPosts, error: checkError } = await supabase
        .from('posts')
        .select('id, title, slug')
        .or(`title.eq."${safeTitle}",slug.eq."${safeSlug}"`);

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
        author_custom_name: authorCustomName || null,
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
        const { error: insertError } = await supabase.from('posts').insert(postData).single();
        error = insertError;
      }

      if (error) throw error;

      // Handle Tags

      if (error) throw error;

      toast.success(
        initialData
          ? `Post ${published ? 'publicado' : 'salvo'} com sucesso!`
          : `Post ${published ? 'criado' : 'salvo como rascunho'} com sucesso!`
      );

      if (initialData) {
        // If updating, go to the post page to see changes
        router.push(`/${slug}`);
      } else {
        // If creating, also go to the post page to see the new post
        router.push(`/${slug}`);
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
        onConfirm={url => setFeaturedImage(Array.isArray(url) ? url[0] : url)}
        type="image"
        initialUrl={featuredImage || ''}
      />
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">{t('titles')}</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder={t('titles')}
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">{t('slugs')}</Label>
          <Input
            id="slug"
            name="slug"
            required
            placeholder={t('slugsPlaceholder')}
            value={slug}
            onChange={handleSlugChange}
          />
          <p className="text-muted-foreground text-xs">{t('slugsDescription')}</p>
        </div>

        <div className="space-y-2">
          <Label>{t('images')}</Label>
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
              {featuredImage ? t('imageButton') : t('imageButton')}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="authorCustomName">{t('author')}</Label>
          <Input
            id="authorCustomName"
            value={authorCustomName}
            onChange={e => setAuthorCustomName(e.target.value)}
            placeholder={t('authorPlaceholder')}
          />
          <p className="text-muted-foreground text-xs">{t('authorDescription')}</p>
        </div>

        <div className="space-y-2">
          <Label>{t('content')}</Label>
          <div className="min-h-100">
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={e => handleSubmit(false, e)}
            disabled={loading}
          >
            {loading ? t('saving') : t('saveWithDraft')}
          </Button>
          <Button type="button" onClick={e => handleSubmit(true, e)} disabled={loading}>
            {loading
              ? t('saving')
              : initialData?.published
                ? t('saveChanges')
                : t('saveWithPublish')}
          </Button>
        </div>
      </form>
    </>
  );
}
