import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";
import {
  firstInputSelect,
  secondInputSelect,
  selectDate,
  selectProduct,
  selectResource,
  saleContext,
  createSaleGlobalVariables,
  checkDisabledButtons,
} from "tests/utils/salesUtils";
import { wait } from "tests/utils/functions";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Sales",
    expectedUrl: "/home",
    navChildButtonText: "New Sale",
    expectedNewUrl: "/sales/add",
    expectedHeader: "New Sale",
  });
  createSaleGlobalVariables(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe.serial("Tests that share state", () => {
  test("Create sale", async ({ page }) => {
    const { submitButton } = saleContext;

    await firstInputSelect(page, 1);
    await secondInputSelect(page);

    await selectDate(page, expect);

    await wait(3);
    await selectProduct(page);
    await selectResource(page);

    await submitButton.click();
    await expect(
      page.getByText("Successfully sold the product!"),
    ).toBeVisible();
  });

  test("Create sale with a discount", async ({ page }) => {
    const { submitButton } = saleContext;

    await wait(3);
    await firstInputSelect(page);
    await secondInputSelect(page);

    await selectDate(page, expect);

    await selectProduct(page);
    await page.getByLabel("Discount").first().fill("1");
    await selectResource(page);
    await page.getByLabel("Discount").first().fill("1");

    await submitButton.click();
    await expect(
      page.getByText("Successfully sold the product!"),
    ).toBeVisible();
  });
});

test("Create sale - with empty inputs - fails", async ({ page }) => {
  const { submitButton, calendarBtn, productsBtn, resourcesBtn } = saleContext;

  await submitButton.click();

  await expect(page.getByText("Please select a date!")).toBeVisible();
  await checkDisabledButtons(
    page,
    calendarBtn,
    productsBtn,
    resourcesBtn,
    expect,
  );
});

test("Create sale - without a date - fails", async ({ page }) => {
  const { submitButton } = saleContext;

  await wait(3);
  await firstInputSelect(page);
  await secondInputSelect(page);

  await submitButton.click();
});

test("Create sale - without a products/resources - fails", async ({ page }) => {
  const { submitButton } = saleContext;

  await wait(3);
  await firstInputSelect(page);
  await secondInputSelect(page);
  await selectDate(page, expect);

  await submitButton.click();
  await expect(
    page.getByText("Please select a product or a resource!"),
  ).toBeVisible();
});

test("Reset button - works as expected", async ({ page }) => {
  const { resetButton, calendarBtn, productsBtn, resourcesBtn } = saleContext;

  await wait(3);
  await firstInputSelect(page);
  await secondInputSelect(page);
  await selectDate(page, expect);
  await selectProduct(page);
  await selectResource(page);

  await resetButton.click();

  await checkDisabledButtons(
    page,
    calendarBtn,
    productsBtn,
    resourcesBtn,
    expect,
  );
});

test("GoBack button - works as expected", async ({ page }) => {
  const { goBackButton } = saleContext;

  await expect(page).toHaveURL("/sales/add");
  await goBackButton.click();
  await expect(page).toHaveURL("/home");
});
