'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { unsubscribeFromNewsletter } from '@/app/actions/newsletter';
import { toast } from 'sonner';
import { Loader2, MailMinus } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [loading, setLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const result = await unsubscribeFromNewsletter(email);
      if (result.success) {
        setUnsubscribed(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Erro ao processar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  if (unsubscribed) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-l-4 border-l-green-500 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <MailMinus className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Inscrição Cancelada</CardTitle>
            <CardDescription>Você não receberá mais nossos emails.</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-500">
            Sentiremos sua falta! Se mudar de ideia, você pode se inscrever novamente a qualquer
            momento em nosso site.
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/">Voltar para Início</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <MailMinus className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle>Cancelar Inscrição</CardTitle>
          <CardDescription>
            Confirmar o cancelamento para: <br />
            <span className="text-foreground font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-gray-500">
          Você deixará de receber nossas atualizações regionais, notícias exclusivas e destaques
          semanais.
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleUnsubscribe}
            disabled={loading || !email}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Confirmar Cancelamento'
            )}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Cancelar e Voltar</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
