'use client';

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  title: string;
  url: string; // We'll reconstruct full URL if needed or pass path
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Confira este post: ${title}`,
          url: fullUrl,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error('Erro ao compartilhar.');
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(fullUrl);
        toast.success('Link copiado para a área de transferência!');
      } catch {
        toast.error('Não foi possível copiar o link.');
      }
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Confira este post: ${title} ${fullUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Compartilhar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsApp}
        className="hidden sm:inline-flex"
      >
        WhatsApp
      </Button>
    </div>
  );
}
