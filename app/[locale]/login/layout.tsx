/**
 * @file layout.tsx
 * @directory gaivota.news\app\login
 * @author Gaivota News - gaivota.news
 * @version 0.0.1
 * @since 21/12/2025 13:31
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

import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Login',
  description: 'Acesse sua conta para continuar.',
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
