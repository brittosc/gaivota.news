/**
 * @file request.ts
 * @directory gaivota.news\i18n
 * @author Gaivota News - gaivota.news
 * @version 0.0.1
 * @since 29/12/2025 06:15
 *
 * @description
 * Descrição objetiva da responsabilidade do arquivo
 *
 * @company Gaivota News
 * @system Em qual sistema este arquivo existe?
 * @module Qual parte funcional do sistema ele implementa?
 *
 * @maintenance
 * Alterações devem ser registradas conforme normas internas.
 */

import { getRequestConfig } from 'next-intl/server';
import { locales, Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const safeLocale = locale as Locale;

  if (!locales.includes(safeLocale)) {
    notFound();
  }

  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default,
  };
});
