'use server';

import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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

  // if (post.newsletter_sent_at) {
  //   return { success: false, message: 'Newsletter já enviada para este post.' };
  // }

  // 2. Fetch active subscribers
  const adminSupabase = createAdminClient();
  const { data: subscribers, error: subError } = await adminSupabase
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
        from: 'Gaivota News <onboarding@resend.dev>',
        to: sub.email,
        subject: emailSubject,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
                table { border-collapse: collapse; width: 100%; }
                .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; }
                .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
                .header { background-color: #0f172a; padding: 30px 20px; text-align: center; }
                .logo { color: #ffffff; font-size: 28px; font-weight: 700; text-decoration: none; letter-spacing: 0.5px; }
                .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
                .h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 20px; }
                .text { font-size: 16px; margin-bottom: 20px; }
                .btn-container { text-align: center; margin: 30px 0; }
                .btn { background-color: #2563eb; color: #ffffff !important; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s; }
                .btn:hover { background-color: #1d4ed8; }
                .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
                .unsubscribe { color: #64748b; text-decoration: underline; margin-top: 10px; display: inline-block; }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <br>
                      <div class="main">
                        <div class="header">
                          <a href="${domain}" class="logo">Gaivota News 🌊</a>
                        </div>
                        <div class="content">
                          <h1 class="h1">${post.title}</h1>
                          <p class="text">Olá,</p>
                          <p class="text">Um novo artigo acabou de ser publicado no <strong>Gaivota News</strong> e achamos que você vai gostar.</p>
                          <p class="text">Confira os detalhes clicando no botão abaixo:</p>
                          
                          <div class="btn-container">
                            <a href="${emailLink}" class="btn">Ler Notícia Completa</a>
                          </div>
                          
                          <p class="text">Boa leitura,<br><strong>Equipe Gaivota News</strong></p>
                        </div>
                        <div class="footer">
                          <p>© ${new Date().getFullYear()} Gaivota News. Balneário Gaivota, SC.</p>
                          <p style="margin-top: 10px;">
                            <a href="${domain}/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}" class="unsubscribe">Não quero mais receber emails</a>
                          </p>
                        </div>
                      </div>
                      <br>
                    </td>
                  </tr>
                </table>
              </div>
            </body>
          </html>
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
