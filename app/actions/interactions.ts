'use server';

import { createClient } from '@/lib/supabase/server';
// import { revalidatePath } from 'next/cache';

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Você precisa estar logado para curtir.' };
  }

  // Check if liked
  const { data: existingLike } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existingLike) {
    // Delete like
    const { error } = await supabase.from('post_likes').delete().eq('id', existingLike.id);
    if (error) return { success: false, message: 'Erro ao remover like.' };
    return { success: true, liked: false };
  } else {
    // Insert like
    const { error } = await supabase
      .from('post_likes')
      .insert([{ post_id: postId, user_id: user.id }]);
    if (error) return { success: false, message: 'Erro ao adicionar like.' };
    return { success: true, liked: true };
  }
}
