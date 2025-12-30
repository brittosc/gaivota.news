import CreatePostForm from '../../create/create-post-form';

export const runtime = 'edge';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Database } from '@/lib/database.types';

export const metadata = {
  title: 'Editar Post',
};

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPostPage(props: EditPostPageProps) {
  const params = await props.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Role check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .returns<Pick<Database['public']['Tables']['profiles']['Row'], 'role'>[]>()
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'editor') {
    redirect('/admin');
  }

  // Fetch post data
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single();

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Editar Post</h1>
      <CreatePostForm initialData={post} />
    </div>
  );
}
