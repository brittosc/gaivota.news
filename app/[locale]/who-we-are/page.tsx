import { Metadata } from 'next';

import { Zap, Globe, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quem Somos',
  description: 'Conheça a história e a missão da Gaivota News.',
};

export default function WhoWeArePage() {
  // const t = useTranslations('WhoWeAre');

  return (
    <div className="bg-background text-foreground selection:bg-primary/20 min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 sm:py-32">
        <div className="bg-primary/5 absolute top-1/2 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl md:text-7xl">
              Somos a <span className="text-primary">Gaivota News</span>.
            </h1>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              Jornalismo independente, tecnológico e comprometido com a verdade. Nascemos na era
              digital para trazer clareza em tempos de ruído.
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="group bg-card relative overflow-hidden rounded-2xl border p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-block rounded-lg bg-orange-500/10 p-3">
              <Zap className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Inovação Constante</h3>
            <p className="text-muted-foreground">
              Utilizamos a tecnologia para entregar notícias mais rápido e com maior profundidade.
            </p>
          </div>
          <div className="group bg-card relative overflow-hidden rounded-2xl border p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3">
              <Globe className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Alcance Global</h3>
            <p className="text-muted-foreground">
              Histórias locais com perspectiva global. Entendemos como o mundo afeta nossa
              comunidade.
            </p>
          </div>
          <div className="group bg-card relative overflow-hidden rounded-2xl border p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-block rounded-lg bg-emerald-500/10 p-3">
              <Award className="h-6 w-6 text-emerald-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Excelência Editorial</h3>
            <p className="text-muted-foreground">
              Curadoria rigorosa e fact-checking avançado. A verdade é nossa única moeda.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nossa História</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Fundada com a missão de redefinir o jornalismo local, a Gaivota News começou como um
                pequeno blog e se transformou em uma plataforma multimídia. Acreditamos que a
                informação de qualidade é um direito fundamental.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Nossa equipe é formada por jornalistas, desenvolvedores e criativos que compartilham
                a mesma paixão: contar histórias que transformam.
              </p>
            </div>
            <div className="bg-muted aspect-video w-full flex-1 overflow-hidden rounded-2xl object-cover shadow-2xl lg:aspect-square">
              {/* Placeholder for an image */}
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-950 text-zinc-700">
                <Globe className="h-32 w-32 opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
