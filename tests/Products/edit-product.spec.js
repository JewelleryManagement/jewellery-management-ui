import { test, expect } from "@playwright/test";
import { appLogin, navigateToPage } from "tests/utils/functions";
import { getRandomNumber } from "tests/utils/getRandomNumberOrString";
import { createGlobalVariables, myContext, fillProductForm, fillTableCellAndPress } from "tests/utils/productsUtils";

const PRODUCT_ID = "b17a976f-ebba-4142-a52e-5fd08bc7f8cd";


test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(page, expect, 'products');
  await createGlobalVariables(page);
  await page.goto(`products/edit/${PRODUCT_ID}`);
});

test.afterEach(async ({ page }) => {
  await page.close();
});


test("Edit product and update additional price successfully", async ({ page }) => {
  const { submitButton, additionalPrice } = myContext;

  await page.getByRole("button", { name: "Resources" }).click();

  await fillTableCellAndPress(page, 1, 1, "2");

  await page.getByRole("button", { name: "Save" }).click();

  await additionalPrice.fill('-2');
  await submitButton.click();

  await expect(page.getByText("Successfully updated product!")).toBeVisible();
});

test("Edit product and update additional price successfully with reset button", async ({ page }) => {
  const { submitButton, additionalPrice } = myContext;

  const catalogNameString = "catalog" + getRandomNumber();
  const descriptionString = "description" + getRandomNumber();
  const authors = [
    "testUser1 testtestUser1@gmail.com",
    "testUser2 testtestUser2@gmail.com",
  ];
  const barcode = `asd${getRandomNumber()}asdf`;

  await page.getByRole("button", { name: "Reset" }).click();

  await fillProductForm(
    page,
    catalogNameString,
    descriptionString,
    authors,
    barcode
  );

  await page.getByRole("button", { name: "Resources" }).click();
  await fillTableCellAndPress(page, 1, 1, "2");

  await page.getByRole("button", { name: "Save" }).click();
  await additionalPrice.fill('-2');
  await submitButton.click();

  await expect(page.getByText("Successfully updated product!")).toBeVisible();
  await page.getByLabel("Search").fill(catalogNameString);
  await expect(page.locator("tbody")).toContainText(catalogNameString);
  await expect(page.locator("tbody")).toContainText(descriptionString);
});

test("Edit product and fail on reset/submit", async ({ page }) => {
  const { submitButton, resetButton } = myContext;

  await resetButton.click();
  await submitButton.click();

  const catalogError = page.getByText("Input field is required");
  const descError = page.getByText("Input field is required");
  const usersError = page.getByText("Please select at least one");
  const salePriceError = page.getByText("Input field is required");
  const barCodeError = page.getByText("Input field is required");

  expect(catalogError).toBeTruthy();
  expect(descError).toBeTruthy();
  expect(usersError).toBeTruthy();
  expect(salePriceError).toBeTruthy();
  expect(barCodeError).toBeTruthy();
});
