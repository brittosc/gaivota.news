export const runtime = 'edge';

import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Planos',
  description: 'Escolha o plano ideal para você.',
};

export default function PricingPage() {
  const t = useTranslations('PricingPage');

  const tiers = [
    {
      id: 'basic',
      price: '7,99',
      nameKey: 'basic.name',
      descKey: 'basic.description',
      features: ['basic.feature1', 'basic.feature2', 'basic.feature3'],
    },
    {
      id: 'pro',
      price: '19,99',
      nameKey: 'pro.name',
      descKey: 'pro.description',
      features: ['pro.feature1', 'pro.feature2', 'pro.feature3', 'pro.feature4'],
      highlight: true,
    },
    {
      id: 'elite',
      price: '49,99',
      nameKey: 'elite.name',
      descKey: 'elite.description',
      features: ['elite.feature1', 'elite.feature2', 'elite.feature3', 'elite.feature4'],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">{t('subtitle')}</p>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
        {tiers.map(tier => (
          <Card
            key={tier.id}
            className={`flex flex-col ${tier.highlight ? 'border-primary z-10 scale-105 shadow-lg' : 'border-zinc-200 dark:border-zinc-800'}`}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{t(tier.nameKey)}</CardTitle>
              <CardDescription>{t(tier.descKey)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ {tier.price}</span>
                <span className="text-muted-foreground ml-1 text-sm">/{t('monthly')}</span>
              </div>
              <ul className="space-y-3">
                {tier.features.map(featureKey => (
                  <li key={featureKey} className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">
                      {t(featureKey)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.highlight ? 'default' : 'outline'}>
                {t('subscribe')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
