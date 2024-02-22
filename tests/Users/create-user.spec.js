import { test, expect } from "@playwright/test";

const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const getRandomNumber = () => {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
};

test.describe("Users tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
    await page.getByPlaceholder("Email Address").fill("root@gmail.com");
    await page.getByPlaceholder("Password").fill("p@s5W07d");
    await page.getByRole("button", { name: "Log in" }).click();
  });

  test.afterEach(async ({ page }) => {
    // await page.close();
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

  test("Create user unsuccessfully with bad password", async ({ page }) => {
    const firstName = "firstName" + getRandomNumber();
    const lastName = "lastName" + getRandomNumber();
    const email = "email" + getRandomNumber() + "@gmail.com";

    await page.getByRole("link", { name: "Users" }).click();
    await page.getByRole("link", { name: "Create user" }).click();
    await page.getByLabel("First name").fill(firstName);
    await page.getByLabel("Last name").fill(lastName);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill('123');
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Successfully created user")).toBeVisible();
  });


});
