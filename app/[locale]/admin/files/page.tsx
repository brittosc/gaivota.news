import { FileManager } from '@/components/admin/file-manager';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function FilesPage() {
  const supabase = await createClient();

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
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-l-4 border-l-red-500 shadow-lg">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-6 rounded-full bg-red-50 p-4">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Acesso Restrito</h1>
            <p className="mb-6 leading-relaxed text-gray-500">
              Você não possui as permissões necessárias.
            </p>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Voltar ao Início
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FileManager />
    </div>
  );
}
