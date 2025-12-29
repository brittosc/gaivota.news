/**
 * @file vitest.config.ts
 * @directory template-nextjs
 * @author Mauricio de Britto - grupobritto.com.br
 * @version 0.0.1
 * @since 28/12/2025 18:40
 *
 * @description
 * Configuração central do Vitest integrada com React e TSConfig Paths.
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'out'],
  },
});
