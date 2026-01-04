import { RefreshCcw, AlertCircle, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CorrectionsPolicyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <RefreshCcw className="h-6 w-6" />
          </div>
          <h1 className="from-foreground to-muted-foreground mb-6 bg-linear-to-br bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-6xl">
            Política de Correções
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Errar é humano. Corrigir com transparência é nosso dever jornalístico.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm transition-colors hover:border-orange-500/30">
            <CardContent className="p-8">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Erros Factuais</h3>
              <p className="text-muted-foreground leading-relaxed">
                Quando cometemos um erro de informação, corrigimos o texto imediatamente e
                adicionamos uma nota de correção (&quot;Errata&quot;) no rodapé do artigo,
                detalhando o que estava incorreto, a informação correta e a data da alteração.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 backdrop-blur-sm transition-colors hover:border-orange-500/30">
            <CardContent className="p-8">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Erros Menores</h3>
              <p className="text-muted-foreground leading-relaxed">
                Erros de digitação, gramática ou ortografia que não alteram o sentido da reportagem
                são corrigidos diretamente, sem a necessidade de uma nota explicativa, para manter a
                fluidez da leitura garantindo a qualidade.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/30 mt-12 rounded-2xl border p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold">Encontrou um erro?</h3>
          <p className="text-muted-foreground mb-4">
            Ajude-nos a manter a precisão. Envie detalhes para nossa equipe de verificação.
          </p>
          <a
            href="mailto:correcoes@gaivotanews.com"
            className="font-bold text-orange-500 hover:underline"
          >
            correcoes@gaivotanews.com
          </a>
        </div>
      </div>
    </div>
  );
}
