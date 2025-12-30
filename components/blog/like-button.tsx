'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/app/actions/interactions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  userId?: string;
}

export function LikeButton({ postId, initialLiked, initialCount, userId }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    if (!userId) {
      toast.error('Faça login para curtir este post.');
      return;
    }

    // Optimistic update
    const previousLiked = liked;
    const previousCount = count;
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setLoading(true);

    try {
      const result = await toggleLike(postId);
      if (!result.success) {
        // Revert
        setLiked(previousLiked);
        setCount(previousCount);
        toast.error(result.message);
      } else {
        // Confirm state
        setLiked(!!result.liked);
        router.refresh();
      }
    } catch {
      setLiked(previousLiked);
      setCount(previousCount);
      toast.error('Erro ao curtir.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('gap-2 hover:bg-transparent', liked && 'text-red-500 hover:text-red-600')}
      onClick={handleLike}
      disabled={loading}
    >
      <Heart className={cn('h-5 w-5 transition-all', liked && 'scale-110 fill-current')} />
      <span>{count}</span>
    </Button>
  );
}
