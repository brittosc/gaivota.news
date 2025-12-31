import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { SubscribersTable } from '@/components/admin/subscribers-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export const metadata = {
  title: 'Gerenciar Newsletter',
};

export default async function NewsletterPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'editor') {
    redirect('/admin'); // Page will handle access denied
  }

  // Fetch subscribers with bypass RLS
  const adminSupabase = createAdminClient();
  const { data: subscribers } = await adminSupabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch users and profiles to match email -> profile
  const { data: usersData } = await adminSupabase.auth.admin.listUsers();
  const users = usersData?.users || [];

  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('id, full_name, avatar_url');

  const subscribersWithProfile =
    subscribers?.map(sub => {
      const userMatches = users.find(u => u.email?.toLowerCase() === sub.email.toLowerCase());
      const profile = userMatches ? profiles?.find(p => p.id === userMatches.id) : null;
      return {
        ...sub,
        full_name: profile?.full_name,
        avatar_url: profile?.avatar_url,
      };
    }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Assinantes</h1>
          <p className="text-muted-foreground mt-1">Lista de todos os inscritos na newsletter.</p>
        </div>
        <Link href="/admin/newsletter/send">
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </Link>
      </div>

      <SubscribersTable subscribers={subscribersWithProfile} currentUserRole={profile?.role} />
    </div>
  );
}
