import { test, expect } from "@playwright/test";
import { appLogin, navigateToPage } from "tests/utils/functions";
import { createGlobalVariables } from "tests/utils/productsUtils";

const PRODUCT_ID = "b17a976f-ebba-4142-a52e-5fd08bc7f8cd";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(page, expect, "products");
  await createGlobalVariables(page);
  await page.goto(`products/${PRODUCT_ID}`);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Catalog fields are visible", async ({ page }) => {
  await expect(page.getByText("Catalog Number")).toBeVisible();
  await expect(page.getByText("Description")).toBeVisible();
  await expect(page.getByText("Owner")).toBeVisible();
  await expect(page.getByText("Authors")).toBeVisible();
  await expect(page.getByText("Content of")).toBeVisible();
  await expect(page.getByText("Part of Sale")).toBeVisible();
  await expect(page.getByText("Additional Price")).toBeVisible();
  await expect(page.getByText("Sale Price")).toBeVisible();
});
