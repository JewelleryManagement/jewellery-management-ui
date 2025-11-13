import { test, expect } from "@playwright/test";
import {
  pearlFormFields,
  metalFormFields,
  elementFormFields,
  preciousStoneFormFields,
  semiPreciousStoneFormFields,
} from "tests/utils/resourceTypes";
import { appLogin, navigateToPage } from "tests/utils/functions";

const submitResource = async (page) => {
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    await page.getByText("Successfully created resource!")
  ).toBeVisible();
  const response = await page.waitForResponse((response) => response.request());
  expect(response).toBeDefined();
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
};

const resourceTypesData = [
  { type: "Pearl", fields: pearlFormFields },
  { type: "Metal", fields: metalFormFields },
  { type: "Element", fields: elementFormFields },
  { type: "PreciousStone", fields: preciousStoneFormFields },
  { type: "SemiPreciousStone", fields: semiPreciousStoneFormFields },
];

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  await navigateToPage(
    page,
    expect,
    "Resources",
    "/home",
    "Add Resource",
    "/resources/add",
    "Add resource"
  );
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Access resources 'Add button' and its content ", async ({ page }) => {
  const resourceTypes = [
    "Pearl",
    "Metal",
    "Element",
    "PreciousStone",
    "SemiPreciousStone",
  ];

  await expect(page.locator(".v-select")).toBeVisible();

  for (const resource of resourceTypes) {
    await page.locator(".v-select .v-field__input").click();

    const menu = page.locator(".v-overlay__content .v-list");
    await menu.waitFor();

    const option = menu.locator(".v-list-item-title", {
      hasText: new RegExp(`^${resource}$`),
    });

    await expect(option).toBeVisible();

    await page.click("body");
  }
});

for (const { type, fields } of resourceTypesData) {
  test(`Create a resource type '${type}'`, async ({ page }) => {
    await expect(page.locator(".v-select")).toBeVisible();
    await page.locator(".v-select .v-field__input").click();

    await expect(
      page.getByRole("option", { name: `${type}`, exact: true })
    ).toBeVisible();
    await page.getByRole("option", { name: type, exact: true }).click();

    for (const field of fields) {
      await page.getByLabel(field.label, { exact: true }).fill(field.value);
    }

    await submitResource(page, fields);
  });
}
