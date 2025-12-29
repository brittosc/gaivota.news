import { test, expect } from '@playwright/test';
test('deve carregar a home', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Projeto/);
});
