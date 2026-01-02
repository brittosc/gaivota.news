'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';
import { Database } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  X,
} from 'lucide-react';
import {
  archivePost,
  restorePost,
  hidePost,
  publishPost,
  sendPostNewsletter,
} from '@/app/actions/posts';
import { useTranslations } from 'next-intl';

type Post = Database['public']['Tables']['posts']['Row'];

interface PostsTableProps {
  posts: Post[];
}

export function PostsTable({ posts: initialPosts }: PostsTableProps) {
  const t = useTranslations('Admin.Posts');
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts); // Local state for optimistic UI
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState('published');
  const supabase = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPosts.map(p => p.id)));
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

      toast.success(ids.length > 1 ? t('postsDeleted') : t('postDeleted'));
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

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'archived') return post.archived;
    if (filter === 'published') return post.published && !post.archived;
    if (filter === 'draft') return !post.published && !post.archived;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="published" value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">{t('all')}</TabsTrigger>
            <TabsTrigger value="published">{t('published')}</TabsTrigger>
            <TabsTrigger value="draft">{t('draft')}</TabsTrigger>
            <TabsTrigger value="archived">{t('archived')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="bg-popover text-popover-foreground flex items-center gap-4 rounded-xl border p-4 shadow-xl">
            <span className="text-sm font-medium">
              {selectedIds.size} {t('selected')}
            </span>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('confirmDeleteTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('confirmDeleteDescription')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => deletePosts(Array.from(selectedIds))}
                    >
                      {isDeleting ? t('deleting') : t('yesDelete')}
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
        <Table className="min-w-200">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={filteredPosts.length > 0 && selectedIds.size === filteredPosts.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>{t('tableTitle')}</TableHead>
              <TableHead>{t('tableSlug')}</TableHead>
              <TableHead>{t('tableStatus')}</TableHead>
              <TableHead className="w-25 text-right">{t('tableActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map(post => (
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
                </TableCell>
                <TableCell className="max-w-37.5 truncate" title={post.slug}>
                  {post.slug}
                </TableCell>
                <TableCell>
                  {post.archived ? (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                      {t('archived')}
                    </span>
                  ) : post.published ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                      {t('published')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                      {t('draft')}
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
                        <DropdownMenuLabel>{t('tableActions')}</DropdownMenuLabel>
                        <Link href={`/${post.slug}`} target="_blank">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> {t('viewPost')}
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/posts/edit/${post.slug}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> {t('edit')}
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        {post.published ? (
                          <DropdownMenuItem
                            onClick={() => handleAction(hidePost, post.id, t('postHidden'))}
                          >
                            <EyeOff className="mr-2 h-4 w-4" /> {t('hide')}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleAction(publishPost, post.id, t('postPublished'))}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" /> {t('publish')}
                          </DropdownMenuItem>
                        )}
                        {post.published && (
                          <DropdownMenuItem
                            // disabled={!!post.newsletter_sent_at}
                            onClick={() =>
                              handleAction(sendPostNewsletter, post.id, t('newsletterSent'))
                            }
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            {post.newsletter_sent_at ? t('resendEmail') : t('sendEmail')}
                          </DropdownMenuItem>
                        )}
                        {post.archived ? (
                          <DropdownMenuItem
                            onClick={() => handleAction(restorePost, post.id, t('postRestored'))}
                          >
                            <ArchiveRestore className="mr-2 h-4 w-4" /> {t('restore')}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleAction(archivePost, post.id, t('postArchived'))}
                          >
                            <Archive className="mr-2 h-4 w-4" /> {t('archive')}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deletePosts([post.id])}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredPosts.length === 0 && (
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
