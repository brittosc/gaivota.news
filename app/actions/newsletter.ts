import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { resend } from '@/lib/mail';

export async function subscribeToNewsletter(
  prevState: { message: string; success: boolean },
  formData: FormData
) {
  const email = formData.get('email') as string;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
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
  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: 'Gaivota News <nao-responda@grupobritto.com.br>',
        to: email,
        subject: 'Bem-vindo à Gaivota News!',
        html: `
          <h1>Obrigado por se inscrever!</h1>
          <p>Ficamos felizes em ter você conosco. A partir de agora, você receberá nossas principais notícias em primeira mão.</p>
          <p>Atenciosamente,<br>Equipe Gaivota News</p>
        `,
      });
    } catch (emailError) {
      console.error('Erro ao enviar email de boas-vindas:', emailError);
      // Don't fail the subscription if email fails, just log it
    }
  }

  revalidatePath('/admin');
  return { success: true, message: 'Inscrito com sucesso! Verifique seu email.' };
}
