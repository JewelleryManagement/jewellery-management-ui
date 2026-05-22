import { test, expect } from "@playwright/test";
import { appLogin } from "tests/utils/functions";
import { navigateViaNavbar } from "tests/utils/functions";

test.beforeEach(async ({ page }) => {
  await appLogin(page);
});

const tableVisivility = async (page, expect) => {
  await expect(
    page.getByRole("link", { name: "Organization Roles" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "System Roles" })).toBeVisible();
  await expect(page.getByText("Create Role", { exact: true })).toBeVisible();
  await expect(page.getByText("Name", { exact: true })).toBeVisible();
  await expect(page.getByText("Role Type", { exact: true })).toBeVisible();
  await expect(page.getByText("Permissions", { exact: true })).toBeVisible();
};

const createRolePageVisibility = async (page, expect) => {
  await expect(page.getByRole("textbox", { name: "Role name" })).toBeVisible();
  await expect(page.getByText("Permissions")).toBeVisible();
  await expect(page.getByText("Submit")).toBeVisible();
  await expect(page.getByText("Reset")).toBeVisible();
  await expect(page.getByText("Go Back")).toBeVisible();
};

test("Visit roles tables", async ({ page }) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/home",
    navChildButtonText: "Organization Roles",
    expectedNewUrl: "/roles/organization",
    expectedHeader: "Organization Roles Table",
  });

  await tableVisivility(page, expect);
  await expect(
    page.getByText("ORGANIZATION_ADMIN", { exact: true }),
  ).toBeVisible();

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/roles/organization",
    navChildButtonText: "System Roles",
    expectedNewUrl: "/roles/system",
    expectedHeader: "System Roles Table",
  });

  await tableVisivility(page, expect);
  await expect(
    page.getByText("No data available", { exact: true }),
  ).toBeVisible();
});

test("Test roles table's filer buttons", async ({ page }) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/home",
    navChildButtonText: "Organization Roles",
    expectedNewUrl: "/roles/organization",
    expectedHeader: "Organization Roles Table",
  });

  await expect(
    page.getByRole("link", { name: "Organization Roles" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "System Roles" })).toBeVisible();

  await page.getByRole("link", { name: "Organization Roles" }).click();
  await expect(
    page.getByText("Organization Roles Table", { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL("/roles/organization");

  await page.getByRole("link", { name: "System Roles" }).click();
  await expect(
    page.getByText("System Roles Table", { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL("/roles/system");
});

test("Access create role page via navbar", async ({ page }) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/home",
    navChildButtonText: "Create Organization Role",
    expectedNewUrl: "/roles/organization/create",
    expectedHeader: "Create Organization Role",
  });

  await createRolePageVisibility(page, expect);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/roles/organization/create",
    navChildButtonText: "Create System Role",
    expectedNewUrl: "/roles/system/create",
    expectedHeader: "Create System Role",
  });

  await createRolePageVisibility(page, expect);
});

test("Create test organization role", async ({ page }) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/home",
    navChildButtonText: "Create Organization Role",
    expectedNewUrl: "/roles/organization/create",
    expectedHeader: "Create Organization Role",
  });

  await expect(page.getByRole("textbox", { name: "Role name" })).toBeVisible();
  await page.getByRole("textbox", { name: "Role name" }).fill("Test_Role");
  await expect(
    page.getByText("Read Organization", { exact: true }),
  ).toBeVisible();
  await page.getByText("Read Organization", { exact: true }).click();
  await page.getByText("Submit").click();
  await expect(
    page.getByText("Role Test_Role created successfully"),
  ).toBeVisible();
});
