import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";
import {
  createOrganizationGlobalVariables,
  organizationContext,
} from "tests/utils/orgUtils";
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
  createOrganizationGlobalVariables(page);
});

test("View organization events table", async ({ page }) => {
  await expect(
    page.locator(".v-btn__content", { hasText: "NEW ORGANIZATION" }),
  ).toBeVisible();
  page.locator(".v-btn__content", { hasText: "NEW ORGANIZATION" }).click();

  await expect(
    page.getByText("Create organization", { exact: true }),
  ).toBeVisible();

  const { nameInput, addressInput, noteInput, submitButton } =
    organizationContext;

  await nameInput.fill("Test Organization");
  await addressInput.fill(getRandomString(5));
  await noteInput.fill(getRandomString(10));

  await submitButton.click();

  await page
    .locator(".v-data-table-footer__items-per-page .v-input__control")
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "All" })
    .click();

  await expect(
    page.getByText("Test Organization", { exact: true }),
  ).toBeVisible();
  await page.getByText("Test Organization", { exact: true }).click();
  await expect(page.getByText("Events Table")).toBeVisible();
  await page.getByText("Events Table").click();
  await expect(
    page.getByText("Create Organization", { exact: true }),
  ).toBeVisible();
});

test("Try to access deleted organization details page", async ({ page }) => {
  await page.goto(`/organizations/985f4c02-f63b-462f-9226-fa1e07a89393`);

  await expect(page.getByText("Organization not found")).toBeVisible();
  await expect(
    page.getByText(
      "The requested organization was not found or may have been deleted.",
    ),
  ).toBeVisible();

  await expect(page.getByText("GO BACK")).toBeVisible();
  await page.getByText("GO BACK").click();

  await expect(page.getByText("Organizations Table")).toBeVisible();
});
