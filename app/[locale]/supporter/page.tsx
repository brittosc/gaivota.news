'use client';

import {
  Shield,
  Zap,
  Crown,
  Lock,
  Rocket,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SupporterPage() {
  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-purple-500/30">
      {/* Hero Section */}
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-24 lg:py-32">
        <div className="absolute top-0 left-1/2 -ml-[50vw] h-125 w-screen bg-linear-to-b from-purple-500/10 to-transparent opacity-50 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-125 w-screen bg-linear-to-t from-blue-500/10 to-transparent opacity-30 blur-[100px]" />

        <div className="relative container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
            {/* Left Column: Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <Badge
                variant="outline"
                className="mb-6 border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm tracking-widest text-purple-500 uppercase backdrop-blur-md"
              >
                Programa de Apoiadores
              </Badge>

              <h1 className="from-foreground animate-in fade-in slide-in-from-bottom-4 mb-6 bg-linear-to-r via-purple-500 to-blue-500 bg-clip-text text-5xl font-black tracking-tighter text-transparent duration-1000 sm:text-7xl">
                Junte-se à Elite da Informação
              </h1>

              <p className="text-muted-foreground mb-10 text-xl leading-relaxed">
                Apoie o jornalismo independente e tecnológico. Desbloqueie recursos exclusivos,
                navegação criptografada e acesso direto à nossa redação.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  className="h-14 rounded-full border-0 bg-linear-to-r from-purple-600 to-blue-600 px-8 text-lg shadow-lg shadow-purple-500/20 hover:from-purple-700 hover:to-blue-700"
                  asChild
                >
                  <a href="#plans">
                    <Crown className="mr-2 h-5 w-5" />
                    Torne-se um Guardião
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full border-2 px-8 text-lg"
                  asChild
                >
                  <a
                    href="https://wa.me/5511999999999?text=Tenho%20dúvidas%20sobre%20o%20apoio"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Falar com Concierge
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column: Benefits List */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="border-border bg-card/50 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-lg shadow-purple-500/10 backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1 text-lg font-bold">Jornalismo Blindado</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Sua contribuição garante nossa total independência editorial de grandes
                    corporações e interesses políticos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="border-border bg-card/50 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-lg shadow-blue-500/10 backdrop-blur-sm">
                  <Lock className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1 text-lg font-bold">Privacidade Total</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Navegue sem rastreadores abusivos. Apoiadores têm acesso a uma versão do site
                    otimizada para máxima privacidade.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="border-border bg-card/50 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-lg shadow-amber-500/10 backdrop-blur-sm">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1 text-lg font-bold">Acesso Antecipado</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Receba furos de reportagem, podcasts e newsletters exclusivas antes do público
                    geral.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-muted-foreground h-8 w-8 opacity-50" />
        </div>
      </div>

      {/* Pricing/Support Options */}
      <div
        id="plans"
        className="relative flex min-h-screen flex-col items-center justify-center border-t border-white/5 bg-[#0a0a0a] py-24"
      >
        {/* Tech Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute top-0 left-0 -ml-[50vw] h-125 w-screen bg-purple-500/10 opacity-30 blur-[120px]" />
        <div className="absolute right-0 bottom-0 -mr-[50vw] h-125 w-screen bg-blue-500/10 opacity-30 blur-[120px]" />

        <div className="relative container mx-auto px-4">
          <div className="mb-20 text-center">
            <h2 className="mb-6 bg-linear-to-br from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              Escolha seu legado
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-400">
              Todo apoio é vital. Escolha a modalidade que melhor se adapta à sua jornada.
            </p>
          </div>

          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
            {/* Simple Plan */}
            <div className="group relative rounded-3xl border border-white/5 bg-zinc-900/50 p-1 transition-all hover:-translate-y-2 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="h-full rounded-4xl bg-zinc-950/80 p-8 px-8 backdrop-blur-xl">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white">Guardião Simples</h3>
                  <p className="mt-2 text-sm text-zinc-400">Apoio essencial para começar</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-white">R$ 7,99</span>
                    <span className="text-zinc-500">/mês</span>
                  </div>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-purple-400">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <span className="text-zinc-300">Sem anúncios no portal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-purple-400">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <span className="text-zinc-300">Badge básico de Apoiador</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="group h-12 w-full rounded-xl border-white/10 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
                  asChild
                >
                  <a
                    href="https://wa.me/5511999999999?text=Quero%20ser%20apoiaador%20simples"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Assinar Simples{' '}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Monthly Plan */}
            <div className="group relative rounded-3xl border border-white/10 bg-linear-to-b from-zinc-800 to-zinc-900 p-1 transition-all hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute -top-3 right-0 left-0 z-10 mx-auto w-fit rounded-full border border-purple-500/30 bg-zinc-900 px-3 py-1 text-xs font-medium text-purple-400 backdrop-blur-md">
                MAIS POPULAR
              </div>
              <div className="h-full rounded-4xl bg-zinc-900/90 p-8 backdrop-blur-xl">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white">Guardião Mensal</h3>
                  <p className="mt-2 text-sm text-zinc-400">Flexibilidade e benefícios</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-white">R$ 29</span>
                    <span className="text-zinc-500">/mês</span>
                  </div>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-white">Acesso ilimitado ao portal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-white">Badge de Apoiador nos comentários</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-white">Newsletter Matinal exclusiva</span>
                  </div>
                </div>

                <Button
                  className="group h-12 w-full rounded-xl bg-white text-black hover:bg-zinc-200"
                  asChild
                >
                  <a
                    href="https://wa.me/5511999999999?text=Quero%20ser%20apoiaador%20mensal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Assinar Mensal{' '}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Annual Plan */}
            <div className="group relative rounded-3xl border border-purple-500/30 bg-linear-to-b from-purple-500/20 to-blue-600/20 p-1 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-purple-500/10 to-blue-600/10 blur-xl transition-opacity group-hover:opacity-100" />
              <div className="absolute -top-3 right-8 z-10 rounded-full bg-linear-to-r from-purple-600 to-blue-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                MELHOR VALOR
              </div>
              <div className="relative h-full rounded-4xl bg-zinc-950/80 p-8 backdrop-blur-xl">
                <div className="mb-8">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">Guardião Anual</h3>
                    <Crown className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">Experiência VIP completa</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-white">R$ 290</span>
                    <span className="text-zinc-500">/ano</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-emerald-400">Economize 2 meses</p>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium text-white">Todos benefícios do mensal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-zinc-300">Grupo Secreto no WhatsApp</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-zinc-300">Convites para eventos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-zinc-300">Relatório anual de impacto</span>
                  </div>
                </div>

                <Button
                  className="group h-12 w-full rounded-xl border-0 bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-blue-700"
                  asChild
                >
                  <a
                    href="https://wa.me/5511999999999?text=Quero%20ser%20apoiaador%20anual"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Assinar Anual{' '}
                    <Rocket className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
