/**
 * @file not-found.tsx
 * @directory gaivota.news\app
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 27/12/2025 22:36
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

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-900/70 bg-[url('/404.svg')] bg-center bg-no-repeat px-6 py-24 bg-blend-overlay sm:py-32 lg:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center">
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-6xl">
          {t('title')}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90 drop-shadow-sm">
          {t('description')}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-x-6 gap-y-4 sm:flex-row">
          <Link
            href="/"
            className="transform rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-200 ease-in-out hover:scale-105 hover:bg-gray-100 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t('goHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}
