import { test, expect } from "@playwright/test";

const getRandomNumber = () => {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
};

const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

test.describe("Edit user tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("./");
    await page.getByPlaceholder("Email Address").fill("root@gmail.com");
    await page.getByPlaceholder("Password").fill("p@s5W07d");
    await page.getByRole("button", { name: "Log in" }).click();

    page.on("request", (request) =>
      console.log(">>", request.method(), request.url())
    );
    page.on("response", (response) =>
      console.log("<<", response.status(), response.url())
    );
  });

  test.afterEach(async ({ page }) => {
    // await page.close();
  });

  test("Access edit user page", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();
    const responsePromise = page.waitForResponse("http://localhost:8080/users");
    const response = await responsePromise;
    const users = await response.json();
    await page
      .getByRole("row", { name: `${users[0].firstName}` })
      .getByRole("link")
      .click();
    await expect(page.getByText("Edit user")).toBeVisible();

    await expect(page.getByLabel("First name")).toHaveValue(users[0].firstName);
  });

  test("Reset button makes all values empty", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();

    const responsePromise = page.waitForResponse("http://localhost:8080/users");
    const response = await responsePromise;
    const users = await response.json();
    await page
      .getByRole("row", { name: `${users[0].firstName}` })
      .getByRole("link")
      .click();
    await page.getByRole("button", { name: "Reset" }).click();


    await expect(page.getByLabel("First name")).toBeEmpty();
    await expect(page.getByLabel("Last name")).toBeEmpty();
    await expect(page.getByLabel("Email")).toBeEmpty();
    await expect(page.getByLabel("Password", { exact: true })).not.toBeInViewport();
    await expect(page.getByLabel("Phone", { exact: true })).toBeEmpty();
    await expect(page.getByLabel("Phone2")).toBeEmpty();
    await expect(page.getByLabel("Birth date")).toBeEmpty();
    await expect(page.getByLabel("Note")).toBeEmpty();
    await expect(page.getByLabel("Birth date")).toBeEmpty();
    expect(page.locator("div").filter({ hasText: /^USER$/ })).toBeTruthy();
  });
});
