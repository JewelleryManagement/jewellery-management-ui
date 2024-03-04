import { test, expect } from "@playwright/test";
import {
  getRandomNumber,
  getRandomNumberAsString,
} from "tests/utils/getRandomNumberOrString";

const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const login = async (page) => {
  await page.goto("./");
  await page.getByPlaceholder("Email Address").fill("root@gmail.com");
  await page.getByPlaceholder("Password").fill("p@s5W07d");
  await page.getByRole("button", { name: "Log in" }).click();
  await wait(3);
};

const navigateToProductsPage = async (page) => {
  await page.getByRole("link", { name: "Products" }).click();
  await expect(page).toHaveURL("/products");
  await expect(page.getByText("Products Table")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Create Product" })
  ).toBeVisible();
};

const myContext = {};

test.beforeEach(async ({ page }) => {
  await login(page);
  await navigateToProductsPage(page);

  myContext.catalogNameButton = page.getByLabel("Catalog name");
  myContext.descriptionButton = page.getByLabel("Description of the product");
  myContext.authorsComboBox = page
    .getByRole("combobox")
    .locator("div")
    .filter({ hasText: "AuthorsAuthors" })
    .locator("div");
  myContext.salePriceButton = page.getByLabel("Sale price");
  myContext.barcodeButton = page.getByLabel("Barcode...");
  myContext.resourcesButton = page.getByRole("button", { name: "Resources" });
  myContext.productsButton = page.getByRole("button", { name: "Products" });
  myContext.selectPictureButton = page.getByLabel("Select picture", {
    exact: true,
  });
  myContext.submitButton = page.getByRole("button", { name: "Submit" });
  myContext.resetButton = page.getByRole("button", { name: "Reset" });
  myContext.goBackButton = page.getByRole("button", { name: "Go Back" });
});

test.afterEach(async ({ page }) => {
  // await page.close();
});

test("Access products page", async ({ page }) => {
  await navigateToProductsPage(page);
});

test("Acces a product creation page", async ({ page }) => {
  const {
    catalogNameButton,
    descriptionButton,
    authorsComboBox,
    salePriceButton,
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
  await expect(salePriceButton).toBeVisible();
  await expect(barcodeButton).toBeVisible();
  await expect(resourcesButton).toBeVisible();
  await expect(productsButton).toBeVisible();
  await expect(selectPictureButton).toBeVisible();
  await expect(submitButton).toBeVisible();
  await expect(resetButton).toBeVisible();
  await expect(goBackButton).toBeVisible();
});

test("Create a product with empty fields is unsuccessful", async ({ page }) => {
  const {
    catalogNameButton,
    descriptionButton,
    authorsComboBox,
    salePriceButton,
    barcodeButton,
    submitButton,
  } = myContext;

  await page.getByRole("link", { name: "Create Product" }).click();
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  await expect(
    page.locator("#input-8-messages").getByText("Input field is required")
  ).toBeVisible();
  await expect(
    page.locator("#input-10-messages").getByText("Input field is required")
  ).toBeVisible();
  await expect(page.getByText("Please select at least 1 author")).toBeVisible();
  await expect(
    page.locator("#input-15-messages").getByText("Input field is required")
  ).toBeVisible();
  await expect(
    page.getByText(
      "Input field is required, Input must be less than 100 characters"
    )
  ).toBeVisible();

  await catalogNameButton.fill("Product" + getRandomNumber());
  await descriptionButton.fill("Description" + getRandomNumber());
  await authorsComboBox.click();

  await page
    .locator("div")
    .filter({ hasText: /^testUser1 testtestUser1@gmail\.com$/ })
    .first()
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^testUser2 testtestUser2@gmail\.com$/ })
    .first()
    .click();
  await salePriceButton.fill(getRandomNumberAsString());
  await barcodeButton.fill(`asd${getRandomNumber()}asdf`);

  await submitButton.click();
  await expect(
    page.getByText("Please select at least 1 resource!")
  ).toBeVisible();
});
