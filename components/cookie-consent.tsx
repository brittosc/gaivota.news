'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 0);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 p-4 md:p-6">
      <div className="border-border/50 bg-background/80 mx-auto max-w-4xl rounded-2xl border p-6 shadow-2xl backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-8">
        <div className="flex items-start gap-4 md:items-center">
          <div className="bg-primary/10 hidden rounded-full p-3 md:block">
            <Cookie className="text-primary h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight">
              Sua privacidade é nossa prioridade
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Utilizamos cookies para personalizar sua experiência, analisar o tráfego e garantir a
              segurança do sistema. Você pode gerenciar suas preferências a qualquer momento.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 md:mt-0 md:shrink-0 md:flex-row">
          <Button variant="outline" onClick={handleDecline} className="w-full md:w-auto">
            Não Autorizar
          </Button>
          <Button onClick={handleAccept} className="w-full md:w-auto">
            Autorizar e Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
