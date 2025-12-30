import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead className="text-right">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {likes?.map((like, index) => (
                  <TableRow key={`${like.post_id}-${like.user_id}-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={like.profiles?.avatar_url || ''} />
                          <AvatarFallback>
                            {like.profiles?.full_name?.slice(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {like.profiles?.full_name || 'Usuário Desconhecido'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {like.posts ? (
                        <Link
                          href={`/${like.posts.slug}`}
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          {like.posts.title}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground italic">Post excluído</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right">
                      {format(new Date(like.created_at), "d 'de' MMMM 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                {!likes?.length && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Nenhuma curtida encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
