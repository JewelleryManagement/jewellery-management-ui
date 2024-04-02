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
  await navigateToPage(page, expect, 'resources')
  await page.getByRole("link", { name: "Add resource" }).click();
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Access resources 'Add button' and its content ", async ({ page }) => {
  await expect(page).toHaveURL("/resources/add");
  await expect(page.getByText("Add resource")).toBeVisible();

  const resourceTypes = [
    "Pearl",
    "Metal",
    "Element",
    "PreciousStone",
    "SemiPreciousStone",
  ];

  await expect(page.getByRole("combobox")).toBeVisible();
  const combobox = page.getByRole("combobox");
  await combobox.click();

  for (const resource of resourceTypes) {
    await expect(
      page
        .locator("div")
        .filter({ hasText: new RegExp(`^${resource}$`) })
        .first()
    ).toBeVisible();
  }
});

for (const { type, fields } of resourceTypesData) {
  test(`Create a resource type '${type}'`, async ({ page }) => {
    await expect(page.getByRole("combobox")).toBeVisible();
    await page.getByRole("combobox").click();

    await expect(
      page.getByRole("option", { name: `${type}`, exact: true })
    ).toBeVisible();
    await page.getByRole("option", { name: type, exact: true }).click();

    for (const field of fields) {
      await page
        .getByLabel(field.label, { exact: field.exact })
        .fill(field.value);
    }

    await submitResource(page, fields);
  });
}
