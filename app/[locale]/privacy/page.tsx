import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Privacy' });
  return {
    title: t('title'),
  };
}

export default function PrivacyPage() {
  const t = useTranslations('Privacy');

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Política de Privacidade</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="mb-3 text-xl font-semibold">1. Compromisso com a Verdade</h2>
          <p>
            O Gaivota News tem como foco principal a distribuição de notícias verídicas e checadas.
            Nosso compromisso é com a informação precisa e com a comunidade, não possuindo vínculos
            que comprometam nossa isenção editorial.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">2. Uso de Imagens e Conteúdo</h2>
          <p>
            Utilizamos imagens e conteúdos com o propósito de informar. Caso você identifique alguma
            imagem ou informação que considere incorreta, inapropriada ou que viole direitos
            autorais, pedimos que entre em contato conosco imediatamente.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">3. Remoção de Conteúdo</h2>
          <p>
            Estamos abertos a retificações. Mediante solicitação e verificação, removeremos
            prontamente qualquer conteúdo que não esteja de acordo com nossa política de veracidade
            ou que infrinja direitos de terceiros.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">4. Contato</h2>
          <p>
            Para solicitações de remoção, correções ou dúvidas sobre nossa política de privacidade,
            por favor entre em contato através dos nossos canais de atendimento oficiais.
          </p>
        </section>
      </div>
    </div>
  );
}
