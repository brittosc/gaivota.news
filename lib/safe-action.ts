/**
 * @file safe-action.ts
 * @directory gaivota.news\lib
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

import { createSafeActionClient } from 'next-safe-action';

export const actionClient = createSafeActionClient({
  handleServerError(e: Error) {
    console.error('Action Server Error:', e.message);
    return e.message || 'Ocorreu um erro inesperado no servidor.';
  },
}).use(async ({ next, clientInput }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  console.log(`[Action Log] Duracao: ${duration}ms`, {
    input: clientInput,
    success: result.success,
  });

  return result;
});
