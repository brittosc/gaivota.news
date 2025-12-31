'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { SupporterModal } from '@/components/modals/supporter-modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Database } from '@/lib/database.types';

type Supporter = Database['public']['Tables']['supporters']['Row'];

export function SupporterActions({
  supporter,
  currentUserRole = 'editor',
}: {
  supporter: Supporter;
  currentUserRole?: 'admin' | 'editor' | 'user' | string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    const { error } = await supabase.from('supporters').delete().eq('id', supporter.id);
    if (error) {
      toast.error('Erro ao deletar');
    } else {
      toast.success('Deletado com sucesso');
      router.refresh();
    }
  };

  if (currentUserRole !== 'admin') {
    return null;
  }

  return (
    <div className="flex justify-end gap-2">
      <SupporterModal
        supporter={supporter}
        open={editOpen}
        onOpenChange={setEditOpen}
        trigger={
          <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o apoiador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
