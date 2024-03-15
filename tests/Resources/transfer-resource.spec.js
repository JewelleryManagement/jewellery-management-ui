import { test, expect } from "@playwright/test";
import { wait, appLogin, navigateToPage } from "tests/utils/functions";

const myContext = {};

const accessTransferPage = async (page) => {
  await page.getByLabel("Search").fill("root");
  await page.getByRole("cell", { name: "root", exact: true }).click();
  await page.getByRole("button", { name: "Show Resources" }).click();
  await page.locator("td:nth-child(2)").first().click();
};

const assertTransferPageFields = async (page) => {
  await expect(page.getByText("Transfer Quantity")).toBeVisible();
  await expect(myContext.userField).toBeVisible();
  await expect(myContext.quantityField).toBeVisible();
  await expect(myContext.deliveryCostField).not.toBeVisible();
  await expect(myContext.submitBtn).toBeVisible();
  await expect(myContext.resetBtn).toBeVisible();
  await expect(myContext.backBtn).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(page, expect, "users");

  myContext.userField = page
    .getByRole("combobox")
    .locator("div")
    .filter({ hasText: "Select user" })
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

  await myContext.submitBtn.click();
  await expect(page.getByText("Please select a user")).toBeVisible();
  await expect(page.getByText("Input field is required")).toBeVisible();
});

test("Submit successfully", async ({ page }) => {
  await accessTransferPage(page);
  await assertTransferPageFields(page);

  await page.getByText("User: root test - Quantity:").click();
  await myContext.userField.click();
  await page.getByRole("option", { name: "testUser1 test testUser1@" }).click();
  await myContext.quantityField.fill("1");

  await myContext.submitBtn.click();
  await expect(page.getByText("Successfully transfered!")).toBeVisible();
});

test("'Go Back' button", async ({ page }) => {
  await accessTransferPage(page);
  await assertTransferPageFields(page);

  await myContext.backBtn.click();
  await expect(page.getByText("root test")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Show Resources" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Show Products" })
  ).toBeVisible();
});

test("'Reset button' button", async ({ page }) => {
  await accessTransferPage(page);
  await assertTransferPageFields(page);

  await myContext.userField.click();
  await page.getByRole("option", { name: "testUser1 test testUser1@" }).click();
  await myContext.quantityField.fill("1");

  await myContext.resetBtn.click();
  await expect(myContext.userField).toBeEmpty();
  await expect(myContext.quantityField).toBeEmpty();
});
