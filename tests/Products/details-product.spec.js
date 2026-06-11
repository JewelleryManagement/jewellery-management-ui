import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";
import {
  createProductGlobalVariables,
  productContext,
  fillProductForm,
  fillTableCellAndPress,
} from "tests/utils/productsUtils";
import { getRandomNumber } from "tests/utils/getRandomNumberOrString";

const PRODUCT_ID = "353bd632-d7cf-4535-b9ea-76834ad2fbb9";

let productName = null;
let productDescription = null;
let authors = null;
let barcode = null;

const createProduct = async (page) => {
  const { submitButton, additionalPrice } = productContext;

  await page.locator(".v-btn__content", { hasText: "CREATE PRODUCT" }).click();

  await fillProductForm(
    page,
    "Organization with User, Sale and Resources",
    productName,
    productDescription,
    authors,
    barcode,
  );
  await page.getByRole("button", { name: "Resources" }).click();
  await fillTableCellAndPress(page, 1, 1, "2");
  await page.getByRole("button", { name: "Save" }).click();
  await additionalPrice.fill("2");

  await submitButton.click();
};

const gotoDetailsPage = async (page) => {
  await selectAllItems(page);

  await expect(page.getByText(productName)).toBeVisible();
  await page.getByText(productName).click();
};

const selectAllItems = async (page) => {
  await page
    .locator(".v-data-table-footer__items-per-page .v-input__control")
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "All" })
    .click();
};

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

  productName = "Product" + getRandomNumber();
  productDescription = "Description" + getRandomNumber();
  authors = ["root test"];
  barcode = `asd${getRandomNumber()}asdf`;
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Product fields are visible", async ({ page }) => {
  await page.goto(`products/${PRODUCT_ID}`);
  await expect(page.getByText("Catalog Number")).toBeVisible();
  await expect(page.getByText("Description")).toBeVisible();
  await expect(page.getByText("Owner")).toBeVisible();
  await expect(page.getByText("Authors")).toBeVisible();
  await expect(page.getByText("Content of")).toBeVisible();
  await expect(page.getByText("Part of Sale")).toBeVisible();
  await expect(page.getByText("Additional Price")).toBeVisible();
  await expect(page.getByText("Sale Price")).toBeVisible();
});

test("View product events table", async ({ page }) => {
  await createProduct(page);

  await gotoDetailsPage(page);

  await expect(page.getByText("Events Table")).toBeVisible();
  await page.getByText("Events Table").click();
  await expect(
    page.getByRole("cell", { name: "Create Products" }),
  ).toBeVisible();
});

test("Try to access deleted product details page", async ({ page }) => {
  await createProduct(page);

  await gotoDetailsPage(page);

  await expect(page.getByText("Events Table")).toBeVisible();

  const url = page.url();
  const productId = url.split("/").pop();

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Products",
    expectedUrl: `/products/${productId}`,
    navChildButtonText: "All Products",
    expectedNewUrl: "/products",
    expectedHeader: "Products Table",
  });

  await selectAllItems(page);

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });
  await expect(
    page
      .locator(".v-data-table__tr", { hasText: productName })
      .locator(".mdi-cart-off"),
  ).toBeVisible();
  await page
    .locator(".v-data-table__tr", { hasText: productName })
    .locator(".mdi-cart-off")
    .click();

  await page.goto(`/products/${productId}`);

  await expect(page.getByText("Product not found")).toBeVisible();
  await expect(
    page.getByText(
      "The requested product was not found or may have been deleted.",
    ),
  ).toBeVisible();

  await expect(page.getByText("GO BACK")).toBeVisible();
  await page.getByText("GO BACK").click();

  await expect(page.getByText("Products Table")).toBeVisible();
});
