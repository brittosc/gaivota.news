import { Gavel } from 'lucide-react';

export default function RightOfReplyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Gavel className="h-6 w-6" />
          </div>
          <h1 className="from-foreground to-muted-foreground mb-6 bg-linear-to-br bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-6xl">
            Direito de Resposta
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Garantindo o equilíbrio e a justiça na informação pública.
          </p>
        </div>

        <div className="relative">
          <div className="bg-border absolute top-0 bottom-0 left-8 w-px md:left-1/2 md:-ml-px" />

          {/* Step 1 */}
          <div className="relative z-10 mb-12 md:grid md:grid-cols-2 md:items-center md:gap-12">
            <div className="mb-4 md:mb-0 md:text-right">
              <h3 className="text-foreground text-2xl font-bold">Solicitação</h3>
              <p className="text-muted-foreground mt-2">
                Envie sua solicitação para{' '}
                <span className="font-medium text-blue-500">juridico@gaivotanews.com</span> com o
                assunto &quot;Direito de Resposta&quot;, identificando a matéria e o trecho
                contestado.
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-start">
              <div className="border-background flex h-16 w-16 items-center justify-center rounded-full border-4 bg-blue-500 text-white shadow-lg">
                1
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 mb-12 md:grid md:grid-cols-2 md:items-center md:gap-12">
            <div className="hidden items-center justify-end md:flex">
              <div className="border-background flex h-16 w-16 items-center justify-center rounded-full border-4 bg-blue-500 text-white shadow-lg">
                2
              </div>
            </div>
            <div className="pl-20 md:pl-0">
              {' '}
              {/* Mobile padding adjustment */}
              <h3 className="text-foreground text-2xl font-bold">Análise</h3>
              <p className="text-muted-foreground mt-2">
                Nosso conselho editorial e departamento jurídico analisarão o pedido em até 48 horas
                úteis, verificando a fundamentação, proporcionalidade e veracidade dos fatos.
              </p>
            </div>
            {/* Mobile icon */}
            <div className="absolute top-0 left-0 flex items-center justify-start md:hidden">
              <div className="border-background flex h-16 w-16 items-center justify-center rounded-full border-4 bg-blue-500 text-white shadow-lg">
                2
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 md:grid md:grid-cols-2 md:items-center md:gap-12">
            <div className="mb-4 md:mb-0 md:text-right">
              <h3 className="text-foreground text-2xl font-bold">Publicação</h3>
              <p className="text-muted-foreground mt-2">
                Sendo procedente, a resposta será publicada com o mesmo destaque, publicidade e
                dimensão da matéria que a ensejou, garantindo a reparação adequada.
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-start">
              <div className="border-background flex h-16 w-16 items-center justify-center rounded-full border-4 bg-blue-500 text-white shadow-lg">
                3
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 rounded-lg border border-blue-500/10 bg-blue-500/5 p-6 text-center">
          <p className="text-sm text-blue-400">
            Em conformidade com a Constituição Federal e Lei nº 13.188/2015.
          </p>
        </div>
      </div>
    </div>
  );
}
