'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { sendCustomNewsletter } from '@/app/actions/newsletter';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/editor/rich-text-editor';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>Enviando...</>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> Enviar para Todos Assinantes
        </>
      )}
    </Button>
  );
}

export default function ComposeEmailPage() {
  const router = useRouter();
  const [content, setContent] = useState('');

  const handleSubmit = async (formData: FormData) => {
    const result = await sendCustomNewsletter(formData);
    if (result.success) {
      toast.success(result.message);
      router.push('/admin/newsletter');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/newsletter">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Campanha</CardTitle>
          <CardDescription>
            Envie um email personalizado para todos os assinantes da newsletter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Assunto do Email
              </label>
              <Input
                id="subject"
                name="subject"
                placeholder="Ex: Novidades da semana, Aviso Importante..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Conteúdo da Mensagem</label>
              <RichTextEditor content={content} onChange={setContent} />
              <input type="hidden" name="content" value={content} />
            </div>

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
