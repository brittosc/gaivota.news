import CreatePostForm from './create-post-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Criar Novo Post',
};

export default async function CreatePostPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Double check role on server side
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .returns<{ role: 'admin' | 'user' }[]>()
    .single();

  if (profile?.role !== 'admin') {
    redirect('/blog');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Novo Post</h1>
      <CreatePostForm />
    </div>
  );
}
