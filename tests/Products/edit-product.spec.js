import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";
import { getRandomNumber } from "tests/utils/getRandomNumberOrString";
import {
  createProductGlobalVariables,
  productContext,
  fillProductForm,
  fillTableCellAndPress,
} from "tests/utils/productsUtils";

const PRODUCT_ID = "3c552c1f-9a96-445a-aa36-b772a6c2c113";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Products",
    expectedUrl: "/home",
    navChildButtonText: "All Products",
    expectedNewUrl: "/products",
    expectedHeader: "Products Table",
  });
  await createProductGlobalVariables(page);
  await page.goto(`products/edit/${PRODUCT_ID}`);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Edit product and update additional price successfully", async ({
  page,
}) => {
  const { submitButton, additionalPrice } = productContext;

  await page.getByRole("button", { name: "Resources" }).click();

  await fillTableCellAndPress(page, 1, 1, "2");

  await page.getByRole("button", { name: "Save" }).click();

  await additionalPrice.fill("-2");
  await submitButton.click();

  await expect(page.getByText("Successfully updated product!")).toBeVisible();
});

test("Edit product and update additional price successfully with reset button", async ({
  page,
}) => {
  const { submitButton, additionalPrice } = productContext;

  const catalogNameString = "catalog" + getRandomNumber();
  const descriptionString = "description" + getRandomNumber();
  const authors = ["root testroot@gmail.com"];
  const barcode = `asd${getRandomNumber()}asdf`;

  await page.getByRole("button", { name: "Reset" }).click();

  await fillProductForm(
    page,
    catalogNameString,
    descriptionString,
    authors,
    barcode,
  );

  await page.getByRole("button", { name: "Resources" }).click();
  await fillTableCellAndPress(page, 1, 1, "2");

  await page.getByRole("button", { name: "Save" }).click();
  await additionalPrice.fill("-2");
  await submitButton.click();

  await expect(page.getByText("Successfully updated product!")).toBeVisible();
  await page.getByLabel("Search").fill(catalogNameString);
  await expect(page.locator("tbody")).toContainText(catalogNameString);
  await expect(page.locator("tbody")).toContainText(descriptionString);
});

test("Edit product and fail on reset/submit", async ({ page }) => {
  const { submitButton, resetButton } = productContext;

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
