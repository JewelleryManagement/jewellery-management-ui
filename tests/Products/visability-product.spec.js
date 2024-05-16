import { test, expect } from "@playwright/test";
import { appLogin, navigateToPage } from "tests/utils/functions";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(page, expect, 'products');
});

test.afterEach(async ({ page }) => {
  // await page.close();
});


test("partOfProduct products should not have disassemble and transfer buttons enabled ", async ({
  page,
}) => {
  const classAttribute =
    "v-btn v-btn--disabled v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-plain";

  await page.getByRole("cell", { name: "Part of product" }).dblclick();
  await expect(page.locator("td:nth-child(8)").first()).toBeVisible();
  const disassemblyButtonLocator = page
    .locator("td:nth-child(12) button.v-btn")
    .first();
  const transferButtonLocator = page
    .locator("td:nth-child(13) button.v-btn")
    .first();

  await expect(disassemblyButtonLocator).toHaveClass(classAttribute);
  await expect(transferButtonLocator).toHaveClass(classAttribute);
});

test("Sold products should not have disassemble and transfer buttons enabled ", async ({
  page,
}) => {
  const classAttribute =
    "v-btn v-btn--disabled v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-plain";

  await page.getByRole("cell", { name: "Sold", exact: true }).dblclick();
  await expect(page.locator("td:nth-child(6)").first()).toContainText('Yes');
  const disassemblyButtonLocator = page
    .locator("td:nth-child(12) button.v-btn")
    .first();
  const transferButtonLocator = page
    .locator("td:nth-child(13) button.v-btn")
    .first();

  await expect(disassemblyButtonLocator).toHaveClass(classAttribute);
  await expect(transferButtonLocator).toHaveClass(classAttribute);
});
