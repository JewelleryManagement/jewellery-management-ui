import { test, expect } from "@playwright/test";
import {
  pearlFormFields,
  metalFormFields,
  elementFormFields,
  preciousStoneFormFields,
  semiPreciousStoneFormFields,
} from "tests/utils/resourceTypes";

const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const login = async (page) => {
  await page.goto("./");
  await page.getByPlaceholder("Email Address").fill("root@gmail.com");
  await page.getByPlaceholder("Password").fill("p@s5W07d");
  await page.getByRole("button", { name: "Log in" }).click();
};

const navigateToResourcePage = async (page) => {
  await page.getByRole("link", { name: "Resources" }).click();
  await expect(page).toHaveURL("/resources");
  await expect(page.getByText("All resources table")).toBeVisible();
  await expect(page.getByRole("link", { name: "Add resource" })).toBeVisible();
};

const submitResource = async (page) => {
  await page.getByRole("button", { name: "Submit" }).click();
  expect(page.getByText("Successfully created resource!")).toBeVisible();
  const response = await page.waitForResponse((response) => response.request());
  expect(response).toBeDefined();
  expect(response.status()).toBe(201);
  expect(response.ok()).toBeTruthy();
};

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.afterEach(async ({ page }) => {
  // await page.close();
});

test("Access resources page", async ({ page }) => {
  await navigateToResourcePage(page);
});

test("Access resources 'Add button' and its content ", async ({ page }) => {
  const resourceTypes = [
    "Pearl",
    "Metal",
    "Element",
    "PreciousStone",
    "SemiPreciousStone",
  ];

  await navigateToResourcePage(page);

  await page.getByRole("link", { name: "Add resource" }).click();
  await expect(page).toHaveURL("/resources/add");
  await expect(page.getByText("Add resource")).toBeVisible();

  await expect(
    page
      .getByRole("combobox")
      .locator("div")
      .filter({ hasText: "Select resource type" })
      .locator("div")
      .first()
  ).toBeVisible();
  await page
    .getByRole("combobox")
    .locator("div")
    .filter({ hasText: "Select resource type" })
    .locator("div")
    .first()
    .click();

  for (const resource of resourceTypes) {
    await expect(
      page
        .locator("div")
        .filter({ hasText: new RegExp(`^${resource}$`) })
        .first()
    ).toBeVisible();
  }
});

test("Create a resource type 'Pearl'", async ({ page }) => {
  await navigateToResourcePage(page);
  await page.getByRole("link", { name: "Add resource" }).click();
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Pearl" }).click();

  for (const field of pearlFormFields) {
    await page
      .getByLabel(field.label, { exact: field.exact })
      .fill(field.value);
  }

  await submitResource(page);
});

test("Create a resource type 'Metal'", async ({ page }) => {
  await navigateToResourcePage(page);
  await page.getByRole("link", { name: "Add resource" }).click();
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Metal", exact: true }).click();

  for (const field of metalFormFields) {
    await page
      .getByLabel(field.label, { exact: field.exact })
      .fill(field.value);
  }

  await submitResource(page);
});

test("Create a resource type 'Element'", async ({ page }) => {
  await navigateToResourcePage(page);
  await page.getByRole("link", { name: "Add resource" }).click();
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Element" }).click();

  for (const field of elementFormFields) {
    await page
      .getByLabel(field.label, { exact: field.exact })
      .fill(field.value);
  }

  await submitResource(page);
});

test("Create a resource type 'Precious Stone'", async ({ page }) => {
  await navigateToResourcePage(page);
  await page.getByRole("link", { name: "Add resource" }).click();
  await page.getByRole("combobox").click();
  await page
    .getByRole("option", { name: "PreciousStone", exact: true })
    .click();

  for (const field of preciousStoneFormFields) {
    await page
      .getByLabel(field.label, { exact: field.exact })
      .fill(field.value);
  }

  await submitResource(page);
});

test("Create a resource type 'Semi Precious Stone'", async ({ page }) => {
  await navigateToResourcePage(page);
  await page.getByRole("link", { name: "Add resource" }).click();
  await page.getByRole("combobox").click();
  await page
    .getByRole("option", { name: "SemiPreciousStone", exact: true })
    .click();

  for (const field of semiPreciousStoneFormFields) {
    await page
      .getByLabel(field.label, { exact: field.exact })
      .fill(field.value);
  }

  await submitResource(page);
});
