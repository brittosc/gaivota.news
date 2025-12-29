import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Database } from '@/lib/database.types';
import Image from 'next/image';

export const metadata = {
  title: 'Blog',
  description: 'Leia nossas últimas novidades',
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .returns<Database['public']['Tables']['posts']['Row'][]>();

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar posts.</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="flex items-center justify-center gap-3 text-4xl font-bold tracking-tight">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
          </svg>
          Gaivota News
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Notícias, atualizações e artigos do mundo da tecnologia.
        </p>
      </div>

      <div className="space-y-8">
        {posts?.map(post => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
            <Card
              className={`hover:bg-muted/50 overflow-hidden transition-all duration-300 hover:shadow-lg ${post.featured_image ? 'pt-0' : ''}`}
            >
              {post.featured_image && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              )}
              <CardHeader className={post.featured_image ? 'pt-6' : undefined}>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <CardDescription>
                  {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {post.content.replace(/<[^>]*>?/gm, '')}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {posts?.length === 0 && (
          <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <p className="text-muted-foreground text-lg">Nenhum post encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
