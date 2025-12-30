import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PostsTable } from './posts-table';

export const metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminPage() {
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
    .returns<{ role: 'admin' | 'user' }[]>()
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <Link href="/blog">
          <Button variant="link">Voltar para o blog</Button>
        </Link>
      </div>
    );
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Posts</h1>
        <Link href="/admin/posts/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Post
          </Button>
        </Link>
      </div>

      <PostsTable posts={posts || []} />
    </div>
  );
}
