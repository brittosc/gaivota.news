import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddTeamMemberDialog } from '@/components/admin/add-team-member-dialog';

export default async function TeamPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify Admin
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentUserProfile?.role !== 'admin') {
    return <div>Acesso restrito</div>;
  }

  // Fetch team profiles (admin and editor)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['admin', 'editor'])
    .order('full_name');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Equipe</h1>
        <AddTeamMemberDialog />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles?.map(profile => (
          <Card key={profile.id}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback>{profile.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{profile.full_name}</CardTitle>
                <p className="text-muted-foreground w-40 truncate text-xs">{profile.id}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                  {profile.role.toUpperCase()}
                </Badge>
                {/* Aqui poderíamos adicionar um botão para promover/rebaixar usuário se necessário */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
