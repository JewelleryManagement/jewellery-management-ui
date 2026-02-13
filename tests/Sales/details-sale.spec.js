import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";

import {
  firstInputSelect,
  secondInputSelect,
  selectDate,
  selectResource,
  saleContext,
  createSaleGlobalVariables,
} from "tests/utils/salesUtils";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Sales",
    expectedUrl: "/home",
    navChildButtonText: "All Sales",
    expectedNewUrl: "/sales",
    expectedHeader: "Sales table",
  });
  createSaleGlobalVariables(page);
});

test("View sale events table", async ({ page }) => {
  const { submitButton } = saleContext;

  await expect(
    page.locator(".v-btn__content", { hasText: "NEW SALE" }),
  ).toBeVisible();
  await page.locator(".v-btn__content", { hasText: "NEW SALE" }).click();

  await expect(page.getByText("submit")).toBeVisible();

  await firstInputSelect(page, 1);
  await secondInputSelect(page);

  await selectDate(page, expect);

  await selectResource(page);

  await submitButton.click();
  await expect(page.getByText("Successfully sold the product!")).toBeVisible();

  await expect(page.getByText("Date")).toBeVisible();

  await page.getByText("Date").click();

  const table = page.locator(".v-table__wrapper");

  await table.locator("tbody tr").first().locator("td").nth(8).click();
  await expect(page.getByText("Events Table")).toBeVisible();
  await page.getByText("Events Table").click();
  await expect(page.getByText("Create Sale")).toBeVisible();
});
