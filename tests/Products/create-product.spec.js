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

const fillProductForm = async (
  page,
  catalogName,
  description,
  authors,
  salePrice,
  barcode
) => {
  const {
    catalogNameButton,
    descriptionButton,
    authorsComboBox,
    salePriceButton,
    barcodeButton,
  } = myContext;

  await catalogNameButton.fill(catalogName);
  await descriptionButton.fill(description);
  await authorsComboBox.click();
  for (const author of authors) {
    await page
      .locator("div")
      .filter({ hasText: new RegExp(`^${author}$`) })
      .first()
      .click();
  }
  await salePriceButton.fill(salePrice);
  await barcodeButton.fill(barcode);
};

const fillResourceTableInformation = async (page, resourceName, carat) => {
  await page
    .getByRole("row", { name: `${resourceName} Carat 0` })
    .getByLabel("", { exact: true })
    .fill(carat);
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
  await page.close();
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
  const { submitButton } = myContext;

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
  const { submitButton } = myContext;
  const productName = "Product" + getRandomNumber();
  const productDescription = "Description" + getRandomNumber();
  const authors = [
    "testUser1 testtestUser1@gmail.com",
    "testUser2 testtestUser2@gmail.com",
  ];
  const salePrice = getRandomNumberAsString();
  const barcode = `asd${getRandomNumber()}asdf`;

  await page.getByRole("link", { name: "Create Product" }).click();

  await fillProductForm(
    page,
    productName,
    productDescription,
    authors,
    salePrice,
    barcode
  );

  await page.getByRole("button", { name: "Resources" }).click();

  await fillResourceTableInformation(page, "Element", "1");
  await fillResourceTableInformation(page, "SemiPreciousStone", "1");
  await fillResourceTableInformation(page, "Metal", "1");

  await page.getByRole("button", { name: "Save" }).click();
  await submitButton.click();
  await expect(page.getByText("Successfully added product!")).toBeVisible();
  await page.getByLabel("Search").fill(productName);
  await expect(page.getByRole("cell", { name: productName })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: productDescription })
  ).toBeVisible();
});

test("Create a product with a product is successful", async ({ page }) => {
  const { submitButton } = myContext;
  const productName = "Product" + getRandomNumber();
  const productDescription = "Description" + getRandomNumber();
  const authors = [
    "testUser1 testtestUser1@gmail.com",
    "testUser2 testtestUser2@gmail.com",
  ];
  const salePrice = getRandomNumberAsString();
  const barcode = `asd${getRandomNumber()}asdf`;

  await page.getByRole("link", { name: "Create Product" }).click();

  await fillProductForm(
    page,
    productName,
    productDescription,
    authors,
    salePrice,
    barcode
  );

  await page.getByRole("button", { name: "Resources" }).click();

  await fillResourceTableInformation(page, "Element", "1");
  await fillResourceTableInformation(page, "SemiPreciousStone", "1");
  await fillResourceTableInformation(page, "Metal", "1");

  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Products" }).click();

  const productionNumberCellText = await page
    .locator("tr:nth-child(1) td:nth-child(3)")
    .innerText();
  await page.locator("tr:nth-child(1) > td").first().click();
  await page.getByRole("button", { name: "Save" }).click();

  await submitButton.click();
  await expect(page.getByText("Successfully added product!")).toBeVisible();
  await page.getByLabel("Search").fill(productName);
  await expect(page.getByRole("cell", { name: productName })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: productDescription })
  ).toBeVisible();

  await page.getByRole("button", { name: "󰆦" }).click();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "󰆧" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    productionNumberCellText
  );
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
  const salePrice = getRandomNumberAsString();
  const barcode = `асд${getRandomNumber()}asdf`;

  await page.getByRole("link", { name: "Create Product" }).click();

  await fillProductForm(
    page,
    productName,
    productDescription,
    authors,
    salePrice,
    barcode
  );

  await expect(
    page.getByText("Only English letters and signs are allowed")
  ).toBeVisible();
});