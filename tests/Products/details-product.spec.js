import { test, expect } from "@playwright/test";
import { appLogin, navigateToPage } from "tests/utils/functions";
import { createGlobalVariables } from "tests/utils/productsUtils";

const PRODUCT_ID = "353bd632-d7cf-4535-b9ea-76834ad2fbb9";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(
    page,
    expect,
    "Products",
    "/home",
    "All Products",
    "/products",
    "Products Table"
  );
  await createGlobalVariables(page);
  await page.goto(`products/${PRODUCT_ID}`);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Product fields are visible", async ({ page }) => {
  await expect(page.getByText("Catalog Number")).toBeVisible();
  await expect(page.getByText("Description")).toBeVisible();
  await expect(page.getByText("Owner")).toBeVisible();
  await expect(page.getByText("Authors")).toBeVisible();
  await expect(page.getByText("Content of")).toBeVisible();
  await expect(page.getByText("Part of Sale")).toBeVisible();
  await expect(page.getByText("Additional Price")).toBeVisible();
  await expect(page.getByText("Sale Price")).toBeVisible();
});
