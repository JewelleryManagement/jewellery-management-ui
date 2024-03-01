import { test, expect } from "@playwright/test";

const getRandomNumber = () => {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
};

const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

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
    await expect(
      page.locator("#input-23-messages").getByText("Input field is required")
    ).toBeVisible();
    await expect(
      page.locator("#input-25-messages").getByText("Input field is required")
    ).toBeVisible();
    await expect(page.getByText("Email field is required")).toBeVisible();
    await expect(
      page.locator("#input-39-messages").getByText("Input field is required")
    ).toBeVisible();
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
    await navigateToUserPage(page, users[users.length - 1]);

    await wait(3);
    await page.getByRole("button", { name: "Go Back" }).click();
  });
});
