import { test, expect } from "@playwright/test";
import { appLogin, navigateToPage } from "tests/utils/functions";
import { getRandomString } from "tests/utils/getRandomNumberOrString";
import { createGlobalVariables, myContext } from "tests/utils/orgUtils";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(
    page,
    expect,
    "Organizations",
    "/home",
    "New Organization",
    "/organizations/add",
    "Create organization"
  );
  createGlobalVariables(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

const verifyInputs = async (page) => {
  const { nameInput, addressInput, noteInput } = myContext;

  await expect(page).toHaveURL("/organizations/add");

  await expect(nameInput).toBeVisible();
  await expect(nameInput).toBeEmpty();
  await expect(addressInput).toBeVisible();
  await expect(addressInput).toBeEmpty();
  await expect(noteInput).toBeVisible();
  await expect(noteInput).toBeEmpty();
};

test("Create org", async ({ page }) => {
  const { nameInput, addressInput, noteInput, submitButton } = myContext;
  await verifyInputs(page);

  await nameInput.fill(getRandomString(5));
  await addressInput.fill(getRandomString(5));
  await noteInput.fill(getRandomString(10));

  await submitButton.click();
  await expect(
    page.getByText("Successfully created an organization!")
  ).toBeVisible();
});

test("Submit throws validation when inputs are empty", async ({ page }) => {
  const { submitButton } = myContext;
  await verifyInputs(page);
  await submitButton.click();

  await expect(page.getByText("Input field is required").first()).toBeVisible();
  await expect(page.getByText("Input field is required").nth(1)).toBeVisible();
  await expect(page.getByText("Input field is required").nth(2)).toBeVisible();
});

test("Reset button works", async ({ page }) => {
  const { nameInput, addressInput, noteInput, resetButton } = myContext;
  await verifyInputs(page);

  await nameInput.fill(getRandomString(5));
  await addressInput.fill(getRandomString(5));
  await noteInput.fill(getRandomString(10));

  await resetButton.click();
  await verifyInputs(page);
});

test("Go back button works", async ({ page }) => {
  const { goBackButton } = myContext;
  await verifyInputs(page);
  await goBackButton.click();
  await expect(page).toHaveURL("/home");
});
