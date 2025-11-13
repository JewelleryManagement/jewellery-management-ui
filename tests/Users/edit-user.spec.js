import { test, expect } from "@playwright/test";
import { getRandomNumber } from "tests/utils/getRandomNumberOrString";
import { navigateToPage, appLogin } from "tests/utils/functions";
import { userContext, createGlobalVariables } from "tests/utils/userUtils";

const navigateToUserPage = async (page) => {
  await navigateToPage(
    page,
    expect,
    "Users",
    "/home",
    "All Users",
    "/users",
    "Users table"
  );
  await page.getByRole("row").getByRole("link").nth(3).click();
};

test.describe("Edit user tests", () => {
  test.beforeEach(async ({ page }) => {
    await appLogin(page);
    await navigateToUserPage(page);
    createGlobalVariables(page);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Access edit user page", async ({ page }) => {
    await expect(userContext.editHeader).toBeVisible();
  });

  test("Reset button makes all values empty", async ({ page }) => {
    await userContext.resetButton.click();

    await expect(userContext.firstNameLabel).toBeEmpty();
    await expect(userContext.lastNameLabel).toBeEmpty();
    await expect(userContext.emailLabel).toBeEmpty();
    await expect(userContext.passwordLabel).not.toBeInViewport();
    await expect(userContext.firstPhoneLabel).toBeEmpty();
    await expect(userContext.secondPhoneLabel).toBeEmpty();
    await expect(userContext.birthDateLabel).toBeEmpty();
    await expect(userContext.noteLabel).toBeEmpty();
    expect(page.locator("div").filter({ hasText: /^USER$/ })).toBeTruthy();
  });

  test("Submit button does not work if there are empty fields", async ({
    page,
  }) => {
    await userContext.resetButton.click();
    await userContext.submitButton.click();

    await expect(userContext.firstNameLabel).toBeEmpty();
    await expect(userContext.lastNameLabel).toBeEmpty();
    await expect(userContext.emailLabel).toBeEmpty();
    await expect(
      page.getByText("Input field is required").first()
    ).toBeVisible();
    await expect(
      page.getByText("Input field is required").nth(1)
    ).toBeVisible();
    await expect(page.getByText("Email field is required")).toBeVisible();
    await expect(
      page.getByText("Input field is required").nth(2)
    ).toBeVisible();
  });

  test("Edit user successfully", async ({ page }) => {
    const firstName = "firstName" + getRandomNumber();
    const lastName = "lastName" + getRandomNumber();
    const email = "email" + getRandomNumber() + "@gmail.com";

    await userContext.resetButton.click();

    await userContext.firstNameLabel.fill(firstName);
    await userContext.lastNameLabel.fill(lastName);
    await userContext.emailLabel.fill(email);
    await page.getByRole("combobox").locator("i").nth(1).click();
    await page.getByRole("option", { name: "USER" }).click();

    await userContext.submitButton.click();
    const response = await page.waitForResponse((response) =>
      response.request()
    );
    expect(response).toBeDefined();
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    await expect(
      page.getByText(`Successfully updated user ${firstName}`)
    ).toBeVisible();
  });

  test("GO BACK button works", async ({ page }) => {
    expect(userContext.backButton).toBeVisible();
    await page.waitForTimeout(3000);
    await userContext.backButton.click();

    await expect(page).toHaveURL("/users");
    await expect(userContext.tableHeader).toBeVisible();
    await expect(userContext.createButton).toBeVisible();
  });
});
