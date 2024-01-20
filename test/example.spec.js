import { test, expect } from '@playwright/test';

test('Login page landing', async ({ page }) => {
  await page.goto('localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Login page/);
});

test('Login successfully', async ({ page }) => {
  await page.goto('localhost:3000');

  await page.getByPlaceholder("Email Address").fill("root@gmail.com")
  await page.getByPlaceholder("Password").fill("p@s5W07d")

  // Login
  await page.getByRole('button', { name: 'Log in' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Home Page' })).toBeVisible();
});