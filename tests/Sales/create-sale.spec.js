import { test, expect } from "@playwright/test";
import { appLogin, navigateToPage } from "tests/utils/functions";
import {
  firstInputSelect,
  secondInputSelect,
  selectDate,
  selectProduct,
  selectResource,
  myContext,
  createGlobalVariables,
} from "tests/utils/salesUtils";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(page, expect, "sales");
  await expect(page).toHaveURL("/sales");
  await expect(page.getByText("NEW SALE")).toBeVisible();
  createGlobalVariables(page);
});

test.afterEach(async ({ page }) => {
  // await page.close();
});

test("Create sale", async ({ page }) => {
  const { newSaleBtn, submitButton } = myContext;
  await newSaleBtn.click();

  await firstInputSelect(page);
  await secondInputSelect(page);

  await selectDate(page);

  await selectProduct(page);
  await selectResource(page);

  await submitButton.click();
  expect(page.getByText("Successfully sold the product!")).toBeVisible();
});

test("Create sale with a discount", async ({ page }) => {
  const { newSaleBtn, submitButton } = myContext;
  await newSaleBtn.click();

  await firstInputSelect(page);
  await secondInputSelect(page);

  await selectDate(page);

  await selectProduct(page);
  await page.locator("#input-154").fill("1");

  await selectResource(page);
  await page.locator("#input-181").fill("1");

  await submitButton.click();
  expect(page.getByText("Successfully sold the product!")).toBeVisible();
});

test("Create sale without any information fails", async ({ page }) => {
  const { newSaleBtn, submitButton } = myContext;
  await newSaleBtn.click();


  await submitButton.click();
  await expect(page.getByText('Please select a date!')).toBeVisible();
});

test("Create sale fails without a date", async ({ page }) => {
  const { newSaleBtn, submitButton } = myContext;
  await newSaleBtn.click();

  await firstInputSelect(page);
  await secondInputSelect(page);

  await submitButton.click();
  await expect(page.getByText('Please select a date!')).toBeVisible();
});