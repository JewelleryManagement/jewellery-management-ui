import { test, expect } from "@playwright/test";

const getRandomNumber = () => {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
};

const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

test.describe("Create user tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
    await page.getByPlaceholder("Email Address").fill("root@gmail.com");
    await page.getByPlaceholder("Password").fill("p@s5W07d");
    await page.getByRole("button", { name: "Log in" }).click();
  });

  test.afterEach(async ({ page }) => {
    // await page.close();
  });

  test("Access Create User page and going back and forth", async ({ page }) => {
    await page.getByRole('link', { name: 'Users' }).click();
    await expect(page).toHaveURL('http://localhost:3000/users');
    await expect(page.getByRole('heading', { name: 'Users table' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create user' })).toBeVisible();

    await page.getByRole('link', { name: 'Create user' }).click();
    await expect(page).toHaveURL('http://localhost:3000/users/create');
    

    await expect(page.getByRole('button', { name: 'Go Back' })).toBeVisible();
    await wait(3)
    await page.getByRole('button', { name: 'Go Back' }).click();
    await expect(page).toHaveURL('http://localhost:3000/users');

    await page.getByRole('link', { name: 'Create user' }).click();
    await expect(page).toHaveURL('http://localhost:3000/users/create');
    await expect(page.getByRole('button', { name: 'Go Back' })).toBeVisible();
    await wait(3)
    await page.getByRole('button', { name: 'Go Back' }).click();
    await expect(page).toHaveURL('http://localhost:3000/users');
});

  test("Create user successfully", async ({ page }) => {
    const firstName = "firstName" + getRandomNumber();
    const lastName = "lastName" + getRandomNumber();
    const email = "email" + getRandomNumber() + "@gmail.com";
    const password = "p@s5W07d" + getRandomNumber();

    await page.getByRole("link", { name: "Users" }).click();
    await page.getByRole("link", { name: "Create user" }).click();
    await page.getByLabel("First name").fill(firstName);
    await page.getByLabel("Last name").fill(lastName);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Successfully created user")).toBeVisible();
  });

  test("Create user with bad password is unsuccessful", async ({ page }) => {
    const firstName = "firstName" + getRandomNumber();
    const lastName = "lastName" + getRandomNumber();
    const email = "email" + getRandomNumber() + "@gmail.com";

    await page.getByRole("link", { name: "Users" }).click();
    await page.getByRole("link", { name: "Create user" }).click();
    await page.getByLabel("First name").fill(firstName);
    await page.getByLabel("Last name").fill(lastName);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("123");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Password must contain at")).toBeVisible();
  });

  test("Reset button makes all inputs empty", async ({ page }) => {
    const firstName = "firstName" + getRandomNumber();
    const lastName = "lastName" + getRandomNumber();
    const email = "email" + getRandomNumber() + "@gmail.com";
    const password = "p@s5W07d" + getRandomNumber();
    const phone = "359884334" + getRandomNumber();

    await page.getByRole("link", { name: "Users" }).click();
    await page.getByRole("link", { name: "Create user" }).click();

    await expect(page.getByLabel("First name")).toBeEmpty();
    await expect(page.getByLabel("Last name")).toBeEmpty();
    await expect(page.getByLabel("Email")).toBeEmpty();
    await expect(page.getByLabel("Password", { exact: true })).toBeEmpty();
    await expect(page.getByLabel("Phone", { exact: true })).toBeEmpty();
    await expect(page.getByLabel("Phone2")).toBeEmpty();
    await expect(page.getByLabel("Birth date")).toBeEmpty();
    await expect(page.getByLabel("Note")).toBeEmpty();
    await expect(page.getByLabel("Birth date")).toBeEmpty();
    expect(page.locator("div").filter({ hasText: /^USER$/ })).toBeTruthy();

    await page.getByLabel("First name").fill(firstName);
    await page.getByLabel("Last name").fill(lastName);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Phone", { exact: true }).fill(phone);
    await page.getByLabel("Phone2", { exact: true }).fill(phone);
    await page.getByLabel("Birth date").fill("2024-02-14");
    await page.getByLabel("Note").fill(firstName + lastName + password + phone);
    await page
      .locator(
        "div:nth-child(10) > .v-input__control > .v-field > .v-field__append-inner"
      )
      .click();
    await page.getByText("ADMIN").click();
    await page.getByRole("button", { name: "Reset" }).click();

    await expect(page.getByLabel("First name")).toBeEmpty();
    await expect(page.getByLabel("Last name")).toBeEmpty();
    await expect(page.getByLabel("Email")).toBeEmpty();
    await expect(page.getByLabel("Password", { exact: true })).toBeEmpty();
    await expect(page.getByLabel("Phone", { exact: true })).toBeEmpty();
    await expect(page.getByLabel("Phone2")).toBeEmpty();
    await expect(page.getByLabel("Birth date")).toBeEmpty();
    await expect(page.getByLabel("Note")).toBeEmpty();
    await expect(page.getByLabel("Birth date")).toBeEmpty();
    expect(page.locator("div").filter({ hasText: /^USER$/ })).toBeTruthy();
  });
});
