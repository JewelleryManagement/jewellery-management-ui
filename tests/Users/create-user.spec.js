import { test, expect } from "@playwright/test";
import { getRandomNumber } from "tests/utils/getRandomNumberOrString";
import { navigateViaNavbar, appLogin, wait } from "tests/utils/functions";
import { userContext, createGlobalVariables } from "tests/utils/userUtils";

const firstName = "firstName" + getRandomNumber();
const lastName = "lastName" + getRandomNumber();
const email = "email" + getRandomNumber() + "@gmail.com";
const password = "p@s5W07d" + getRandomNumber();
const phone = "359884334" + getRandomNumber();
const birthDate = "2024-02-14";
const note = firstName + lastName + password + phone;

const navigateToUserCreatePage = async (page) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Users",
    expectedUrl: "/home",
    navChildButtonText: "Create User",
    expectedNewUrl: "/users/create",
    expectedHeader: "Users Create",
  });
};

const navigateToUserTablePage = async (page) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Users",
    expectedUrl: "/home",
    navChildButtonText: "All Users",
    expectedNewUrl: "/users",
    expectedHeader: "Users table",
  });
};

test.describe("Create user tests", () => {
  test.beforeEach(async ({ page }) => {
    await appLogin(page);
    createGlobalVariables(page);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Access Create User page from navbar and going back and forth", async ({
    page,
  }) => {
    await navigateToUserCreatePage(page);

    await expect(userContext.backButton).toBeVisible();
    await wait(1);

    await userContext.backButton.click();
    await expect(page).toHaveURL("/home");
    await wait(1);

    await navigateToUserCreatePage(page);

    await expect(userContext.backButton).toBeVisible();
    await wait(1);

    await userContext.backButton.click();
    await expect(page).toHaveURL("/home");
    await wait(1);
  });

  test("Access Create User page from users page and going back and forth", async ({
    page,
  }) => {
    await navigateToUserTablePage(page);

    await expect(userContext.createButton).toBeVisible();
    await wait(1);

    await userContext.createButton.click();
    await expect(page).toHaveURL("/users/create");
    await expect(userContext.backButton).toBeVisible();
    await wait(1);

    await userContext.backButton.click();
    await expect(page).toHaveURL("/users");
    await expect(userContext.tableHeader).toBeVisible();
    await expect(userContext.createButton).toBeVisible();
    await wait(1);

    await userContext.createButton.click();
    await expect(page).toHaveURL("/users/create");
    await expect(userContext.backButton).toBeVisible();
    await wait(1);

    await userContext.backButton.click();
    await expect(page).toHaveURL("/users");
    await expect(userContext.tableHeader).toBeVisible();
    await expect(userContext.createButton).toBeVisible();
    await wait(1);
  });

  test("Create user successfully", async ({ page }) => {
    await navigateToUserCreatePage(page);

    await userContext.firstNameLabel.fill(firstName);
    await userContext.lastNameLabel.fill(lastName);
    await userContext.emailLabel.fill(email);
    await userContext.passwordLabel.fill(password);
    await userContext.submitButton.click();

    await expect(page.getByText("Successfully created user")).toBeVisible();
  });

  test("Create user with bad password is unsuccessful", async ({ page }) => {
    await navigateToUserCreatePage(page);

    await userContext.firstNameLabel.fill(firstName);
    await userContext.lastNameLabel.fill(lastName);
    await userContext.emailLabel.fill(email);
    await userContext.passwordLabel.fill("123");
    await userContext.submitButton.click();

    await expect(page.getByText("Password must be at")).toBeVisible();
  });

  test("Reset button makes all inputs empty", async ({ page }) => {
    await navigateToUserCreatePage(page);

    await expect(userContext.firstNameLabel).toBeEmpty();
    await expect(userContext.lastNameLabel).toBeEmpty();
    await expect(userContext.emailLabel).toBeEmpty();
    await expect(userContext.passwordLabel).toBeEmpty();
    await expect(userContext.firstPhoneLabel).toBeEmpty();
    await expect(userContext.secondPhoneLabel).toBeEmpty();
    await expect(userContext.birthDateLabel).toBeEmpty();
    await expect(userContext.noteLabel).toBeEmpty();
    expect(userContext.role).toBeTruthy();

    await userContext.firstNameLabel.fill(firstName);
    await userContext.lastNameLabel.fill(lastName);
    await userContext.emailLabel.fill(email);
    await userContext.passwordLabel.fill(password);
    await userContext.firstPhoneLabel.fill(phone);
    await userContext.secondPhoneLabel.fill(phone);
    await userContext.birthDateLabel.fill(birthDate);
    await userContext.noteLabel.fill(note);
    await page.locator(".v-input__control", { hasText: "Role" }).click();
    await page.getByRole("option", { name: "ADMIN" }).click();

    await userContext.resetButton.click();

    await expect(userContext.firstNameLabel).toBeEmpty();
    await expect(userContext.lastNameLabel).toBeEmpty();
    await expect(userContext.emailLabel).toBeEmpty();
    await expect(userContext.passwordLabel).toBeEmpty();
    await expect(userContext.firstPhoneLabel).toBeEmpty();
    await expect(userContext.secondPhoneLabel).toBeEmpty();
    await expect(userContext.birthDateLabel).toBeEmpty();
    await expect(userContext.noteLabel).toBeEmpty();
    expect(userContext.role).toBeTruthy();
  });
});
