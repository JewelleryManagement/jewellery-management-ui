import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";

import {
  firstInputSelect,
  secondInputSelect,
  selectDate,
  selectResource,
  myContext,
  createGlobalVariables,
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
  createGlobalVariables(page);
});

test("View sale events table", async ({ page }) => {
  const { submitButton } = myContext;

  await expect(
    page.locator(".v-btn__content", { hasText: "NEW SALE" }),
  ).toBeVisible();
  await page.locator(".v-btn__content", { hasText: "NEW SALE" }).click();

  await expect(page.getByText("submit")).toBeVisible();

  await firstInputSelect(page, 1);
  await secondInputSelect(page);

  await selectDate(page, expect);

  await selectResource(page);

  const discount = "47";

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

  await expect(page.getByText("Events Table")).toBeVisible();
  await page.getByText("Events Table").click();
  await expect(page.getByText("Create Sale")).toBeVisible();
});
