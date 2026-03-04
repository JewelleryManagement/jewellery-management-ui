import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";
import { getRandomNumber } from "tests/utils/getRandomNumberOrString";

const checkButtonsVisibility = async (page) => {
  await expect(page.locator(".v-btn", { hasText: "Delete" })).toBeVisible();
  await expect(page.locator(".v-btn", { hasText: "Edit" })).toBeVisible();
  await expect(page.locator(".v-btn", { hasText: "Duplicate" })).toBeVisible();
  await expect(
    page.locator(".v-btn", { hasText: "Add Quantity" }),
  ).toBeVisible();
  await expect(
    page.locator(".v-btn", { hasText: "Sales Table" }),
  ).toBeVisible();
  await expect(
    page.locator(".v-btn", { hasText: "Products Table" }),
  ).toBeVisible();
  await expect(
    page.locator(".v-btn", { hasText: "Organizations Table" }),
  ).toBeVisible();
};

const clickTableButtons = async (page, buttonName, tableTitle) => {
  await page.locator(".v-btn", { hasText: buttonName }).click();
  await expect(page.getByText(tableTitle)).toBeVisible();
};

const clickCardButtons = async (page, buttonName, pageTitle) => {
  await page.locator(".v-btn", { hasText: buttonName }).click();
  await expect(page.getByText(pageTitle)).toBeVisible();
  await expect(page.locator(".v-btn", { hasText: "Back" })).toBeVisible();
  await page.locator(".v-btn", { hasText: "Back" }).click();
  await expect(
    page.locator(".v-card-title", { hasText: "Pearl" }),
  ).toBeVisible();
};

let description = null;
let pricePerQuantity = null;
let sku = null;

const createResource = async (page) => {
  await expect(
    page.locator(".v-btn__content", { hasText: "Add Element" }),
  ).toBeVisible();
  await page.locator(".v-btn__content", { hasText: "Add Element" }).click();

  await expect(page.getByText("Submit")).toBeVisible();
  await page.getByLabel("Description").fill(String(description));

  await page
    .getByLabel("Price per quantity", { exact: true })
    .fill(String(pricePerQuantity));

  await page
    .locator(".v-text-field", { hasText: "Stock Keeping Unit" })
    .locator("input")
    .fill(String(sku));
  await page.locator(".v-btn__content", { hasText: "Submit" }).click();
  await page.getByLabel("Quantity", { exact: true }).fill(String(22));
  await page.getByLabel("Delivery Cost", { exact: true }).fill(String(22));
  await page.locator(".v-btn__content", { hasText: "Submit" }).click();
  await expect(page.getByText("All Elements table")).toBeVisible();

  await selectAllItems(page);

  await expect(page.getByText(sku)).toBeVisible();
  await page.getByText(sku).click();
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

const clickIconButton = async (page, entityIdentifier, icon) => {
  await expect(
    page
      .locator(".v-data-table__tr", { hasText: entityIdentifier })
      .locator(icon),
  ).toBeVisible();

  await page
    .locator(".v-data-table__tr", { hasText: entityIdentifier })
    .locator(icon)
    .click();
};

test.beforeEach(async ({ page }) => {
  await appLogin(page);

  description = "Description" + getRandomNumber();
  pricePerQuantity = getRandomNumber();
  sku = "Stock Keeping Unit" + getRandomNumber();
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Access resource details page", async ({ page }) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Pearl",
    expectedNewUrl: "/resources?clazz=Pearl",
    expectedHeader: "All Pearls table",
  });

  await page.locator(".v-table__wrapper tbody tr").first().click();
  await expect(
    page.locator(".v-card-title", { hasText: "Pearl" }),
  ).toBeVisible();

  await checkButtonsVisibility(page);
});

test("All buttons work correct", async ({ page }) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Pearl",
    expectedNewUrl: "/resources?clazz=Pearl",
    expectedHeader: "All Pearls table",
  });

  await page.locator(".v-table__wrapper tbody tr").first().click();
  await expect(
    page.locator(".v-card-title", { hasText: "Pearl" }),
  ).toBeVisible();

  await checkButtonsVisibility(page);

  await clickCardButtons(page, "Edit", "Edit Pearl");
  await clickCardButtons(page, "Duplicate", "Duplicate Pearl");
  await clickCardButtons(page, "Add Quantity", "Add Quantity");

  await clickTableButtons(page, "Sales Table", "Resource Sale Table");
  await clickTableButtons(
    page,
    "Products Table",
    "Products Containing The Resource Table",
  );
  await clickTableButtons(
    page,
    "Organizations Table",
    "Organizations Owning The Resource Table",
  );
});

test("View resource events table", async ({ page }) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Element",
    expectedNewUrl: "/resources?clazz=Element",
    expectedHeader: "All Elements table",
  });

  await createResource(page);

  await expect(page.getByText("Events Table")).toBeVisible();
  await page.getByText("Events Table").click();
  await expect(page.getByText("Create Resource")).toBeVisible();
});

test("Try to access deleted resource details page", async ({ page }) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Element",
    expectedNewUrl: "/resources?clazz=Element",
    expectedHeader: "All Elements table",
  });

  await createResource(page);

  await expect(page.getByText("Organizations Table")).toBeVisible();
  await page.getByText("Organizations Table").click();

  const url = page.url();
  const reourceId = url.split("/").pop();

  await expect(
    page.getByText("Organization with User, Sale and Resources"),
  ).toBeVisible();
  await page.getByText("Organization with User, Sale and Resources").click();

  await expect(page.getByText("Resources Table")).toBeVisible();
  await page.getByText("Resources Table").click();

  await selectAllItems(page);

  await expect(page.getByText(sku)).toBeVisible();

  await clickIconButton(page, sku, ".mdi-minus");

  await expect(page.getByText(sku)).toBeVisible();

  await expect(page.getByText("Remove Quantity")).toBeVisible();

  await page.locator(".v-btn__content", { hasText: "Submit" }).click();

  await expect(page.getByText("Resources Table")).toBeVisible();

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: page.url(),
    navChildButtonText: "Element",
    expectedNewUrl: "/resources?clazz=Element",
    expectedHeader: "All Elements table",
  });

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await clickIconButton(page, sku, ".mdi-delete");

  await page.goto(`/resources/${reourceId}`);

  await expect(page.getByText("Resource not found")).toBeVisible();
  await expect(
    page.getByText(
      "The requested resource was not found or may have been deleted.",
    ),
  ).toBeVisible();

  await expect(page.getByText("GO BACK")).toBeVisible();
  await page.getByText("GO BACK").click();

  await expect(page.getByText("All Elements table")).toBeVisible();
});
