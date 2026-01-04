'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Mensagem enviada com sucesso!');
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Entre em Contato</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Estamos prontos para ouvir você. Conecte-se com nossa equipe.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="border-primary/20 bg-primary/5 relative overflow-hidden rounded-2xl border p-8">
              <div className="bg-primary/20 text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-lg">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Email</h3>
              <p className="text-muted-foreground mt-2">contato@gaivotanews.com</p>
              <p className="text-muted-foreground">redacao@gaivotanews.com</p>
            </div>

            <div className="border-primary/20 bg-primary/5 relative overflow-hidden rounded-2xl border p-8">
              <div className="bg-primary/20 text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-lg">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Telefone</h3>
              <p className="text-muted-foreground mt-2">+55 (48) 3583-0000</p>
              <p className="text-muted-foreground mt-1 text-xs">Seg-Sex, 9h às 18h</p>
            </div>

            <div className="border-primary/20 bg-primary/5 relative overflow-hidden rounded-2xl border p-8">
              <div className="bg-primary/20 text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-lg">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Sede</h3>
              <p className="text-muted-foreground mt-2">Balneário Gaivota, Santa Catarina</p>
              <p className="text-muted-foreground">88955-000</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl border p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nome <span className="text-muted-foreground font-normal">(Opcional)</span>
                  </label>
                  <Input placeholder="Anônimo" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Email <span className="text-muted-foreground font-normal">(Opcional)</span>
                  </label>
                  <Input type="email" placeholder="Opcional para resposta" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Assunto</label>
                <Input placeholder="Sobre o que você quer falar?" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mensagem</label>
                <Textarea
                  placeholder="Escreva sua mensagem aqui..."
                  className="min-h-37.5"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  'Enviando...'
                ) : (
                  <span className="flex items-center gap-2">
                    Enviar Mensagem <Send className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
