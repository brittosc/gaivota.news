/**
 * @file seo.ts
 * @directory template-nextjs\lib
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 29/12/2025 06:15
 *
 * @description
 * Descrição objetiva da responsabilidade do arquivo
 *
 * @company Quem é dono do sistema
 * @system Em qual sistema este arquivo existe?
 * @module Qual parte funcional do sistema ele implementa?
 *
 * @maintenance
 * Alterações devem ser registradas conforme normas internas.
 */

import { Metadata } from 'next';
import { env } from './env';

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = 'Descrição padrão do sistema',
  image = '/logo.png',
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: {
      default: title ? `${title}` : 'Gaivota News | Pagina Inicial',
      template: '%s | Gaivota News',
    },
    description,
    manifest: '/manifest.json',
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: siteUrl,
      title: title || 'Gaivota News',
      description,
      siteName: 'Gaivota News',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'Gaivota News',
      description,
      images: [image],
    },
    metadataBase: new URL(siteUrl),
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
