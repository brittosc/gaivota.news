/**
 * @file next.config.ts
 * @directory template-nextjs
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.2
 * @since 28/12/2025 19:40
 *
 * @description
 * Configuração do Next.js integrada com next-intl e suporte a imagens do Supabase.
 * Corrigido: Tipagem explícita de 'nextConfig' para evitar erros de inferência em remotePatterns.
 */

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
