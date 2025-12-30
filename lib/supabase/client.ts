/**
 * @file client.ts
 * @directory gaivota.news\lib\supabase
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 21/12/2025 13:33
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

// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

/**
 * Cria o cliente do Supabase para uso em Client Components.
 * Utiliza o validador central de variáveis de ambiente.
 */
export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
