import { test, expect } from "@playwright/test";
import {
  appLogin,
  navigateViaNavbar,
  requiredField,
} from "tests/utils/functions";
import { getRandomString } from "tests/utils/getRandomNumberOrString";
import {
  createOrganizationGlobalVariables,
  organizationContext,
} from "tests/utils/orgUtils";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "New Organization",
    expectedNewUrl: "/organizations/add",
    expectedHeader: "Create organization",
  });
  createOrganizationGlobalVariables(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

const verifyInputs = async (page) => {
  const { nameInput, addressInput, noteInput } = organizationContext;

  await expect(page).toHaveURL("/organizations/add");

  await expect(nameInput).toBeVisible();
  await expect(nameInput).toBeEmpty();
  await expect(addressInput).toBeVisible();
  await expect(addressInput).toBeEmpty();
  await expect(noteInput).toBeVisible();
  await expect(noteInput).toBeEmpty();
};

test("Create org", async ({ page }) => {
  const { nameInput, addressInput, noteInput, submitButton } =
    organizationContext;
  await verifyInputs(page);

  await nameInput.fill(getRandomString(5));
  await addressInput.fill(getRandomString(5));
  await noteInput.fill(getRandomString(10));

  await submitButton.click();
  await expect(
    page.getByText("Successfully created an organization!"),
  ).toBeVisible();
});

test("Submit throws validation when inputs are empty", async ({ page }) => {
  const { submitButton } = organizationContext;
  await verifyInputs(page);
  await submitButton.click();

  await expect(requiredField(page, "Name")).toBeVisible();
  await expect(requiredField(page, "Address")).toBeVisible();
  await expect(requiredField(page, "Note")).toBeVisible();
});

test("Reset button works", async ({ page }) => {
  const { nameInput, addressInput, noteInput, resetButton } =
    organizationContext;
  await verifyInputs(page);

  await nameInput.fill(getRandomString(5));
  await addressInput.fill(getRandomString(5));
  await noteInput.fill(getRandomString(10));

  await resetButton.click();
  await verifyInputs(page);
});

test("Go back button works", async ({ page }) => {
  const { goBackButton } = organizationContext;
  await verifyInputs(page);
  await goBackButton.click();
  await expect(page).toHaveURL("/home");
});
