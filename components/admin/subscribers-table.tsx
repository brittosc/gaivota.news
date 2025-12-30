'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { deleteSubscriber, deleteSubscribers } from '@/app/actions/newsletter';
import { Database } from '@/lib/database.types';

type Subscriber = Database['public']['Tables']['newsletter_subscribers']['Row'] & {
  full_name?: string | null;
  avatar_url?: string | null;
};

interface SubscribersTableProps {
  subscribers: Subscriber[];
}

export function SubscribersTable({ subscribers: initialSubscribers }: SubscribersTableProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.size === subscribers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(subscribers.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = async (ids: string[]) => {
    setIsDeleting(true);
    try {
      const result = ids.length > 1 ? await deleteSubscribers(ids) : await deleteSubscriber(ids[0]);

      if (result.success) {
        toast.success(result.message);
        setSubscribers(prev => prev.filter(sub => !ids.includes(sub.id)));
        setSelectedIds(new Set());
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Erro desconhecido ao remover.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && (
        <div className="bg-muted/50 flex items-center justify-between rounded-md border p-2">
          <span className="text-sm font-medium">{selectedIds.size} selecionado(s)</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar Selecionados
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação excluirá permanentemente os {selectedIds.size} assinantes selecionados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => handleDelete(Array.from(selectedIds))}
                >
                  {isDeleting ? 'Deletando...' : 'Sim, deletar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="rounded-md border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={subscribers.length > 0 && selectedIds.size === subscribers.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Assinante</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data de Inscrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map(sub => (
              <TableRow key={sub.id} data-state={selectedIds.has(sub.id) && 'selected'}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(sub.id)}
                    onCheckedChange={() => toggleSelect(sub.id)}
                    aria-label={`Select ${sub.email}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sub.avatar_url || ''} />
                      <AvatarFallback>
                        {(sub.full_name?.[0] || sub.email[0]).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{sub.full_name || 'Visitante'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{sub.email}</TableCell>
                <TableCell>{new Date(sub.created_at).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  {sub.active ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Inativo
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Assinante?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover <b>{sub.email}</b>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete([sub.id])}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Removendo...' : 'Sim, remover'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {subscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum assinante encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
