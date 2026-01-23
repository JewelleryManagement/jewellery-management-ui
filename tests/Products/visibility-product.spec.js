import { test, expect } from "@playwright/test";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Products",
    expectedUrl: "/home",
    navChildButtonText: "All Products",
    expectedNewUrl: "/products",
    expectedHeader: "Products Table",
  });
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("partOfProduct products should not have disassemble and transfer buttons enabled ", async ({
  page,
}) => {
  const classAttribute =
    "v-btn v-btn--disabled v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-plain icon-only-btn";

  await page.getByRole("cell", { name: "Part of product" }).dblclick();
  await expect(page.locator("td:nth-child(8)").first()).toContainText("Yes");
  const disassemblyButtonLocator = page
    .locator("button.v-btn", {
      has: page.locator("i.mdi-cart-off"),
    })
    .first();
  const transferButtonLocator = page
    .locator("button.v-btn", {
      has: page.locator("i.mdi-swap-horizontal"),
    })
    .first();

  await expect(disassemblyButtonLocator).toHaveClass(classAttribute);
  await expect(transferButtonLocator).toHaveClass(classAttribute);
});

test("Sold products should not have disassemble and transfer buttons enabled ", async ({
  page,
}) => {
  const classAttribute =
    "v-btn v-btn--disabled v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-plain icon-only-btn";

  await page.getByRole("cell", { name: "Sold", exact: true }).dblclick();
  await expect(page.locator("td:nth-child(6)").first()).toContainText("Yes");
  const disassemblyButtonLocator = page
    .locator("button.v-btn", {
      has: page.locator("i.mdi-cart-off"),
    })
    .first();
  const transferButtonLocator = page
    .locator("button.v-btn", {
      has: page.locator("i.mdi-swap-horizontal"),
    })
    .first();

  await expect(disassemblyButtonLocator).toHaveClass(classAttribute);
  await expect(transferButtonLocator).toHaveClass(classAttribute);
});
