'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  MessageCircle,
  X,
  Maximize2,
  Minimize2,
  CheckCheck,
  Paperclip,
  FileIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Database } from '@/lib/database.types';

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'] & {
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
    role: 'admin' | 'editor' | 'user' | 'supporter';
  };
};

type ReadReceipt = {
  message_id: string;
  user_id: string;
  read_at: string;
  profiles?: {
    full_name: string | null;
  };
};

type UserRole = 'admin' | 'editor' | 'user' | 'supporter';

export function ChatWidget({ userRole, userId }: { userRole?: UserRole; userId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [readReceipts, setReadReceipts] = useState<ReadReceipt[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Can Access?
  const canAccess = ['admin', 'editor', 'supporter'].includes(userRole || '');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/chat.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!userId || messageIds.length === 0) return;

      // Optimistic / Fire-and-forget
      const receiptsToInsert = messageIds.map(mid => ({
        message_id: mid,
        user_id: userId,
      }));

      await supabase
        .from('chat_read_receipts')
        .upsert(receiptsToInsert, { ignoreDuplicates: true });
    },
    [userId, supabase]
  );

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setShouldAutoScroll(true);
      setTimeout(scrollToBottom, 100);

      const unreadIds = messages.map(m => m.id);
      markAsRead(unreadIds);
    }
  }, [isOpen, messages, markAsRead]); // Mark read when opening or new messages arrive while open

  // Initial Fetch logic
  useEffect(() => {
    if (!canAccess) return;

    const fetchMessagesAndReceipts = async () => {
      // 7 days retention implies we can fetch everything or a larger limit
      const { data, error } = await supabase
        .from('chat_messages')
        .select(
          `
            *, 
            profiles!chat_messages_user_id_fkey(full_name, avatar_url, role)
        `
        )
        .order('created_at', { ascending: true }); // Removed limit to ensure full history within retention

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error(`Erro ao carregar histórico: ${error.message}`);
      }

      if (data) {
        console.log('Fetched messages:', data.length); // Debug
        setMessages(data as unknown as ChatMessage[]);
        if (isOpenRef.current) setTimeout(scrollToBottom, 100);

        const msgIds = data.map(m => m.id);
        if (msgIds.length > 0) {
          const { data: receipts } = await supabase
            .from('chat_read_receipts')
            .select('*, profiles(full_name)')
            .in('message_id', msgIds);

          if (receipts) {
            setReadReceipts(receipts as unknown as ReadReceipt[]);
          }
        }
      }
    };

    fetchMessagesAndReceipts();

    const channel = supabase
      .channel('chat_room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async payload => {
          const newMessagePayload = payload.new as ChatMessage;

          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, role')
            .eq('id', newMessagePayload.user_id)
            .single();

          if (profile) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setMessages(prev => [...prev, { ...newMessagePayload, profiles: profile as any }]);

            const isFromOthers = newMessagePayload.user_id !== userId;
            if (isFromOthers) {
              audioRef.current?.play().catch(() => {});
              if (!isOpenRef.current) {
                setUnreadCount(prev => prev + 1);
              } else {
                markAsRead([newMessagePayload.id]);
              }
            } else {
              markAsRead([newMessagePayload.id]);
            }
          }
        }
      )
      .subscribe();

    const receiptsChannel = supabase
      .channel('chat_receipts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_read_receipts' },
        async payload => {
          const newReceipt = payload.new as ReadReceipt;
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', newReceipt.user_id)
            .single();

          if (profile) {
            setReadReceipts(prev => [...prev, { ...newReceipt, profiles: profile }]);
          }
        }
      )
      .subscribe();

    // Presence
    const presenceChannel = supabase.channel('chat_presence');
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const typing = new Set<string>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.values(state).forEach((users: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          users.forEach((user: any) => {
            if (user.isTyping && user.userId !== userId && user.fullName) {
              typing.add(user.fullName);
            }
          });
        });
        setTypingUsers(typing);
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ isTyping: false, userId, fullName: 'Unknown' });
        }
      });

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(receiptsChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [canAccess, supabase, userId, markAsRead]); // Dependencies minimal to prevent loop

  // Auto-scroll
  useEffect(() => {
    if (shouldAutoScroll && isOpen) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll, isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShouldAutoScroll(isAtBottom);
  };

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  };

  // Typing
  const notifyTyping = async (isTyping: boolean) => {
    const channel = supabase.channel('chat_presence');
    await channel.track({
      isTyping,
      userId,
      fullName: messages.find(m => m.user_id === userId)?.profiles?.full_name || 'Alguém',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    notifyTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      notifyTyping(false);
    }, 2000);
  };

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-temp')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('chat-temp').getPublicUrl(filePath);

      // Send message with file
      const { error: msgError } = await supabase.from('chat_messages').insert({
        user_id: userId,
        content: '', // Empty content for file-only messages, or we could add text
        file_url: publicUrl,
        file_type: file.type,
        file_name: file.name,
      });

      if (msgError) throw msgError;
      setShouldAutoScroll(true);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar arquivo.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    notifyTyping(false);

    try {
      const { error } = await supabase.from('chat_messages').insert({
        user_id: userId,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage('');
      setShouldAutoScroll(true);
    } catch {
      toast.error('Erro ao enviar mensagem.');
    }
  };

  const getReaders = (msgId: string) => {
    return readReceipts
      .filter(r => r.message_id === msgId && r.user_id !== userId)
      .map(r => r.profiles?.full_name || 'Unknown')
      .filter(name => name !== 'Unknown');
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.file_url) {
      const isImage = msg.file_type?.startsWith('image/');
      const isAudio = msg.file_type?.startsWith('audio/');

      if (isImage) {
        return (
          <div className="relative mt-1 mb-1 max-w-42.5 overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={msg.file_url} alt="imagem" className="h-auto w-full object-cover" />
          </div>
        );
      }
      if (isAudio) {
        return (
          <div className="mt-1 mb-1 min-w-42.5">
            <audio controls src={msg.file_url} className="h-8 w-full" />
          </div>
        );
      }
      // Default file
      return (
        <a
          href={msg.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-card hover:bg-muted group mt-1 flex items-center gap-3 rounded-md border p-3 transition-colors"
        >
          <div className="bg-muted group-hover:bg-background rounded-full p-2 transition-colors">
            <FileIcon className="text-muted-foreground h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="max-w-30 truncate text-xs font-medium">
              {msg.file_name || 'Arquivo'}
            </span>
            <span className="text-muted-foreground text-[10px] uppercase">
              {msg.file_type?.split('/')[1] || 'FILE'}
            </span>
          </div>
        </a>
      );
    }
    return msg.content;
  };

  if (!canAccess) return null;

  if (!isOpen) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 z-50 flex h-6 w-6 animate-bounce items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md">
            {unreadCount > 9 ? '+9' : unreadCount}
          </div>
        )}
        <Button className="h-14 w-14 rounded-full shadow-lg" onClick={() => setIsOpen(true)}>
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`bg-background fixed z-50 flex flex-col overflow-hidden rounded-lg border shadow-xl transition-all duration-300 ${
        isExpanded ? 'inset-4 m-4 h-auto w-auto' : 'right-4 bottom-4 h-156.25 w-96'
      }`}
    >
      {/* Header logic remains same */}
      <div className="bg-card text-card-foreground flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Chat ao Vivo</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-card-foreground hover:bg-muted h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Reduzir' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-card-foreground hover:bg-muted h-6 w-6"
            onClick={() => setIsOpen(false)}
            title="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto scroll-smooth p-4"
        ref={scrollViewportRef}
        onScroll={handleScroll}
      >
        <div className="flex flex-col gap-4">
          {messages.map(msg => {
            const isSelf = msg.user_id === userId;
            const readers = getReaders(msg.id);
            const isRead = readers.length > 0;

            return (
              <Popover key={msg.id}>
                <PopoverTrigger asChild>
                  <div
                    className={`group flex cursor-pointer gap-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.profiles?.avatar_url || ''} />
                      <AvatarFallback>
                        {msg.profiles?.full_name?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex max-w-[85%] flex-col gap-1 ${
                        isSelf ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          {msg.profiles?.full_name}
                        </span>
                        {/* Role badges logic simplified for brevity but kept same */}
                        {msg.profiles?.role === 'admin' && (
                          <Badge className="h-4 border-none bg-red-600 px-1 text-[10px] text-white hover:bg-red-700">
                            Admin
                          </Badge>
                        )}
                        {msg.profiles?.role === 'editor' && (
                          <Badge className="h-4 border-none bg-blue-600 px-1 text-[10px] text-white hover:bg-blue-700">
                            Editor
                          </Badge>
                        )}
                        {msg.profiles?.role === 'supporter' && (
                          <Badge
                            variant="outline"
                            className="border-primary text-primary h-4 px-1 text-[10px]"
                          >
                            Apoiador
                          </Badge>
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-2 text-sm ${
                          isSelf ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}
                      >
                        {renderMessageContent(msg)}
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground text-[10px]">
                          {new Date(msg.created_at).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                        {isSelf && (
                          <span
                            className={`ml-1 ${isRead ? 'text-blue-500' : 'text-muted-foreground'}`}
                          >
                            <CheckCheck className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                {readers.length > 0 && (
                  <PopoverContent className="w-auto p-2 text-xs">
                    <p className="mb-1 font-semibold">Lido por:</p>
                    <ul className="list-disc pl-4">
                      {readers.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </PopoverContent>
                )}
              </Popover>
            );
          })}
        </div>
      </div>

      {/* Typing & Upload Indicator */}
      {(typingUsers.size > 0 || isUploading) && (
        <div className="text-muted-foreground animate-pulse px-4 py-1 text-xs">
          {isUploading
            ? 'Enviando arquivo...'
            : `${Array.from(typingUsers).join(', ')} ${typingUsers.size > 1 ? 'estão' : 'está'} digitando...`}
        </div>
      )}

      {/* Input */}
      <div className="bg-background border-t p-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,audio/*,.pdf,.doc,.docx"
            title="Upload File"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || isUploading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
