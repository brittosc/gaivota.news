'use client';

import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

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
import { deleteLikes } from '@/app/actions/posts';

type Like = {
  id: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  posts: {
    title: string;
    slug: string;
  } | null;
};

interface LikesTableProps {
  likes: Like[];
  currentUserRole?: 'admin' | 'editor' | 'user' | string;
}

export function LikesTable({ likes: initialLikes, currentUserRole = 'editor' }: LikesTableProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.size === likes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(likes.map(l => l.id)));
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
      const result = await deleteLikes(ids);
      if (result.success) {
        toast.success(result.message);
        setLikes(prev => prev.filter(l => !ids.includes(l.id)));
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
                      Esta ação removerá permanentemente as {selectedIds.size} curtidas
                      selecionadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => handleDelete(Array.from(selectedIds))}
                    >
                      {isDeleting ? 'Removendo...' : 'Sim, remover'}
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
                  checked={likes.length > 0 && selectedIds.size === likes.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Post</TableHead>
              <TableHead className="text-right">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {likes.map(like => (
              <TableRow key={like.id} data-state={selectedIds.has(like.id) && 'selected'}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(like.id)}
                    onCheckedChange={() => toggleSelect(like.id)}
                    aria-label="Select row"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={like.profiles?.avatar_url || ''} />
                      <AvatarFallback>
                        {like.profiles?.full_name?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {like.profiles?.full_name || 'Usuário Desconhecido'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {like.posts ? (
                    <Link
                      href={`/${like.posts.slug}`}
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      {like.posts.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground italic">Post excluído</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-right">
                  {format(new Date(like.created_at), "d 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
              </TableRow>
            ))}
            {likes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhuma curtida encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
