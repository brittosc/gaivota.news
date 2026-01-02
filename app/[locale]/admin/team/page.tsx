import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { AddTeamMemberDialog } from '@/components/admin/add-team-member-dialog';
import { TeamMemberCard } from '@/components/admin/team-member-card';
import { getTranslations } from 'next-intl/server';

export default async function TeamPage() {
  const t = await getTranslations('Admin.Team');
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

  if (currentUserProfile?.role !== 'admin' && currentUserProfile?.role !== 'editor') {
    return <div>Acesso restrito</div>;
  }

  // Fetch team profiles (admin and editor)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['admin', 'editor'])
    .order('full_name');

  // Fetch emails using Admin API
  const adminSupabase = createAdminClient();
  const { data: usersData } = await adminSupabase.auth.admin.listUsers();

  // Map emails to profiles
  const profilesWithEmail = profiles?.map(profile => {
    const userRecord = usersData?.users.find(u => u.id === profile.id);
    return {
      ...profile,
      email: userRecord?.email,
      join_date: userRecord?.created_at,
      last_sign_in_at: userRecord?.last_sign_in_at,
      last_active_at: profile.last_active_at, // Access the new column from profile
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('description')}</p>
        </div>
        <AddTeamMemberDialog />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profilesWithEmail?.map(profile => (
          <TeamMemberCard
            key={profile.id}
            profile={profile}
            currentUserId={user.id}
            currentUserRole={currentUserProfile.role}
          />
        ))}
      </div>
    </div>
  );
}
