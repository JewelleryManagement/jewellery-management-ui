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
};

const navigateToResourcePage = async (page) => {
    await page.getByRole("link", { name: "Resources" }).click();
    await expect(page).toHaveURL("/resources");
    await expect(page.getByText("All resources table")).toBeVisible();
    await expect(page.getByRole("link", { name: "Add resource" })).toBeVisible();
}

test.describe("Resources tests", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.afterEach(async ({ page }) => {
    // await page.close();
  });

  test("Access resources page", async ({ page }) => {
    await navigateToResourcePage(page)
  });

  test("Access resources 'Add button' ", async ({ page }) => {
    await navigateToResourcePage(page)

    await page.getByRole("link", { name: "Add resource" }).click();
    await expect(page).toHaveURL("/resources/add");
    await expect(page.getByText('Add resource')).toBeVisible();

    await expect(page.getByRole('combobox').locator('div').filter({ hasText: 'Select resource type' }).locator('div').first()).toBeVisible();
  });
});
