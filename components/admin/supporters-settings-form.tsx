'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateSiteSettings } from '@/app/actions/site-settings';

interface SupportersSettings {
  speed: number;
  maxItems: number;
}

export function SupportersSettingsForm({
  initialSettings,
}: {
  initialSettings: SupportersSettings | null;
}) {
  const [speed, setSpeed] = useState(initialSettings?.speed || 30);
  const [maxItems, setMaxItems] = useState(initialSettings?.maxItems || 20);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSiteSettings('supporters_marquee', { speed, maxItems });
      toast.success('Configurações atualizadas!');
    } catch {
      toast.error('Erro ao atualizar configurações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Configurações do Carrossel</CardTitle>
        <CardDescription>Ajuste a velocidade e exibição dos apoiadores.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid items-end gap-x-4 gap-y-2 sm:grid-cols-[1fr_1fr_auto]"
        >
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="speed">Velocidade (segundos)</Label>
            <Input
              type="number"
              id="speed"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              min={5}
              max={120}
              className="max-w-50"
              onWheel={e => e.currentTarget.blur()}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="maxItems">Máximo de Itens</Label>
            <Input
              type="number"
              id="maxItems"
              value={maxItems}
              onChange={e => setMaxItems(Number(e.target.value))}
              min={1}
              max={100}
              className="max-w-50"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>

          <p className="text-muted-foreground col-span-3 text-xs">
            Quanto maior o valor, mais lenta a animação.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
