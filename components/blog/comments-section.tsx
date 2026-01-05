'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { MessageSquare, MoreVertical, Trash2, Edit2, Crown, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function CommentsSection({ postId }: { postId: string }) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Initialize Supabase client
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:profiles(full_name, avatar_url, role)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(
        data.map(c => ({
          id: c.id,
          content: c.content,
          user_name: c.user?.full_name || 'Usuário',
          user_role: c.user?.role,
          user_id: c.user_id,
          avatar_url: c.user?.avatar_url,
          created_at: c.created_at,
          updated_at: c.updated_at,
        }))
      );
    }
  }, [postId, supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      fetchComments();
    });
  }, [fetchComments, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      toast.error('Você precisa estar logado para comentar.');
      return;
    }

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: newComment,
    });

    if (error) {
      console.error('Error posting comment:', error);
      toast.error('Erro ao enviar comentário.');
      return;
    }

    setNewComment('');
    toast.success('Comentário enviado!');
    fetchComments();
  };

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);

    if (error) {
      toast.error('Erro ao excluir comentário.');
      return;
    }
    toast.success('Comentário excluído.');
    fetchComments(); // Refresh list
  };

  const startEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleUpdate = async () => {
    if (!editingCommentId || !editContent.trim()) return;

    const { error } = await supabase
      .from('comments')
      .update({ content: editContent })
      .eq('id', editingCommentId);

    if (error) {
      toast.error('Erro ao atualizar comentário.');
      return;
    }

    toast.success('Comentário atualizado.');
    setEditingCommentId(null);
    setEditContent('');
    fetchComments();
  };

  const getBadgeIcon = (role: string) => {
    if (role === 'admin') return <Shield className="mr-1 h-3 w-3" />;
    if (role === 'supporter') return <Crown className="mr-1 h-3 w-3" />;
    return null;
  };

  const getBadgeLabel = (role: string) => {
    if (role === 'admin') return 'Administrador';
    if (role === 'supporter') return 'Apoiador';
    return 'Usuário';
  };

  if (loading) return null;

  return (
    <div className="mt-16 border-t pt-10">
      <h3 className="mb-8 flex items-center gap-2 text-2xl font-bold">
        <MessageSquare className="h-6 w-6" /> Comentários
      </h3>

      {!user ? (
        <div className="bg-muted/50 rounded-xl border p-8 text-center">
          <h4 className="mb-2 text-lg font-semibold">Participe da discussão</h4>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para deixar um comentário.
          </p>
          <Link href="/login">
            <Button>Fazer Login</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Escreva seu comentário..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="min-h-25"
              />
              <Button type="submit">Publicar Comentário</Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-8">
        {comments.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center italic">
            Seja o primeiro a comentar.
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="group flex gap-4">
              <Avatar>
                <AvatarImage src={comment.avatar_url} />
                <AvatarFallback>{comment.user_name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{comment.user_name}</span>
                    {(comment.user_role === 'supporter' || comment.user_role === 'admin') && (
                      <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-500">
                        {getBadgeIcon(comment.user_role)}
                        {getBadgeLabel(comment.user_role)}
                      </span>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {new Date(comment.created_at).toLocaleDateString()}
                      {comment.updated_at && comment.updated_at !== comment.created_at && (
                        <span className="text-muted-foreground/70 ml-1 italic">(editado)</span>
                      )}
                    </span>
                  </div>
                  {user && user.id === comment.user_id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditing(comment)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {editingCommentId === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="min-h-20"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={cancelEditing}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleUpdate}>
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
