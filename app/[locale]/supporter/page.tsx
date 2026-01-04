'use client';

import Link from 'next/link';
import { Shield, Zap, Crown, Lock, Rocket, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SupporterPage() {
  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-purple-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute top-0 left-1/2 -ml-[50vw] h-125 w-screen bg-linear-to-b from-purple-500/10 to-transparent opacity-50 blur-[100px]" />

        <div className="relative container mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="mb-6 border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm tracking-widest text-purple-500 uppercase backdrop-blur-md"
          >
            Programa de Apoiadores
          </Badge>

          <h1 className="from-foreground animate-in fade-in slide-in-from-bottom-4 mx-auto mb-6 max-w-4xl bg-linear-to-r via-purple-500 to-blue-500 bg-clip-text text-5xl font-black tracking-tighter text-transparent duration-1000 sm:text-7xl">
            Junte-se à Elite da Informação
          </h1>

          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl leading-relaxed">
            Apoie o jornalismo independente e tecnológico. Desbloqueie recursos exclusivos,
            navegação criptografada e acesso direto à nossa redação.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
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
      </div>

      {/* Feature Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="group bg-card relative overflow-hidden rounded-3xl border border-white/10 p-8 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 dark:bg-zinc-900/50">
            <div className="absolute inset-0 bg-linear-to-br from-purple-600/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-500 shadow-sm">
              <Shield className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Jornalismo Blindado</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sua contribuição garante nossa total independência editorial de grandes corporações e
              interesses políticos. Verdade, doa a quem doer.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-card relative overflow-hidden rounded-3xl border border-white/10 p-8 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 dark:bg-zinc-900/50">
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-500 shadow-sm">
              <Lock className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Privacidade Total</h3>
            <p className="text-muted-foreground leading-relaxed">
              Navegue sem rastreadores abusivos. Apoiadores têm acesso a uma versão do site
              otimizada para máxima privacidade e velocidade.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-card relative overflow-hidden rounded-3xl border border-white/10 p-8 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 dark:bg-zinc-900/50">
            <div className="absolute inset-0 bg-linear-to-br from-amber-600/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-500 shadow-sm">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Acesso Antecipado</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receba furos de reportagem, podcasts e newsletters exclusivas antes do público geral.
              Esteja sempre um passo à frente.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing/Support Options */}
      <div id="plans" className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Escolha seu legado
            </h2>
            <p className="text-muted-foreground text-lg">
              Todo apoio é vital. Escolha a modalidade que melhor se adapta à sua jornada.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Simple Plan - R$ 7,99 */}
            <Card className="border-border bg-muted/40 relative overflow-hidden transition-transform hover:scale-[1.02]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold">Guardião Simples</CardTitle>
                <CardDescription className="text-base">Apoio essencial</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black">R$ 7,99</span>
                  <span className="text-muted-foreground ml-2">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <ul className="text-muted-foreground mb-8 list-inside list-disc space-y-4">
                  <li>Sem anúncios</li>
                  <li>Badge básico de Apoiador</li>
                </ul>
                <Button
                  variant="outline"
                  className="group h-12 w-full rounded-xl text-lg hover:bg-white/5"
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
              </CardContent>
            </Card>

            {/* Monthly Plan */}
            <Card className="border-border relative overflow-hidden transition-transform hover:scale-[1.02]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold">Guardião Mensal</CardTitle>
                <CardDescription className="text-base">Flexibilidade total</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black">R$ 29</span>
                  <span className="text-muted-foreground ml-2">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <ul className="mb-8 space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" /> Acesso ilimitado ao portal
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" /> Badge de Apoiador nos
                    comentários
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" /> Newsletter Matinal
                    exclusiva
                  </li>
                </ul>
                <Button className="group h-12 w-full rounded-xl text-lg" asChild>
                  <a
                    href="https://wa.me/5511999999999?text=Quero%20ser%20apoiaador%20mensal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Assinar Mensal{' '}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card className="relative overflow-hidden border-purple-500/50 shadow-2xl shadow-purple-500/10 transition-transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 rounded-bl-lg bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                MELHOR VALOR
              </div>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                  Guardião Anual <Sparkles className="h-5 w-5 text-amber-400" />
                </CardTitle>
                <CardDescription className="text-base">Comprometimento máximo</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-black">R$ 290</span>
                  <span className="text-muted-foreground ml-2">/ano</span>
                </div>
                <p className="mt-1 text-sm font-medium text-green-500">Economize 2 meses</p>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <ul className="mb-8 space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" />{' '}
                    <strong>Todos os benefícios do mensal</strong>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" /> Acesso ao Grupo Secreto no
                    WhatsApp
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" /> Convites para eventos
                    presenciais
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" /> Relatório anual de impacto
                  </li>
                </ul>
                <Button
                  className="group h-12 w-full rounded-xl border-0 bg-linear-to-r from-purple-600 to-blue-600 text-lg hover:from-purple-700 hover:to-blue-700"
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ/Additional Info */}
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Sua contribuição é processada com segurança. Você pode cancelar a qualquer momento.
          <br />
          Dúvidas? Entre em contato com nosso{' '}
          <Link href="/contact" className="text-primary hover:underline">
            suporte
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
