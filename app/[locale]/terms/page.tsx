import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Terms' });
  return {
    title: t('title'),
  };
}

export default function TermsPage() {
  const t = useTranslations('Terms');

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Termos de Uso</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="mb-3 text-xl font-semibold">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o Gaivota News, você concorda com estes termos de uso. Nosso objetivo
            é fornecer notícias verificadas e relevantes para a comunidade.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">2. Nossa Missão e Isenção</h2>
          <p>
            Trabalhamos de forma independente para distribuir notícias verdadeiras. Não temos
            compromisso com partidos políticos, grupos econômicos ou quaisquer entidades que possam
            influenciar nossa linha editorial. Nossa prioridade é a verdade dos fatos.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">3. Propriedade Intelectual e Correções</h2>
          <p>
            Respeitamos os direitos de imagem e propriedade intelectual. Se alguma imagem ou texto
            estiver incorreto ou infringir direitos, comprometemo-nos a analisar e, se necessário,
            remover o conteúdo mediante solicitação justificada.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">4. Responsabilidade do Usuário</h2>
          <p>
            Os usuários devem utilizar as informações obtidas no site de forma responsável.
            Comentários e interações (se disponíveis) devem manter o respeito e a civilidade.
          </p>
        </section>
      </div>
    </div>
  );
}
