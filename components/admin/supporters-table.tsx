'use client';

import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Database } from '@/lib/database.types';
import { SupporterActions } from './supporter-actions';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

type Supporter = Database['public']['Tables']['supporters']['Row'];

interface SupportersTableProps {
  supporters: Supporter[];
  currentUserRole?: 'admin' | 'editor' | 'user' | string;
}

export function SupportersTable({
  supporters: initialSupporters,
  currentUserRole = 'editor',
}: SupportersTableProps) {
  const router = useRouter();
  const [supporters, setSupporters] = useState(initialSupporters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === supporters.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(supporters.map(s => s.id)));
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
    const { error } = await supabase.from('supporters').delete().in('id', ids);

    if (error) {
      toast.error('Erro ao deletar: ' + error.message);
    } else {
      toast.success('Apoiadores deletados com sucesso!');
      setSupporters(prev => prev.filter(s => !ids.includes(s.id)));
      setSelectedIds(new Set());
      router.refresh();
    }
    setIsDeleting(false);
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Floating Bar */}
      {selectedIds.size > 0 && currentUserRole === 'admin' && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="bg-popover text-popover-foreground flex items-center gap-4 rounded-xl border p-4 shadow-xl">
            <span className="text-sm font-medium">{selectedIds.size} selecionado(s)</span>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação excluirá permanentemente os {selectedIds.size} apoiadores
                      selecionados.
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSelectedIds(new Set())}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={supporters.length > 0 && selectedIds.size === supporters.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supporters.map(supporter => (
              <TableRow key={supporter.id} data-state={selectedIds.has(supporter.id) && 'selected'}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(supporter.id)}
                    onCheckedChange={() => toggleSelect(supporter.id)}
                    aria-label={`Select ${supporter.name}`}
                  />
                </TableCell>
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
                  <SupporterActions supporter={supporter} currentUserRole={currentUserRole} />
                </TableCell>
              </TableRow>
            ))}
            {supporters.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground h-24 text-center">
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
