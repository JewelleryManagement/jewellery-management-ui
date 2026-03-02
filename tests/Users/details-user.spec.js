import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";
import { userContext, createGlobalVariables } from "tests/utils/userUtils";
import { getRandomNumber } from "tests/utils/getRandomNumberOrString";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Users",
    expectedUrl: "/home",
    navChildButtonText: "All Users",
    expectedNewUrl: "/users",
    expectedHeader: "Users table",
  });
  createGlobalVariables(page);
});

test("View user events table", async ({ page }) => {
  await expect(
    page.locator(".v-btn__content", { hasText: "Create User" }),
  ).toBeVisible();
  await page.locator(".v-btn__content", { hasText: "Create User" }).click();

  const firstName = "firstName" + getRandomNumber();
  const lastName = "lastName" + getRandomNumber();
  const email = "email" + getRandomNumber() + "@gmail.com";
  const password = "p@s5W07d" + getRandomNumber();

  await userContext.firstNameLabel.fill(firstName);
  await userContext.lastNameLabel.fill(lastName);
  await userContext.emailLabel.fill(email);
  await userContext.passwordLabel.fill(password);
  await userContext.submitButton.click();

  await page
    .locator(".v-data-table-footer__items-per-page .v-input__control")
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "All" })
    .click();

  await expect(page.getByText(email)).toBeVisible();
  await page.getByText(email).click();
  await expect(page.getByText("Events Table")).toBeVisible();
  await page.getByText("Events Table").click();
  await expect(page.getByRole("cell", { name: "Create User" })).toBeVisible();
});

test("Try to access deleted user details page", async ({ page }) => {
  await page.goto(`/users/985f4c02-f63b-462f-9226-fa1e07a89393`);

  await expect(page.getByText("User not found")).toBeVisible();
  await expect(
    page.getByText(
      "The requested user was not found or may have been deleted.",
    ),
  ).toBeVisible();

  await expect(page.getByText("GO BACK")).toBeVisible();
  await page.getByText("GO BACK").click();

  await expect(page.getByText("Users Table")).toBeVisible();
});
