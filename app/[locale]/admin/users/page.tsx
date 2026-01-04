import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { UsersTable, UserProfile } from '@/components/admin/users-table';

export default async function UsersPage() {
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
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold">Acesso Restrito</h1>
        <p className="text-muted-foreground">Apenas administradores podem gerenciar usuários.</p>
      </div>
    );
  }

  // Fetch emails using Admin API to merge with profiles
  const adminSupabase = createAdminClient();

  // Fetch all profiles
  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  const { data: usersData } = await adminSupabase.auth.admin.listUsers();

  // Map emails to profiles
  const profilesWithEmail = profiles
    ?.map(profile => {
      const userRecord = usersData?.users.find(u => u.id === profile.id);
      return {
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role,
        created_at: profile.updated_at || new Date().toISOString(), // Fallback if no created_at in profile, or use userRecord.created_at
        // Actually profile doesn't have created_at in schema shown, so let's use userRecord or updated_at
        join_date: userRecord?.created_at,
        email: userRecord?.email || null,
        last_sign_in_at: userRecord?.last_sign_in_at || null,
      };
    })
    .map(p => ({
      ...p,
      created_at: p.join_date || p.created_at, // Normalize to created_at for table
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <p className="text-muted-foreground mt-1">
          Lista completa de usuários registrados na plataforma.
        </p>
      </div>

      <UsersTable data={(profilesWithEmail || []) as UserProfile[]} />
    </div>
  );
}
