'use server';

import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/lib/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

// Helper to get typed client to avoid inference issues
async function createClient(): Promise<SupabaseClient<Database>> {
  return createSupabaseServerClient();
}

export async function archivePost(postId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('posts').update({ archived: true }).eq('id', postId);

  if (error) return { success: false, message: 'Erro ao arquivar.' };
  revalidatePath('/admin');
  return { success: true };
}

export async function hidePost(postId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('posts').update({ published: false }).eq('id', postId);

  if (error) return { success: false, message: 'Erro ao ocultar.' };
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function restorePost(postId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('posts').update({ archived: false }).eq('id', postId);

  if (error) return { success: false, message: 'Erro ao restaurar.' };
  revalidatePath('/admin');
  return { success: true };
}

import { resend, domain } from '@/lib/mail';

export async function publishPost(postId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('posts').update({ published: true }).eq('id', postId);

  if (error) return { success: false, message: 'Erro ao publicar.' };

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function sendPostNewsletter(postId: string) {
  const supabase = await createClient();

  // 1. Fetch post and check status
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (postError || !post) {
    return { success: false, message: 'Post não encontrado.' };
  }

  if (!post.published) {
    return { success: false, message: 'Post precisa estar publicado.' };
  }

  if (post.newsletter_sent_at) {
    return { success: false, message: 'Newsletter já enviada para este post.' };
  }

  // 2. Fetch active subscribers
  const { data: subscribers, error: subError } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('active', true);

  if (subError || !subscribers || subscribers.length === 0) {
    return { success: false, message: 'Nenhum assinante ativo encontrado.' };
  }

  // 3. Send Emails
  const emailSubject = `Novo Post: ${post.title}`;
  const emailLink = `${domain}/${post.slug}`;
  let successCount = 0;

  try {
    // Loop through subscribers directly (simplest for now)
    // For production with many users, consider 'resend.batch.send' or a queue.
    const emailPromises = subscribers.map(sub =>
      resend.emails.send({
        from: 'Gaivota News <nao-responda@grupobritto.com.br>', // Ensure this domain is verified in Resend
        to: sub.email,
        subject: emailSubject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>${post.title}</h1>
            <p>Um novo artigo foi publicado no Gaivota News!</p>
            <p style="margin: 20px 0;">
              <a href="${emailLink}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Ler Agora
              </a>
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 30px;">
              Você está recebendo este email porque se inscreveu em nossa newsletter.
            </p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);
    successCount = subscribers.length; // Assume all success if Promise.all doesn't throw, or handle individual failures
  } catch (error) {
    console.error('Erro ao enviar newsletter:', error);
    // Even if some fail, we might want to mark as sent or handle partial failure.
    // For now, if major failure, don't mark as sent.
    return { success: false, message: 'Erro ao enviar e-mails.' };
  }

  // 4. Update newsletter_sent_at
  await supabase
    .from('posts')
    .update({ newsletter_sent_at: new Date().toISOString() })
    .eq('id', postId);

  revalidatePath('/admin');
  return { success: true, message: `Newsletter enviada para ${successCount} assinantes!` };
}
