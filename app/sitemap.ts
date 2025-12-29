/**
 * @file sitemap.ts
 * @directory template-nextjs\app
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 21/12/2025 13:32
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

import { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.NEXT_PUBLIC_SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${env.NEXT_PUBLIC_SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
