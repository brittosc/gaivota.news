import { LikesTable } from '@/components/admin/likes-table';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
// Link, Avatar unused
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// Table imports unused
// Date fns unused

export const metadata = {
  title: 'Histórico de Curtidas',
};

export default async function LikesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'editor') {
    redirect('/admin');
  }

  // Fetch likes with relations
  const { data: likes, error } = await supabase
    .from('post_likes')
    .select(
      `
      id,
      created_at,
      user_id,
      post_id,
      profiles:user_id (full_name, avatar_url),
      posts:post_id (title, slug)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching likes:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Histórico de Curtidas</h1>
        <p className="text-muted-foreground mt-1">Veja quem curtiu seus posts recentemente.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curtidas</CardTitle>
          <CardDescription>
            Mostrando as {likes?.length || 0} curtidas mais recentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LikesTable likes={likes || []} currentUserRole={profile?.role} />
        </CardContent>
      </Card>
    </div>
  );
}
