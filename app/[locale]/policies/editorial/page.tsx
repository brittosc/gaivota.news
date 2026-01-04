import { Scale } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function EditorialPolicyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl">
            <Scale className="h-6 w-6" />
          </div>
          <h1 className="from-foreground to-muted-foreground mb-6 bg-linear-to-br bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-6xl">
            Política Editorial
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Nossos princípios inegociáveis. O alicerce da nossa integridade jornalística.
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="bg-card/50 border-primary/10 overflow-hidden backdrop-blur-sm">
            <div className="bg-primary/5 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full p-32 blur-[80px]" />
            <CardContent className="relative p-8 md:p-12">
              <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                <span className="text-primary border-primary/20 rounded-full border px-3 py-1 font-mono text-sm tracking-widest uppercase">
                  01
                </span>
                Independência
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                A Gaivota News não aceita pagamentos em troca de cobertura favorável. Nossas pautas,
                investigações e opiniões são determinadas exclusivamente pelo nosso conselho
                editorial, livres de influências comerciais, políticas ou de doadores.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/10 overflow-hidden backdrop-blur-sm">
            <CardContent className="relative p-8 md:p-12">
              <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                <span className="text-primary border-primary/20 rounded-full border px-3 py-1 font-mono text-sm tracking-widest uppercase">
                  02
                </span>
                Precisão
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                A verdade é nossa moeda mais valiosa. Verificamos exaustivamente fatos, dados e
                citações antes da publicação. Utilizamos múltiplas fontes e documentos primários
                sempre que possível para garantir a exatidão da informação.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/10 overflow-hidden backdrop-blur-sm">
            <CardContent className="relative p-8 md:p-12">
              <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold">
                <span className="text-primary border-primary/20 rounded-full border px-3 py-1 font-mono text-sm tracking-widest uppercase">
                  03
                </span>
                Imparcialidade
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Buscamos ativamente ouvir e representar diversas perspectivas. Damos espaço justo
                para o contraditório e tratamos todas as fontes e temas com a mesma objetividade e
                respeito, evitando preconceitos ou sensacionalismo.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
