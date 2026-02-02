import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";
import { createGlobalVariables, myContext } from "tests/utils/orgUtils";
import { getRandomString } from "tests/utils/getRandomNumberOrString";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
  });
  createGlobalVariables(page);
});

test("View organization events table", async ({ page }) => {
  await expect(
    page.locator(".v-btn__content", { hasText: "NEW ORGANIZATION" }),
  ).toBeVisible();
  page.locator(".v-btn__content", { hasText: "NEW ORGANIZATION" }).click();

  await expect(page.getByText("Create organization")).toBeVisible();

  const { nameInput, addressInput, noteInput, submitButton } = myContext;

  await nameInput.fill("Test Organization");
  await addressInput.fill(getRandomString(5));
  await noteInput.fill(getRandomString(10));

  await submitButton.click();

  await expect(page.getByText("Test Organization")).toBeVisible();
  await page.getByText("Test Organization").click();
  await expect(page.getByText("Events Table")).toBeVisible();
  await page.getByText("Events Table").click();
  await expect(page.getByText("Create Organization")).toBeVisible();
});
