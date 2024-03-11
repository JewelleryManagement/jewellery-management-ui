import { test, expect } from "@playwright/test";

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
  await wait(3);
};

const navigateToResourcePage = async (page) => {
  await page.getByRole("link", { name: "Resources" }).click();
  await expect(page).toHaveURL("/resources");
  await expect(page.getByText("All resources table")).toBeVisible();
  await expect(page.getByRole("link", { name: "Add resource" })).toBeVisible();
};

const resourceTypes = [
  "All",
  "Pearl",
  "Metal",
  "Element",
  "PreciousStone",
  "SemiPreciousStone",
];

test.beforeEach(async ({ page }) => {
  await login(page);
  await navigateToResourcePage(page);
});

test.afterEach(async ({ page }) => {
  // await page.close();
});

test("FIlter button and its menu is visible ", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Resource Type" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Resource Type" }).click();

  for (const resourceType of resourceTypes) {
    await expect(
      page
        .locator("div")
        .filter({ hasText: new RegExp(`^${resourceType}$`) })
        .first()
    ).toBeVisible();
  }
});

test("Clicking fast on filter button works ", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Resource Type" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Resource Type" }).click();
  await page.locator('div').filter({ hasText: /^Pearl$/ }).first().click();
  await page.getByText('Pearl\'s resources table').click();
  await page.getByRole('button', { name: 'Resource Type' }).click();
  await page.getByText('Element').click();
  await page.getByText('Element\'s resources table').click();
  await page.getByRole('button', { name: 'Resource Type' }).click();
  await page.getByText('All').click();
  await page.getByText('All resources table').click();
  await page.getByRole('button', { name: 'Resource Type' }).click();
  await page.getByRole('listbox').getByText('SemiPreciousStone').click();
  await page.getByText('SemiPreciousStone\'s resources').click();
  await page.getByRole('button', { name: 'Resource Type' }).click();
  await page.getByText('PreciousStone', { exact: true }).click();
  await page.getByText('PreciousStone\'s resources').click();

});
