import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";

const myContext = {};

const accessTransferPage = async (page) => {
  await myContext.table.click();
  await myContext.resourceTableBtn.click();
  await myContext.transferButton.click();
};

const assertTransferPageFields = async (page) => {
  await expect(myContext.transferPageHeader).toBeVisible();

  await expect(myContext.organizationInputField).toBeVisible();
  await expect(myContext.quantityField).toBeVisible();

  await expect(myContext.submitBtn).toBeVisible();
  await expect(myContext.resetBtn).toBeVisible();
  await expect(myContext.backBtn).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations table",
  });

  myContext.table = page
    .locator(".v-table")
    .locator(".v-data-table__tr")
    .first();
  myContext.resourceTableBtn = page.getByText("resources table");
  myContext.transferButton = page.locator(".mdi-swap-horizontal").first();
  myContext.transferPageHeader = page.getByText("Transfer Quantity");

  myContext.organizationInputField = page
    .getByRole("combobox")
    .locator("div")
    .filter({ hasText: "Select organization" })
    .locator("div")
    .first();
  myContext.quantityField = page.getByLabel("Quantity");
  myContext.deliveryCostField = page.getByLabel("Delivery Cost");
  myContext.submitBtn = page.getByRole("button", { name: "Submit" });
  myContext.resetBtn = page.getByRole("button", { name: "Reset" });
  myContext.backBtn = page.getByRole("button", { name: "Go Back" });
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Access transfer-resource page", async ({ page }) => {
  await accessTransferPage(page);
  await assertTransferPageFields(page);
});

test("Submit with empty fields", async ({ page }) => {
  await accessTransferPage(page);
  await assertTransferPageFields(page);

  await myContext.resetBtn.click();
  await myContext.submitBtn.click();
  await expect(page.getByText("Please select an organization")).toBeVisible();
  await expect(page.getByText("Input field is required")).toBeVisible();
});

test("Submit successfully", async ({ page }) => {
  await accessTransferPage(page);
  await assertTransferPageFields(page);

  await myContext.organizationInputField.click();
  await page.getByRole("option").first().click();
  await myContext.quantityField.fill("1");

  await myContext.submitBtn.click();
  await expect(page.getByText("Successfully transfered!")).toBeVisible();
});

test("'Go Back' button", async ({ page }) => {
  await accessTransferPage(page);
  await assertTransferPageFields(page);

  await myContext.backBtn.click();
  await expect(myContext.resourceTableBtn).toBeVisible();
  await myContext.resourceTableBtn.click();
  await expect(
    page.getByRole("heading", { name: "resource table" })
  ).toBeVisible();
});

test("'Reset button' button", async ({ page }) => {
  await accessTransferPage(page);
  await assertTransferPageFields(page);

  await myContext.organizationInputField.click();
  await page.getByRole("option").first().click();
  await myContext.quantityField.fill("1");

  await myContext.resetBtn.click();
  await expect(myContext.organizationInputField).toBeEmpty();
  await expect(myContext.quantityField).toBeEmpty();
});
