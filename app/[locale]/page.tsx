import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Database } from '@/lib/database.types';
import { SearchFilter } from '@/components/blog/search-filter';
import { calculateReadingTime } from '@/lib/reading-time';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Blog - Gaivota News',
  description: 'Notícias e atualizações sobre o nosso município nesta coluna semanal.',
};

interface HomeProps {
  searchParams: Promise<{ page?: string; query?: string; sort?: string }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || '';
  const sortAscending = searchParams.sort === 'oldest';

  const POSTS_PER_PAGE = 5;
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE - 1;

  const supabase = await createClient();

  let supabaseQuery = supabase.from('posts').select('*', { count: 'exact' }).eq('published', true);

  if (query) {
    supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
  }

  const {
    data: posts,
    error,
    count,
  } = await supabaseQuery
    .order('created_at', { ascending: sortAscending })
    .range(start, end)
    .returns<Database['public']['Tables']['posts']['Row'][]>();

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar posts.</div>;
  }

  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (searchParams.sort) params.set('sort', searchParams.sort);
    params.set('page', newPage.toString());
    return `/?${params.toString()}`;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
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
          Notícias e atualizações sobre o nosso município nesta coluna semanal.
        </p>
      </div>

      <SearchFilter />

      <div className="space-y-8">
        {posts?.map(post => (
          <Link href={`/${post.slug}`} key={post.id} className="group block">
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
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </CardDescription>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 text-xs whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {calculateReadingTime(post.content)}
                  </div>
                </div>
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
          <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <p className="text-muted-foreground text-lg">Nenhum post encontrado para sua busca.</p>
            {query && (
              <Link href="/">
                <Button variant="link" className="mt-2">
                  Limpar busca
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {/* First Page */}
          <Link
            href={createPageUrl(1)}
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
          >
            <Button variant="outline" size="icon" disabled={page <= 1} title="Primeira página">
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </Link>

          {/* Previous Page */}
          <Link
            href={createPageUrl(page - 1)}
            aria-disabled={!hasPrevPage}
            className={!hasPrevPage ? 'pointer-events-none opacity-50' : ''}
          >
            <Button variant="outline" size="icon" disabled={!hasPrevPage} title="Página anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>

          <span className="flex items-center px-4 text-sm font-medium">
            Página {page} de {totalPages}
          </span>

          {/* Next Page */}
          <Link
            href={createPageUrl(page + 1)}
            aria-disabled={!hasNextPage}
            className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
          >
            <Button variant="outline" size="icon" disabled={!hasNextPage} title="Próxima página">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>

          {/* Last Page */}
          <Link
            href={createPageUrl(totalPages)}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
          >
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              title="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
