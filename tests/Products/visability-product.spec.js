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


test("partOfProduct products should not have disassemble and transfer buttons enabled ", async ({
  page,
}) => {
  const classAttribute =
    "v-btn v-btn--disabled v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-plain";

  await page.getByRole("cell", { name: "Part of product" }).dblclick();
  await expect(page.locator("td:nth-child(8)").first()).toBeVisible();
  const disassemblyButtonLocator = page
    .locator("td:nth-child(12) button.v-btn")
    .first();
  const transferButtonLocator = page
    .locator("td:nth-child(13) button.v-btn")
    .first();

  await expect(disassemblyButtonLocator).toHaveClass(classAttribute);
  await expect(transferButtonLocator).toHaveClass(classAttribute);
});

test("Sold products should not have disassemble and transfer buttons enabled ", async ({
  page,
}) => {
  const classAttribute =
    "v-btn v-btn--disabled v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-plain";

  await page.getByRole("cell", { name: "Sold" }).dblclick();
  await expect(page.locator("td:nth-child(6)").first()).toContainText('Yes');
  const disassemblyButtonLocator = page
    .locator("td:nth-child(12) button.v-btn")
    .first();
  const transferButtonLocator = page
    .locator("td:nth-child(13) button.v-btn")
    .first();

  await expect(disassemblyButtonLocator).toHaveClass(classAttribute);
  await expect(transferButtonLocator).toHaveClass(classAttribute);
});
