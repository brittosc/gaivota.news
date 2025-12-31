import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShieldAlert } from 'lucide-react';
import { PostsTable } from '../posts-table';
import { PostsLimitSelector } from '@/components/admin/posts-limit-selector';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PostsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const supabase = await createClient();

  // Check auth and role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'editor') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-l-4 border-l-red-500 shadow-lg">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-6 rounded-full bg-red-50 p-4">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Acesso Restrito</h1>
            <p className="mb-6 leading-relaxed text-gray-500">
              Você não possui as permissões necessárias.
            </p>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Voltar ao Início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { page: pageParam, limit: limitParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const limit = Number(limitParam) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Fetch posts with pagination
  // We need count to know total pages
  const { data: posts, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Todos os Posts</h1>
        <Link href="/admin/posts/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Post
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
          <PostsLimitSelector />
        </div>
        <PostsTable posts={posts || []} />

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={`/admin/posts?page=${page - 1}&limit=${limit}`} />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href={`/admin/posts?page=${p}&limit=${limit}`}
                      isActive={page === p}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`/admin/posts?page=${page + 1}&limit=${limit}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
