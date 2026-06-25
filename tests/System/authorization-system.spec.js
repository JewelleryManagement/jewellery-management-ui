import { test, expect } from "@playwright/test";
import { wait, navigateViaNavbar } from "tests/utils/functions";

const loginUserWithoutPermissions = async (page) => {
  await page.goto("./");
  await page
    .getByPlaceholder("Email Address")
    .fill("withoutPermissions@gmail.com");
  await page.getByPlaceholder("Password").fill("testauth1");
  await page.getByRole("button", { name: "Log in" }).click();
  await wait(3);
};

const loginUserWithReadPermissions = async (page) => {
  await page.goto("./");
  await page
    .getByPlaceholder("Email Address")
    .fill("withReadPermissions@gmail.com");
  await page.getByPlaceholder("Password").fill("testauth1");
  await page.getByRole("button", { name: "Log in" }).click();
  await wait(3);
};

const loginUserWithSomePermissions = async (page) => {
  await page.goto("./");
  await page
    .getByPlaceholder("Email Address")
    .fill("withSomePermissions@gmail.com");
  await page.getByPlaceholder("Password").fill("testauth1");
  await page.getByRole("button", { name: "Log in" }).click();
  await wait(3);
};

const checkNavbarButton = async (
  page,
  navParentButtonText,
  navChildButtonText,
) => {
  const drawer = page.locator(".v-navigation-drawer");

  await drawer.hover();
  await expect(
    drawer.getByText(navParentButtonText, { exact: true }),
  ).toBeVisible();

  await drawer.getByText(navParentButtonText, { exact: true }).click();

  await expect(page.getByText(navChildButtonText)).not.toBeVisible();
};

test("View user table is empty when user has no read permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Users",
    expectedUrl: "/home",
    navChildButtonText: "All Users",
    expectedNewUrl: "/users",
    expectedHeader: "Users table",
  });

  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to access create user page without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Users",
    expectedUrl: "/home",
    navChildButtonText: "All Users",
    expectedNewUrl: "/users",
    expectedHeader: "Users table",
  });

  await expect(page.getByText("Create User")).not.toBeVisible();
});

test("Try to access user details page without read permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./users/88596531-7f0f-407d-b502-31833b8c8e8d");
  await expect(page.getByText("User not found")).toBeVisible();
});

test("Try to update user without update permission", async ({ page }) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Users",
    expectedUrl: "/home",
    navChildButtonText: "All Users",
    expectedNewUrl: "/users",
    expectedHeader: "Users table",
  });

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-pencil"),
  ).not.toBeVisible();
});

test("Try to access user organization roles without read permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Users",
    expectedUrl: "/home",
    navChildButtonText: "All Users",
    expectedNewUrl: "/users",
    expectedHeader: "Users table",
  });

  await page
    .locator(".v-data-table-footer__items-per-page .v-input__control")
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "All" })
    .click();

  await expect(
    page.getByRole("cell", {
      name: "root",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "root",
      exact: true,
    })
    .click();

  await expect(page.getByText("Organization Roles Table")).toBeVisible();
  await page.getByText("Organization Roles Table").click();

  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to access user system roles without read permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Users",
    expectedUrl: "/home",
    navChildButtonText: "All Users",
    expectedNewUrl: "/users",
    expectedHeader: "Users table",
  });

  await page
    .locator(".v-data-table-footer__items-per-page .v-input__control")
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "All" })
    .click();

  await expect(
    page.getByRole("cell", {
      name: "root",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "root",
      exact: true,
    })
    .click();

  await expect(page.getByText("System Roles Table")).toBeVisible();
  await page.getByText("System Roles Table").click();

  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to access all resources table without read permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "All",
    expectedNewUrl: "/resources",
    expectedHeader: "All resources table",
  });

  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to access resources details page without read permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./resources/00d905ba-836f-4cef-8827-c339ca94367c");

  await expect(page.getByText("Resource not found")).toBeVisible();
});

test("Try to create resource without create permission", async ({ page }) => {
  await loginUserWithoutPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "All",
    expectedNewUrl: "/resources",
    expectedHeader: "All resources table",
  });

  await expect(page.getByText("ADD")).not.toBeVisible();
});

test("Try to update resource without update permission", async ({ page }) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "All",
    expectedNewUrl: "/resources",
    expectedHeader: "All resources table",
  });

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-pencil"),
  ).not.toBeVisible();
});

test("Try to delete resource without delete permission", async ({ page }) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "All",
    expectedNewUrl: "/resources",
    expectedHeader: "All resources table",
  });

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-delete"),
  ).not.toBeVisible();
});

test("Try to duplicate resource without create permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "All",
    expectedNewUrl: "/resources",
    expectedHeader: "All resources table",
  });

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-content-duplicate"),
  ).not.toBeVisible();
});

test("Try to update resource via deatils page without update permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Diamond Melee",
    expectedNewUrl: "/resources?clazz=DiamondMelee",
    expectedHeader: "All Diamond Melees table",
  });

  await page
    .locator(".v-data-table-footer__items-per-page .v-input__control")
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "All" })
    .click();

  await expect(
    page.getByRole("cell", {
      name: "S.C",
      exact: true,
    }),
  ).toBeVisible();

  await page
    .getByRole("cell", { name: "S.C", exact: true })
    .click({ force: true });

  await page.waitForTimeout(600);

  await expect(page.getByText("DiamondMelee", { exact: true })).toBeVisible();
  await expect(page.getByText("Edit")).not.toBeVisible();
});

test("Try to delete resource via deatils page without delete permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Diamond Melee",
    expectedNewUrl: "/resources?clazz=DiamondMelee",
    expectedHeader: "All Diamond Melees table",
  });

  await page
    .locator(".v-data-table-footer__items-per-page .v-input__control")
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "All" })
    .click();

  await expect(
    page.getByRole("cell", {
      name: "S.C",
      exact: true,
    }),
  ).toBeVisible();

  await page
    .getByRole("cell", { name: "S.C", exact: true })
    .click({ force: true });

  await page.waitForTimeout(600);

  await expect(page.getByText("DiamondMelee", { exact: true })).toBeVisible();
  await expect(page.getByText("Delete")).not.toBeVisible();
});

test("Try to duplicate resource via deatils page without create permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Diamond Melee",
    expectedNewUrl: "/resources?clazz=DiamondMelee",
    expectedHeader: "All Diamond Melees table",
  });

  await page
    .locator(".v-data-table-footer__items-per-page .v-input__control")
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "All" })
    .click();

  await expect(
    page.getByRole("cell", {
      name: "S.C",
      exact: true,
    }),
  ).toBeVisible();

  await page
    .getByRole("cell", { name: "S.C", exact: true })
    .click({ force: true });

  await page.waitForTimeout(600);

  await expect(page.getByText("DiamondMelee", { exact: true })).toBeVisible();
  await expect(page.getByText("Duplicate")).not.toBeVisible();
});

test("Try to access roles table without read permission", async ({ page }) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/home",
    navChildButtonText: "System Roles",
    expectedNewUrl: "/roles/system",
    expectedHeader: "System Roles Table",
  });

  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to access create role without create permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/home",
    navChildButtonText: "Organization Roles",
    expectedNewUrl: "/roles/organization",
    expectedHeader: "Organization Roles Table",
  });

  await expect(page.getByText("Create Role")).not.toBeVisible();
});

test("Try to access role details page without read permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);

  await page.goto("./roles/7f2d3b9a-6c41-4e58-9fd6-2f8f789f12a1");

  await expect(page.getByText("Role not found")).toBeVisible();
});

test("Try to delete organization role without delete permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/home",
    navChildButtonText: "Organization Roles",
    expectedNewUrl: "/roles/organization",
    expectedHeader: "Organization Roles Table",
  });

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-delete"),
  ).not.toBeVisible();
});

test("Try to delete system role without delete permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Roles",
    expectedUrl: "/home",
    navChildButtonText: "System Roles",
    expectedNewUrl: "/roles/system",
    expectedHeader: "System Roles Table",
  });

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-delete"),
  ).not.toBeVisible();
});

test("Try to access user create page without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./users/create");

  await expect(page.getByText("Page not found")).toBeVisible();
});

test("Try to access user edit page without update permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./users/edit/88596531-7f0f-407d-b502-31833b8c8e8d");

  await expect(page.getByText("Page not found")).toBeVisible();
});

test("Try to access resource create page without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./resources/add");

  await expect(page.getByText("Page not found")).toBeVisible();
});

test("Try to access resource edit page without update permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./resources/edit/00d905ba-836f-4cef-8827-c339ca94367c");

  await expect(page.getByText("Page not found")).toBeVisible();
});

test("Try to access resource duplicate page without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./resources/duplicate/00d905ba-836f-4cef-8827-c339ca94367c");

  await expect(page.getByText("Page not found")).toBeVisible();
});

test("Try to access organization create page without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./organizations/add");

  await expect(page.getByText("Page not found")).toBeVisible();
});

test("Try to access system role create page without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./roles/system/create");

  await expect(page.getByText("Page not found")).toBeVisible();
});

test("Try to access organization role create page without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await page.goto("./roles/organization/create");

  await expect(page.getByText("Page not found")).toBeVisible();
});

test("Try to access create organization button without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
  });

  await expect(page.getByText("New Organization")).not.toBeVisible();
});

test("Try to create user navbar button without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await checkNavbarButton(page, "Users", "Create User");
});

test("Try to create resource navbar button without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await checkNavbarButton(page, "Resources", "Add Resource");
});

test("Try to create organization navbar button without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await checkNavbarButton(page, "Organizations", "New Organization");
});

test("Try to create organization role navbar button without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await checkNavbarButton(page, "Roles", "Create Organization Role");
});

test("Try to create system role navbar button without create permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await checkNavbarButton(page, "Roles", "Create System Role");
});
