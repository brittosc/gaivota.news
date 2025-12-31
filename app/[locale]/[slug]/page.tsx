import { createClient } from '@/lib/supabase/server';

import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Database } from '@/lib/database.types';
import { ShareButtons } from '@/components/blog/share-buttons';
import Image from 'next/image';
import { PostViewer } from '@/components/blog/post-viewer';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

type PostWithTags = Database['public']['Tables']['posts']['Row'] & {
  post_tags: {
    tags: Database['public']['Tables']['tags']['Row'];
  }[];
};

export async function generateMetadata(props: BlogPostProps) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, content, featured_image')
    .eq('slug', params.slug)
    .returns<
      Pick<Database['public']['Tables']['posts']['Row'], 'title' | 'content' | 'featured_image'>[]
    >()
    .single();

  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  return {
    title: post.title,
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      url: `/${params.slug}`,
      siteName: 'Gaivota News',
      type: 'article',
      images: post.featured_image
        ? [
            {
              url: post.featured_image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [
            {
              url: '/og-default.png', // Fallback image
              width: 1200,
              height: 630,
              alt: 'Gaivota News',
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.substring(0, 160),
      images: post.featured_image ? [post.featured_image] : ['/og-default.png'],
    },
  };
}

// import { LikeButton } from '@/components/blog/like-button';

// ... (existing imports)

export default async function BlogPostPage(props: BlogPostProps) {
  const params = await props.params;
  const supabase = await createClient();

  // Fetch post with tags
  const { data: postData, error } = await supabase
    .from('posts')
    .select('*, post_tags(tags(*))')
    .eq('slug', params.slug)
    .single();

  if (error || !postData) {
    notFound();
  }

  const post = postData as unknown as PostWithTags;

  // Fetch current user and profile to check permissions
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  // let isLiked = false; - Removed unused variable

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .returns<Pick<Database['public']['Tables']['profiles']['Row'], 'role'>[]>()
      .single();

    isAdmin = profile?.role === 'admin';

    // isLiked = !!like; - Removed unused assignment
  }

  // Check if current user is admin if post is unpublished
  if (!post.published && !isAdmin) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto mb-8 flex max-w-4xl items-center justify-between px-4">
        <Link href="/">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o blog
          </Button>
        </Link>
        {isAdmin && (
          <Link href={`/admin/posts/edit/${post.slug}`}>
            <Button variant="outline" size="sm">
              Editar Post
            </Button>
          </Link>
        )}
      </div>

      {post.featured_image && (
        <div className="mx-auto mb-10 w-full max-w-6xl px-4">
          <div
            className="relative w-full overflow-hidden rounded-xl border shadow-sm"
            style={{ maxHeight: '500px' }}
          >
            {/* Using style for max-height to ensure it doesn't get too tall on large screens, while keeping width */}
            <Image
              src={post.featured_image}
              alt={post.title}
              width={1200}
              height={630}
              className="h-full w-full object-cover"
              style={{ maxHeight: '500px', width: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-4xl px-4">
        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <div className="mb-8 border-b pb-8">
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
            <div className="flex items-end justify-between gap-4 text-sm">
              <div className="text-muted-foreground flex flex-col gap-1">
                <span>
                  {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </span>
                {(post as PostWithTags & { author_custom_name?: string }).author_custom_name && (
                  <span className="text-foreground font-medium">
                    Por{' '}
                    {(post as PostWithTags & { author_custom_name?: string }).author_custom_name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {/* <LikeButton
                  postId={post.id}
                  initialLiked={isLiked}
                  initialCount={post.likes_count || 0}
                  userId={user?.id}
                /> */}
                <ShareButtons title={post.title} url={`/${post.slug}`} />
              </div>
            </div>
          </div>
          <div className="leading-relaxed">
            <PostViewer content={post.content} />
          </div>
        </article>
      </div>
    </div>
  );
}
