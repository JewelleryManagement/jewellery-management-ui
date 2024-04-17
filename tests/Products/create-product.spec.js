import { test, expect } from "@playwright/test";
import {
  getRandomNumber,
  getRandomNumberAsString,
} from "tests/utils/getRandomNumberOrString";
import { appLogin, navigateToPage } from "tests/utils/functions";
import {
  createGlobalVariables,
  myContext,
  fillProductForm,
  fillTableCellAndPress,
} from "tests/utils/productsUtils";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(page, expect, "products");
  await createGlobalVariables(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Access products page", async ({ page }) => {
  await navigateToPage(page, expect, "products");
});

test("Acces a product creation page", async ({ page }) => {
  const {
    catalogNameButton,
    descriptionButton,
    authorsComboBox,
    additionalPrice,
    barcodeButton,
    resourcesButton,
    productsButton,
    selectPictureButton,
    submitButton,
    resetButton,
    goBackButton,
  } = myContext;

  await page.getByRole("link", { name: "Create Product" }).click();
  await expect(catalogNameButton).toBeVisible();
  await expect(descriptionButton).toBeVisible();
  await expect(authorsComboBox).toBeVisible();
  await expect(additionalPrice).not.toBeVisible();
  await expect(barcodeButton).toBeVisible();
  await expect(resourcesButton).toBeVisible();
  await expect(productsButton).toBeVisible();
  await expect(selectPictureButton).toBeVisible();
  await expect(submitButton).toBeVisible();
  await expect(resetButton).toBeVisible();
  await expect(goBackButton).toBeVisible();
});

test("Create a product with empty fields is unsuccessful", async ({ page }) => {
  const { submitButton } = myContext;

  await page.getByRole("link", { name: "Create Product" }).click();
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  await expect(page.getByText("Input field is required").first()).toBeVisible();
  await expect(page.getByText("Input field is required").nth(1)).toBeVisible();
  await expect(page.getByText("Please select at least 1 author")).toBeVisible();
  await expect(page.getByText("Input field is required").nth(2)).toBeVisible();
  await expect(
    page.getByText(
      "Input field is required, Input must be less than 100 characters"
    )
  ).toBeVisible();

  await fillProductForm(
    page,
    "Product" + getRandomNumber(),
    "Description" + getRandomNumber(),
    ["testUser1 testtestUser1@gmail.com", "testUser2 testtestUser2@gmail.com"],
    getRandomNumberAsString(),
    `asd${getRandomNumber()}asdf`
  );

  await submitButton.click();
  await expect(
    page.getByText("Please select at least 1 resource!")
  ).toBeVisible();
});

test("Create a product is successful", async ({ page }) => {
  const { submitButton, additionalPrice } = myContext;
  const productName = "Product" + getRandomNumber();
  const productDescription = "Description" + getRandomNumber();
  const authors = [
    "testUser1 testtestUser1@gmail.com",
    "testUser2 testtestUser2@gmail.com",
  ];
  const barcode = `asd${getRandomNumber()}asdf`;

  await page.getByRole("link", { name: "Create Product" }).click();

  await fillProductForm(
    page,
    productName,
    productDescription,
    authors,
    barcode
  );

  await page.getByRole("button", { name: "Resources" }).click();

  await fillTableCellAndPress(page, 2, 1, "2");

  await page.getByRole("button", { name: "Save" }).click();

  await additionalPrice.fill("2");

  await submitButton.click();
  await expect(page.getByText("Successfully added product!")).toBeVisible();
  await page.getByLabel("Search").fill(productName);
  await expect(page.getByRole("cell", { name: productName })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: productDescription })
  ).toBeVisible();
});

test("Create a product with a product is successful and negative additional price", async ({
  page,
}) => {
  const { submitButton, additionalPrice } = myContext;
  const productName = "Product" + getRandomNumber();
  const productDescription = "Description" + getRandomNumber();
  const authors = [
    "testUser1 testtestUser1@gmail.com",
    "testUser2 testtestUser2@gmail.com",
  ];
  const barcode = `asd${getRandomNumber()}asdf`;

  await page.getByRole("link", { name: "Create Product" }).click();

  await fillProductForm(
    page,
    productName,
    productDescription,
    authors,
    barcode
  );

  await page.getByRole("button", { name: "Resources" }).click();
  await fillTableCellAndPress(page, 2, 1, "2");

  await page.getByRole("button", { name: "Save" }).click();

  await additionalPrice.fill("-2");

  await submitButton.click();
  await expect(page.getByText("Successfully added product!")).toBeVisible();
  await page.getByLabel("Search").fill(productName);
  await expect(page.getByRole("cell", { name: productName })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: productDescription })
  ).toBeVisible();
});

test("Barcode throws an error if cyrilic symbols are entered", async ({
  page,
}) => {
  const productName = "Product" + getRandomNumber();
  const productDescription = "Description" + getRandomNumber();
  const authors = [
    "testUser1 testtestUser1@gmail.com",
    "testUser2 testtestUser2@gmail.com",
  ];
  const barcode = `асд${getRandomNumber()}asdf`;

  await page.getByRole("link", { name: "Create Product" }).click();

  await fillProductForm(
    page,
    productName,
    productDescription,
    authors,
    barcode
  );

  await expect(
    page.getByText("Only English letters and signs are allowed")
  ).toBeVisible();
});
