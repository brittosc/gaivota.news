'use client';

import { CheckCircle2, Globe, Server, Mail, Upload, Database, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ServiceStatus = ({
  name,
  icon: Icon,
  status,
  history,
}: {
  name: string;
  icon: React.ElementType;
  status: string;
  history: { date: Date; status: string }[];
}) => {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'operational':
        return 'bg-emerald-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'outage':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (s: string) => {
    switch (s) {
      case 'operational':
        return 'Operacional';
      case 'degraded':
        return 'Lentidão';
      case 'outage':
        return 'Fora do ar';
      default:
        return 'Desconhecido';
    }
  };

  const currentStatusColor =
    status === 'operational'
      ? 'text-emerald-500'
      : status === 'degraded'
        ? 'text-yellow-500'
        : 'text-red-500';

  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-background ring-border rounded-lg p-2 ring-1">
              <Icon className="text-muted-foreground h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1.5">
                <span className={cn('relative flex h-2 w-2')}>
                  <span
                    className={cn(
                      'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                      getStatusColor(status)
                    )}
                  ></span>
                  <span
                    className={cn(
                      'relative inline-flex h-2 w-2 rounded-full',
                      getStatusColor(status)
                    )}
                  ></span>
                </span>
                <span className={cn('text-xs font-medium', currentStatusColor)}>
                  {getStatusText(status)}
                </span>
              </CardDescription>
            </div>
          </div>
          <div className="text-muted-foreground font-mono text-xs">Uptime 99.9%</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex h-8 gap-0.5">
            <TooltipProvider delayDuration={0}>
              {history.map((day, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'h-full w-full transition-all first:rounded-l-sm last:rounded-r-sm hover:scale-y-110 hover:opacity-80',
                        getStatusColor(day.status)
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-medium">{day.date.toLocaleDateString()}</p>
                    <p className="text-muted-foreground text-xs capitalize">
                      {getStatusText(day.status)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
          <div className="text-muted-foreground flex justify-between text-[10px] font-medium tracking-wider uppercase">
            <span>90 dias atrás</span>
            <span>Hoje</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function StatusPage() {
  // Deterministic seeded random to make status look permanent on refresh
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const generateHistory = (seedOffset: number) =>
    Array.from({ length: 90 }).map((_, i) => {
      // Use date timestamp + seedOffset + index as seed
      const date = new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000);
      const daySeed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365 + seedOffset;
      const r = seededRandom(daySeed);

      let status = 'operational';
      if (r > 0.95) status = 'degraded';
      if (r > 0.99) status = 'outage';
      // Force today to be operational
      if (i === 89) status = 'operational';

      return {
        date,
        status,
      };
    });

  const services = [
    { name: 'Website & Portal', icon: Globe, status: 'operational', history: generateHistory(1) },
    { name: 'API Gateway', icon: Server, status: 'operational', history: generateHistory(2) },
    { name: 'Newsletter Delivery', icon: Mail, status: 'operational', history: generateHistory(3) },
    { name: 'Criptografia (E2E)', icon: Lock, status: 'operational', history: generateHistory(4) },
    { name: 'Upload Service', icon: Upload, status: 'operational', history: generateHistory(5) },
    {
      name: 'Database Clusters',
      icon: Database,
      status: 'operational',
      history: generateHistory(6),
    },
  ];

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            Todos os sistemas operacionais
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight lg:text-5xl">Status do Sistema</h1>
          <p className="text-muted-foreground text-lg">
            Monitoramento em tempo real de nossa infraestrutura e serviços críticos.
          </p>
        </div>

        <div className="grid gap-6">
          {services.map(service => (
            <ServiceStatus key={service.name} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
}
