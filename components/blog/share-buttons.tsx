'use client';

import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Twitter, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  title: string;
  url: string; // We'll reconstruct full URL if needed or pass path
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Link copiado!');
    } catch {
      toast.error('Erro ao copiar link.');
    }
  };

  const shareLinks = [
    {
      name: 'Copiar Link',
      icon: LinkIcon,
      action: copyToClipboard,
      variant: 'outline' as const,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const text = encodeURIComponent(`Confira este post: ${title} ${fullUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      },
      variant: 'outline' as const,
    },
    {
      name: 'X',
      icon: Twitter,
      action: () => {
        const text = encodeURIComponent(`Confira este post: ${title}`);
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`,
          '_blank'
        );
      },
      variant: 'outline' as const,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
          '_blank'
        );
      },
      variant: 'outline' as const,
    },
    {
      name: 'Instagram',
      icon: Instagram,
      action: () => {
        // Instagram doesn't have a direct web share for posts easily, usually people just copy link
        copyToClipboard();
        toast.info('Link copiado! O Instagram não permite compartilhamento direto via web.');
      },
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map(link => (
        <Button
          key={link.name}
          variant={link.variant}
          size="icon"
          onClick={link.action}
          title={link.name}
          className="h-8 w-8"
        >
          <link.icon className="h-4 w-4" />
          <span className="sr-only">{link.name}</span>
        </Button>
      ))}
    </div>
  );
}
