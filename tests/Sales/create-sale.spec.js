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
  checkErrorMessages,
  checkDisabledButtons,
} from "tests/utils/salesUtils";
import { wait } from "tests/utils/functions";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(page, expect, "sales");
  await expect(page).toHaveURL("/sales");
  await expect(page.getByText("NEW SALE")).toBeVisible();
  createGlobalVariables(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Create sale", async ({ page }) => {
  const { newSaleBtn, submitButton } = myContext;
  await newSaleBtn.click();

  await wait(3);
  await firstInputSelect(page);
  await secondInputSelect(page);

  await selectDate(page, expect);

  await selectProduct(page);
  await selectResource(page);

  await submitButton.click();
  expect(page.getByText("Successfully sold the product!")).toBeVisible();
});

test("Create sale with a discount", async ({ page }) => {
  const { newSaleBtn, submitButton } = myContext;
  await newSaleBtn.click();

  await wait(3);
  await firstInputSelect(page);
  await secondInputSelect(page);

  await selectDate(page, expect);

  await selectProduct(page);
  await page.locator("#input-156").fill("1");

  await selectResource(page);
  await page.locator("#input-183").fill("1");

  await submitButton.click();
  expect(page.getByText("Successfully sold the product!")).toBeVisible();
});

test("Create sale - with empty inputs - fails", async ({ page }) => {
  const { newSaleBtn, submitButton, calendarBtn, productsBtn, resourcesBtn } =
    myContext;
  await newSaleBtn.click();
  await submitButton.click();

  await checkErrorMessages(page, expect);
  await checkDisabledButtons(
    page,
    calendarBtn,
    productsBtn,
    resourcesBtn,
    expect
  );
});

test("Create sale - without a date - fails", async ({ page }) => {
  const { newSaleBtn, submitButton } = myContext;
  await newSaleBtn.click();

  await wait(3);
  await firstInputSelect(page);
  await secondInputSelect(page);

  await submitButton.click();
  await expect(page.getByText("Please select a date!")).toBeVisible();
});

test("Create sale - without a products/resources - fails", async ({ page }) => {
  const { newSaleBtn, submitButton } = myContext;
  await newSaleBtn.click();

  await wait(3);
  await firstInputSelect(page);
  await secondInputSelect(page);
  await selectDate(page, expect);

  await submitButton.click();
  await expect(
    page.getByText("Please select a product or a resource!")
  ).toBeVisible();
});

test("Reset button - works as expected", async ({ page }) => {
  const { newSaleBtn, resetButton, calendarBtn, productsBtn, resourcesBtn } =
    myContext;
  await newSaleBtn.click();

  await wait(3);
  await firstInputSelect(page);
  await secondInputSelect(page);
  await selectDate(page, expect);
  await selectProduct(page);
  await selectResource(page);

  await resetButton.click();

  await checkErrorMessages(page, expect);

  await checkDisabledButtons(
    page,
    calendarBtn,
    productsBtn,
    resourcesBtn,
    expect
  );
});

test("GoBack button - works as expected", async ({ page }) => {
  const { newSaleBtn, goBackButton } = myContext;
  await newSaleBtn.click();
  await expect(page).toHaveURL("/sales/add");
  await goBackButton.click();
  await expect(page).toHaveURL("/sales");
});
