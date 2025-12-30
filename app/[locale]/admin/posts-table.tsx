'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';
import { Database } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Trash2,
  Edit,
  Eye,
  MoreHorizontal,
  Archive,
  ArchiveRestore,
  EyeOff,
  CheckCircle,
  Mail,
} from 'lucide-react';
import {
  archivePost,
  restorePost,
  hidePost,
  publishPost,
  sendPostNewsletter,
} from '@/app/actions/posts';

type Post = Database['public']['Tables']['posts']['Row'];

interface PostsTableProps {
  posts: Post[];
}

export function PostsTable({ posts: initialPosts }: PostsTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts); // Local state for optimistic UI
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === posts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(posts.map(p => p.id)));
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

  const deletePosts = async (ids: string[]) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('posts').delete().in('id', ids);

      if (error) throw error;

      toast.success(ids.length > 1 ? 'Posts deletados!' : 'Post deletado!');
      setPosts(prev => prev.filter(p => !ids.includes(p.id)));
      setSelectedIds(new Set()); // Clear selection
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao deletar: ' + errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAction = async (
    action: (id: string) => Promise<{ success: boolean; message?: string }>,
    id: string,
    successMessage: string
  ) => {
    const result = await action(id);
    if (result.success) {
      toast.success(successMessage);
      router.refresh();
    } else {
      toast.error(result.message);
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
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente os posts
                  selecionados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deletePosts(Array.from(selectedIds))}
                >
                  {isDeleting ? 'Deletando...' : 'Sim, deletar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="rounded-md border p-4">
        <Table className="min-w-200">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={posts.length > 0 && selectedIds.size === posts.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-25 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map(post => (
              <TableRow
                key={post.id}
                data-state={selectedIds.has(post.id) && 'selected'}
                className={post.archived ? 'opacity-50' : ''}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(post.id)}
                    onCheckedChange={() => toggleSelect(post.id)}
                    aria-label={`Select ${post.title}`}
                  />
                </TableCell>
                <TableCell className="max-w-50 truncate font-medium" title={post.title}>
                  {post.title}
                  {post.archived && (
                    <span className="text-muted-foreground ml-2 text-xs">(Arquivado)</span>
                  )}
                </TableCell>
                <TableCell className="max-w-37.5 truncate" title={post.slug}>
                  {post.slug}
                </TableCell>
                <TableCell>
                  {post.published ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                      Publicado
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                      Rascunho
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <Link href={`/${post.slug}`} target="_blank">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> Ver Post
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/posts/edit/${post.slug}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        {post.published ? (
                          <DropdownMenuItem
                            onClick={() => handleAction(hidePost, post.id, 'Post ocultado')}
                          >
                            <EyeOff className="mr-2 h-4 w-4" /> Ocultar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleAction(publishPost, post.id, 'Post publicado')}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" /> Publicar
                          </DropdownMenuItem>
                        )}
                        {post.published && (
                          <DropdownMenuItem
                            // disabled={!!post.newsletter_sent_at}
                            onClick={() =>
                              handleAction(sendPostNewsletter, post.id, 'Newsletter enviada!')
                            }
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            {post.newsletter_sent_at ? 'Reenviar Email' : 'Enviar Email'}
                          </DropdownMenuItem>
                        )}
                        {post.archived ? (
                          <DropdownMenuItem
                            onClick={() => handleAction(restorePost, post.id, 'Post restaurado')}
                          >
                            <ArchiveRestore className="mr-2 h-4 w-4" /> Restaurar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleAction(archivePost, post.id, 'Post arquivado')}
                          >
                            <Archive className="mr-2 h-4 w-4" /> Arquivar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deletePosts([post.id])}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum post encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
