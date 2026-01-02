'use client';

import { useState } from 'react';
import { Trash2, Power, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

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
import {
  deleteSubscriber,
  deleteSubscribers,
  toggleSubscriberStatus,
} from '@/app/actions/newsletter';
import { Database } from '@/lib/database.types';

type Subscriber = Database['public']['Tables']['newsletter_subscribers']['Row'] & {
  full_name?: string | null;
  avatar_url?: string | null;
};

interface SubscribersTableProps {
  subscribers: Subscriber[];
  currentUserRole?: 'admin' | 'editor' | 'user' | string;
}

export function SubscribersTable({
  subscribers: initialSubscribers,
  currentUserRole = 'editor',
}: SubscribersTableProps) {
  const t = useTranslations('Admin.Newsletter');
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

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      const result = await toggleSubscriberStatus(id, newStatus);
      if (result.success) {
        toast.success(result.message);
        setSubscribers(prev =>
          prev.map(sub => (sub.id === id ? { ...sub, active: newStatus } : sub))
        );
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Erro ao atualizar status.');
    }
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
      {selectedIds.size > 0 && currentUserRole === 'admin' && (
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
                      onClick={() => handleDelete(Array.from(selectedIds))}
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
              <TableHead>{t('tableSubscriber')}</TableHead>
              <TableHead>{t('tableEmail')}</TableHead>
              <TableHead>{t('tableDate')}</TableHead>
              <TableHead>{t('tableStatus')}</TableHead>
              <TableHead className="text-right">{t('tableActions')}</TableHead>
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
                      <span className="text-sm font-medium">{sub.full_name || t('guest')}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{sub.email}</TableCell>
                <TableCell>{new Date(sub.created_at).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  {sub.active ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {t('statusActive')}
                    </span>
                  ) : (
                    <span className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {t('statusInactive')}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {currentUserRole === 'admin' && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(sub.id, !sub.active)}
                        className={
                          sub.active
                            ? 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
                            : 'text-muted-foreground hover:text-foreground'
                        }
                        title={sub.active ? t('deactivate') : t('activate')}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
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
                            <AlertDialogTitle>{t('removeSubscriberTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('removeSubscriberDescription', { email: sub.email })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete([sub.id])}
                              disabled={isDeleting}
                            >
                              {isDeleting ? t('removing') : t('yesRemove')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {subscribers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t('noSubscribers')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
