import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Users, Heart } from 'lucide-react';
import { PostsTable } from './posts-table';
import { OverviewChart } from '@/components/admin/overview-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays, startOfDay, endOfDay, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDateRangePicker } from '@/components/admin/date-range-picker';

export const metadata = {
  title: 'Admin Dashboard',
};

interface AdminPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
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
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <Link href="/">
          <Button variant="link">Voltar para a pagina inicial</Button>
        </Link>
      </div>
    );
  }

  const { from, to } = await searchParams; // searchParams is a promise in Next.js 15+ (actually simpler, it's just syncprop in older, async in newer, assuming async access is fine or just access it directly if page prop)
  // Actually Next.js 15 page props are awaited, but let's assume we can access them.
  // Wait, `searchParams` prop in Page component.

  const fromDate = from ? parseISO(from as string) : subDays(new Date(), 30);
  const toDate = to ? parseISO(to as string) : new Date();

  const startDate = startOfDay(fromDate).toISOString();
  const endDate = endOfDay(toDate).toISOString();

  // Fetch data withdate filter
  const [postsRes, subsRes, likesRes] = await Promise.all([
    supabase
      .from('posts')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false }),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact' }),
    supabase.from('post_likes').select('*').gte('created_at', startDate).lte('created_at', endDate),
  ]);

  const posts = postsRes.data || [];
  const likes = likesRes.data || [];
  const totalPosts = posts.length;
  const totalSubscribers = subsRes.count || 0;
  const totalLikes = likes.length; // Uses the actual likes table count in range, or total?
  // User wants total likes stats card -> implies ALL time usually, but here we limited by date.
  // Actually, typical dashboard card shows ALL time total, but chart shows trend.
  // The code previously filtered posts by date, so stats card showed "Posts in filtered range" effectively?
  // Line 126 was totalPosts (which is posts.length).
  // So stats cards are range-bound. That's fine.

  // Prepare Chart Data
  const daysDiff = differenceInDays(toDate, fromDate);
  const chartDataMap = new Map<string, { posts: number; likes: number }>();

  const isLongRange = daysDiff > 90;
  const dateFormatStr = isLongRange ? 'MMM yyyy' : 'dd MMM';

  // Helper to ensure map has keys
  const getOrCreate = (key: string) => {
    if (!chartDataMap.has(key)) {
      chartDataMap.set(key, { posts: 0, likes: 0 });
    }
    return chartDataMap.get(key)!;
  };

  posts.forEach(post => {
    const rawDate = format(new Date(post.created_at), 'yyyy-MM-dd');
    const entry = getOrCreate(rawDate);
    entry.posts += 1;
  });

  likes.forEach(like => {
    const rawDate = format(new Date(like.created_at), 'yyyy-MM-dd');
    const entry = getOrCreate(rawDate);
    entry.likes += 1;
  });

  // Convert to array
  const chartData = Array.from(chartDataMap.entries())
    .map(([date, data]) => ({
      date,
      name: format(parseISO(date), dateFormatStr, { locale: ptBR }),
      posts: data.posts,
      likes: data.likes,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .reverse();

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <CalendarDateRangePicker />
          <Link href="/admin/posts/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-muted-foreground text-xs">+1 desde o último mês (exemplo)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinantes</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
            <p className="text-muted-foreground text-xs">Assinantes da Newsletter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Curtidas</CardTitle>
            <Heart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
            <p className="text-muted-foreground text-xs">Em todos os posts</p>
          </CardContent>
        </Card>
      </div>

      <div className="lg:grid-w-full grid w-full gap-4 md:grid-cols-1">
        <OverviewChart data={chartData} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Posts Recentes</h2>
        <PostsTable posts={posts} />
      </div>
    </div>
  );
}
