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

const createSale = async (page, discount) => {
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

  await page
    .locator(".v-input__control")
    .filter({
      has: page.getByText("Discount", { exact: true }),
    })
    .locator("input")
    .fill(discount);

  await submitButton.click();
  await expect(page.getByText("Successfully sold the product!")).toBeVisible();

  await expect(page.getByText(`%${discount}`)).toBeVisible();
  await page.getByText(`%${discount}`).click();
};

test("View sale events table", async ({ page }) => {
  const discount = "47";

  await createSale(page, discount);

  await expect(page.getByText("Events Table")).toBeVisible();
  await page.getByText("Events Table").click();
  await expect(page.getByText("Create Sale")).toBeVisible();
});

test("Try to access deleted sale details page", async ({ page }) => {
  const discount = "67";

  await createSale(page, discount);

  await expect(page.getByText("Resources Table")).toBeVisible();
  await page.getByText("Resources Table").click();

  const url = page.url();
  const saleId = url.split("/").pop();

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await expect(
    page.locator(".v-data-table__tr").first().locator(".mdi-cart-remove"),
  ).toBeVisible();

  await page
    .locator(".v-data-table__tr")
    .first()
    .locator(".mdi-cart-remove")
    .click();

  await page.goto(`/sales/${saleId}`);

  await expect(page.getByText("Sale not found")).toBeVisible();
  await expect(
    page.getByText(
      "The requested sale was not found or may have been deleted.",
    ),
  ).toBeVisible();

  await expect(page.getByText("GO BACK")).toBeVisible();
  await page.getByText("GO BACK").click();

  await expect(page.getByText("Sales table")).toBeVisible();
});
