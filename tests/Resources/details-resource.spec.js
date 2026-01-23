import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";

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

test.beforeEach(async ({ page }) => {
  await appLogin(page);
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
