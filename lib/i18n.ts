/**
 * @file i18n.ts
 * @directory template-nextjs\lib
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 29/12/2025 07:15
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

export const locales = ['br', 'en', 'es', 'ru'] as const;
export const defaultLocale = 'br' as const;
export type Locale = (typeof locales)[number];
