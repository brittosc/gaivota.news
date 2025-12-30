import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SupporterModal } from '@/components/modals/supporter-modal';
import { SupporterActions } from '@/components/admin/supporter-actions'; // Client component for actions
import { SupportersSettingsForm } from '@/components/admin/supporters-settings-form';

export default async function SupportersPage() {
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

  if (profile?.role !== 'admin') {
    return <div>Acesso restrito</div>;
  }

  const { data: supporters } = await supabase
    .from('supporters')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'supporters_marquee')
    .single();

  const initialSettings = settingsData?.value as { speed: number; maxItems: number } | null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciar Apoiadores</h1>
        <SupporterModal
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Apoiador
            </Button>
          }
        />
      </div>

      <SupportersSettingsForm initialSettings={initialSettings} />

      <div className="rounded-md border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supporters?.map(supporter => (
              <TableRow key={supporter.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={supporter.avatar_url || ''} />
                    <AvatarFallback>{supporter.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{supporter.name}</TableCell>
                <TableCell className="max-w-52 truncate">{supporter.link || '-'}</TableCell>
                <TableCell>
                  <Badge variant={supporter.active ? 'default' : 'secondary'}>
                    {supporter.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <SupporterActions supporter={supporter} />
                </TableCell>
              </TableRow>
            ))}
            {supporters?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                  Nenhum apoiador cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
