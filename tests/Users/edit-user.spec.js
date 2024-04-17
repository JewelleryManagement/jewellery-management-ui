import { test, expect } from "@playwright/test";
import { getRandomNumber } from "tests/utils/getRandomNumberOrString";

const getUsers = async (page) => {
  const responsePromise = page.waitForResponse("http://localhost:8080/users");
  const response = await responsePromise;
  return await response.json();
};

const login = async (page) => {
  await page.goto("./");
  await page.getByPlaceholder("Email Address").fill("root@gmail.com");
  await page.getByPlaceholder("Password").fill("p@s5W07d");
  await page.getByRole("button", { name: "Log in" }).click();
};

const navigateToUserPage = async (page, user) => {
  await page.getByRole("link", { name: "Users" }).click();
  await page.getByRole("row", { name: `${user.firstName}` })
    .getByRole("link").click();
};


test.describe("Edit user tests", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Access edit user page", async ({ page }) => {
    const users = await getUsers(page);
    await navigateToUserPage(page, users[0]);

    await expect(page.getByText("Edit user")).toBeVisible();
    await expect(page.getByLabel("First name")).toHaveValue(users[0].firstName);
  });

  test("Reset button makes all values empty", async ({ page }) => {
    const users = await getUsers(page);
    await navigateToUserPage(page, users[0]);

    await page.getByRole("button", { name: "Reset" }).click();

    await expect(page.getByLabel("First name")).toBeEmpty();
    await expect(page.getByLabel("Last name")).toBeEmpty();
    await expect(page.getByLabel("Email")).toBeEmpty();
    await expect(
      page.getByLabel("Password", { exact: true })
    ).not.toBeInViewport();
    await expect(page.getByLabel("Phone", { exact: true })).toBeEmpty();
    await expect(page.getByLabel("Phone2")).toBeEmpty();
    await expect(page.getByLabel("Birth date")).toBeEmpty();
    await expect(page.getByLabel("Note")).toBeEmpty();
    await expect(page.getByLabel("Birth date")).toBeEmpty();
    expect(page.locator("div").filter({ hasText: /^USER$/ })).toBeTruthy();
  });

  test("Submit button does not work if there are empty fields", async ({
    page,
  }) => {
    const users = await getUsers(page);
    await navigateToUserPage(page, users[users.length - 1]);

    await page.getByRole("button", { name: "Reset" }).click();
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByLabel("First name")).toBeEmpty();
    await expect(page.getByLabel("Last name")).toBeEmpty();
    await expect(page.getByLabel("Email")).toBeEmpty();
    await expect(page.getByText("Input field is required").first()).toBeVisible();
    await expect(page.getByText("Input field is required").nth(1)).toBeVisible();
    await expect(page.getByText("Email field is required")).toBeVisible();
    await expect(page.getByText("Input field is required").nth(2)).toBeVisible();
  });

  test("Edit user successfully", async ({ page }) => {
    const users = await getUsers(page);
    await navigateToUserPage(page, users[users.length - 1]);

    const firstName = "firstName" + getRandomNumber();
    const lastName = "lastName" + getRandomNumber();
    const email = "email" + getRandomNumber() + "@gmail.com";

    await page.getByRole("button", { name: "Reset" }).click();

    await page.getByLabel("First name").fill(firstName);
    await page.getByLabel("Last name").fill(lastName);
    await page.getByLabel("Email").fill(email);
    await page.getByRole("combobox").locator("i").nth(1).click();
    await page.getByRole("option", { name: "USER" }).click();

    await page.getByRole("button", { name: "Submit" }).click();
    const response = await page.waitForResponse(response => response.request());
    expect(response).toBeDefined(); 
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    await expect(
      page.getByText(`Successfully updated user ${firstName}`)
    ).toBeVisible();
  });

  test("GO BACK button works", async ({ page }) => {
    const users = await getUsers(page);
    const lastUser = users[users.length - 1]
    await navigateToUserPage(page, lastUser);

    const backButton = page.locator('button:has-text("GO BACK")');
    expect(backButton).toBeVisible()
    await page.waitForTimeout(3000)
    await backButton.click();


    await expect(page).toHaveURL('/users')
    await expect(page.getByRole('heading', { name: 'Users table' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create user' })).toBeVisible();
  });
});
