import { test, expect } from "@playwright/test";

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

test.beforeEach(async ({ page }) => {
  await login(page);
  await navigateToProductsPage(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Edit product successfully", async ({ page }, testInfo) => {
  await wait(0.5).then(async () => {
    const screenshot = await page.screenshot();
    await testInfo.attach("screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
  await page
    .getByRole("row", { name: "4 4444 This is my best test" })
    .getByRole("button")
    .nth(4)
    .click();
  await page.getByRole("button", { name: "Resources" }).click();
  await wait(0.5).then(async () => {
    const screenshot = await page.screenshot();
    await testInfo.attach("screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });

  await page
    .getByRole("row", { name: "Metal Carat 0 0" })
    .getByLabel("", { exact: true })
    .click();
  await page
    .getByRole("row", { name: "Metal Carat 0 0" })
    .getByLabel("", { exact: true })
    .fill("10");
  await page
    .getByRole("row", { name: "Element Carat 0" })
    .getByLabel("", { exact: true })
    .click();
  await page
    .getByRole("row", { name: "Element Carat 0" })
    .getByLabel("", { exact: true })
    .fill("2");
  await page
    .getByRole("row", { name: "28 PreciousStone Carat 0.00x0" })
    .getByLabel("", { exact: true })
    .click();
  await page
    .getByRole("row", { name: "28 PreciousStone Carat 0.00x0" })
    .getByLabel("", { exact: true })
    .fill("2");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Products" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("button", { name: "󰆦" }).first().click();

  await expect(
    page.getByRole("row", { name: "2 PreciousStone Carat 0.00x0" })
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: "10 Metal Carat 0 0" })
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: "2 Element Carat 0" })
  ).toBeVisible();
});

const getRandomNumber = () => {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
};

test("Edit product successfully with reset button", async ({ page }) => {
  const catalogNameString = "catalog" + getRandomNumber();
  const descriptionString = "description" + getRandomNumber();
  const productionNumberString = "pnNumber" + getRandomNumber();

  await page
    .getByRole("row", { name: "4 4444 This is my best test" })
    .getByRole("button")
    .nth(4)
    .click();

  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByLabel("Catalog name").click();
  await page.getByLabel("Catalog name").fill(catalogNameString);
  await page.getByLabel("Description of the product").click();
  await page.getByLabel("Description of the product").fill(descriptionString);
  await page.locator(".v-field__append-inner").first().click();
  await page
    .locator("div")
    .filter({ hasText: /^root testroot@gmail\.com$/ })
    .first()
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^testUser1 testtestUser1@gmail\.com$/ })
    .first()
    .click();
  await page.locator(".v-field__append-inner").first().click();
  await page.getByLabel("Sale price").click();
  await page.getByLabel("Sale price").fill(getRandomNumber().toString());
  await page.getByLabel("Barcode...").click();
  await page.getByLabel("Barcode...").fill(productionNumberString);
  await page.getByRole("button", { name: "Resources" }).click();
  await page.locator('td').first().click();
  await page.getByRole('row', { name: '28 PreciousStone Carat 0.00x0' }).getByLabel('', { exact: true }).fill('1');
  await page.locator('tr:nth-child(2) > td').first().click();
  await page.getByRole('row', { name: 'Metal Carat 0 0' }).getByLabel('', { exact: true }).fill('1');
  await page.locator('tr:nth-child(3) > td').first().click();
  await page.getByRole('row', { name: 'Element Carat 0' }).getByLabel('', { exact: true }).fill('1');
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("Successfully updated product!")).toBeVisible();
  await page.getByLabel('Search').fill(catalogNameString);
  await expect(page.locator("tbody")).toContainText(catalogNameString);
  await expect(page.locator("tbody")).toContainText(descriptionString);
  await expect(page.locator("tbody")).toContainText(productionNumberString);
});

test("Edit product fails on reset/submit", async ({ page }) => {
  await page.locator("tr:nth-child(1) > td:nth-child(14)").click();
  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("button", { name: "Submit" }).click();

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
