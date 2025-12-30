'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { resend } from '@/lib/mail';

export async function subscribeToNewsletter(
  prevState: { message: string; success: boolean },
  formData: FormData
) {
  console.log('--- START SUBSCRIBE ---', formData.get('email'));
  const email = formData.get('email') as string;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    console.log('Email inválido:', email);
    return { success: false, message: 'Email inválido.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('newsletter_subscribers').insert([{ email, active: true }]);

  if (error) {
    if (error.code === '23505') {
      return { success: false, message: 'Email já cadastrado.' };
    }
    return { success: false, message: 'Erro ao cadastrar. Tente novamente.' };
  }

  // Send welcome email
  let debugInfo = '';
  if (process.env.RESEND_API_KEY) {
    try {
      console.log('Tentando enviar email para:', email);

      const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://gaivota.news';
      const unsubscribeUrl = `${domain}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

      const data = await resend.emails.send({
        from: 'Gaivota News <onboarding@resend.dev>',
        to: email,
        subject: 'Bem-vindo à Gaivota News! 🌊',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Bem-vindo à Gaivota News</title>
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
                .features { background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 30px; }
                .feature-item { margin-bottom: 12px; }
                .icon { font-size: 20px; vertical-align: middle; margin-right: 10px; display: inline-block; }
                .feature-text { vertical-align: middle; display: inline-block; }
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
                        <!-- Header -->
                        <div class="header">
                          <a href="${domain}" class="logo">Gaivota News 🌊</a>
                        </div>
                        
                        <!-- Content -->
                        <div class="content">
                          <h1 class="h1">Bem-vindo(a) a bordo!</h1>
                          <p class="text">Olá,</p>
                          <p class="text">Obrigado por se inscrever na nossa newsletter. É um prazer ter você conosco na comunidade <strong>Gaivota News</strong>.</p>
                          
                          <div class="features">
                            <p style="margin: 0; font-weight: 600; color: #0f172a; margin-bottom: 10px;">O que você vai encontrar:</p>
                            <div class="feature-item">
                              <span class="icon">📰</span> <span class="feature-text">Notícias locais atualizadas</span>
                            </div>
                            <div class="feature-item">
                              <span class="icon">🌊</span> <span class="feature-text">Cobertura de eventos da região</span>
                            </div>
                            <div class="feature-item">
                              <span class="icon">📸</span> <span class="feature-text">Galerias de fotos exclusivas</span>
                            </div>
                            <div class="feature-item">
                              <span class="icon">🎁</span> <span class="feature-text">Promoções e avisos em primeira mão</span>
                            </div>
                          </div>

                          <p class="text">Acesse nosso site para ver as últimas manchetes agora mesmo.</p>
                          
                          <div class="btn-container">
                            <a href="${domain}" class="btn">Acessar Portal de Notícias</a>
                          </div>
                          
                          <p class="text">Atenciosamente,<br><strong>Equipe Gaivota News</strong></p>
                        </div>

                        <!-- Footer -->
                        <div class="footer">
                          <p>© ${new Date().getFullYear()} Gaivota News. Balneário Gaivota, SC.</p>
                          <p style="margin-top: 10px;">
                            Você recebeu este email porque se cadastrou em nosso site.<br>
                            <a href="${unsubscribeUrl}" class="unsubscribe">Não quero mais receber emails</a>
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
      });
      console.log('Email enviado:', data);
      debugInfo = ' | Email SENT: ' + (data.error ? JSON.stringify(data.error) : 'OK');
    } catch (emailError: unknown) {
      console.error('Erro ao enviar email de boas-vindas:', emailError);
      debugInfo = ' | Email ERROR: ' + (emailError as Error).message;
    }
  } else {
    console.warn('RESEND_API_KEY não definida. Email de boas-vindas não enviado.');
    debugInfo = ' | NO API KEY';
  }

  revalidatePath('/admin');
  return { success: true, message: 'Inscrito com sucesso! Verifique seu email.' + debugInfo };
}

export async function sendCustomNewsletter(formData: FormData) {
  const subject = formData.get('subject') as string;
  const content = formData.get('content') as string;
  const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://gaivota.news';

  if (!subject || !content) {
    return { success: false, message: 'Assunto e conteúdo são obrigatórios.' };
  }

  // 1. Fetch active subscribers
  const adminSupabase = createAdminClient();
  const { data: subscribers, error: subError } = await adminSupabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('active', true);

  if (subError || !subscribers || subscribers.length === 0) {
    return { success: false, message: 'Nenhum assinante ativo encontrado.' };
  }

  // 2. Content is already HTML from Rich Text Editor
  const formattedContent = content;

  // 3. Send Emails
  let successCount = 0;
  try {
    const emailPromises = subscribers.map(sub => {
      const unsubscribeUrl = `${domain}/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}`;

      return resend.emails.send({
        from: 'Gaivota News <onboarding@resend.dev>',
        to: sub.email,
        subject: subject,
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
                          <h1 class="h1">${subject}</h1>
                          ${formattedContent}
                          <p class="text">Atenciosamente,<br><strong>Equipe Gaivota News</strong></p>
                        </div>
                        <div class="footer">
                          <p>© ${new Date().getFullYear()} Gaivota News. Balneário Gaivota, SC.</p>
                          <p style="margin-top: 10px;">
                            <a href="${unsubscribeUrl}" class="unsubscribe">Não quero mais receber emails</a>
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
      });
    });

    await Promise.all(emailPromises);
    successCount = subscribers.length;
  } catch (error) {
    console.error('Erro ao enviar newsletter:', error);
    return { success: false, message: 'Erro ao enviar e-mails.' };
  }

  revalidatePath('/admin');
  return { success: true, message: `Email enviado para ${successCount} assinantes!` };
}

export async function deleteSubscriber(id: string) {
  // Use regular client for Auth check
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'Não autorizado.' };

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'editor') {
    return { success: false, message: 'Não autorizado.' };
  }

  const { error } = await adminSupabase.from('newsletter_subscribers').delete().eq('id', id);

  if (error) {
    return { success: false, message: 'Erro ao remover assinante.' };
  }

  revalidatePath('/admin/newsletter');
  return { success: true, message: 'Assinante removido com sucesso.' };
}

export async function deleteSubscribers(ids: string[]) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, message: 'Não autorizado.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'editor') {
    return { success: false, message: 'Não autorizado.' };
  }

  const { error } = await adminSupabase.from('newsletter_subscribers').delete().in('id', ids);

  if (error) {
    return { success: false, message: 'Erro ao remover assinantes.' };
  }

  revalidatePath('/admin/newsletter');
  return { success: true, message: 'Assinantes removidos com sucesso.' };
}

export async function unsubscribeFromNewsletter(email: string) {
  const adminSupabase = createAdminClient();

  // Directly delete using admin client (no auth required for unsubscribe, usually secured by token but simple email match here)
  const { error } = await adminSupabase.from('newsletter_subscribers').delete().eq('email', email);

  if (error) {
    return { success: false, message: 'Erro ao cancelar inscrição. Tente novamente.' };
  }

  return { success: true, message: 'Inscrição cancelada com sucesso.' };
}
