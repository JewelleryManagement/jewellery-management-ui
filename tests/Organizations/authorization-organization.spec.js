import { test, expect } from "@playwright/test";
import { appLogin } from "tests/utils/functions";
import { wait, navigateViaNavbar } from "tests/utils/functions";
import {
  createProductGlobalVariables,
  productContext,
  fillProductForm,
  fillTableCellAndPress,
} from "tests/utils/productsUtils";
import {
  firstInputSelect,
  createSaleGlobalVariables,
  secondInputSelect,
  selectDate,
  selectResource,
} from "tests/utils/salesUtils";

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

const loginUserWithManyPermissions = async (page) => {
  await page.goto("./");
  await page
    .getByPlaceholder("Email Address")
    .fill("withManyPermissions@gmail.com");
  await page.getByPlaceholder("Password").fill("testauth1");
  await page.getByRole("button", { name: "Log in" }).click();
  await wait(3);
};

test("View organization table is empty when user has no permissions to read organization", async ({
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

  await expect(page.getByText("No data available")).toBeVisible();
});

test("View organization table only with organizations that user have permissions to read", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
  });

  await page
    .locator(".v-data-table-footer__items-per-page .v-input__control")
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "All" })
    .click();

  await expect(
    page.getByText("Organization with User, Sale and Resources"),
  ).toBeVisible();
});

test("Try to access organization without organization read permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await page.goto("./organizations/c676d048-d0ae-40a8-b5bd-cffcf2095cb2");
  await expect(page.getByText("Organization not found")).toBeVisible();
});

test("Try to access organization tables with only organization read permission", async ({
  page,
}) => {
  await loginUserWithReadPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
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
      name: "Organization with User, Sale and Resources",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "Organization with User, Sale and Resources",
      exact: true,
    })
    .click();
  await page.waitForTimeout(300);
  await expect(page.getByText("Resources Table")).not.toBeVisible();
  await expect(page.getByText("Products Table")).not.toBeVisible();
  await expect(page.getByText("Members Table")).not.toBeVisible();
  await expect(page.getByText("Events Table")).not.toBeVisible();
  await expect(page.getByText("Roles Table")).not.toBeVisible();
});

test("Try to access add user to organization page without add permissions", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
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
      name: "Organization with User, Sale and Resources",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "Organization with User, Sale and Resources",
      exact: true,
    })
    .click();

  await expect(page.getByText("Members Table")).toBeVisible();
  await page.getByText("Members Table").click();
  await expect(page.getByText("Organization members")).toBeVisible();

  await expect(page.getByText("Add User")).not.toBeVisible();
});

test("Try to access delete user in organization without delete permissions", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
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
      name: "Organization with User, Sale and Resources",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "Organization with User, Sale and Resources",
      exact: true,
    })
    .click();

  await expect(page.getByText("Members Table")).toBeVisible();
  await page.getByText("Members Table").click();
  await expect(page.getByText("Organization members")).toBeVisible();

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-delete"),
  ).not.toBeVisible();
});

test("Try to access update user in organization without update permissions", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
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
      name: "Organization with User, Sale and Resources",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "Organization with User, Sale and Resources",
      exact: true,
    })
    .click();

  await expect(page.getByText("Members Table")).toBeVisible();
  await page.getByText("Members Table").click();
  await expect(page.getByText("Organization members")).toBeVisible();

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-pencil"),
  ).not.toBeVisible();
});

test("Try to read products in user without product read and sale read permissions", async ({
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

  await expect(
    page.getByRole("cell", { name: "root", exact: true }),
  ).toBeVisible();
  await page.getByRole("cell", { name: "root", exact: true }).click();

  await expect(page.getByText("Products Table")).toBeVisible();
  await page.getByText("Products Table").click();
  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to access product page without product read permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);
  await page.goto("./products/18f4d7c2-3b6e-4a9f-a2d1-5e8c0b7f9134");
  await expect(page.getByText("Product not found")).toBeVisible();
});

test("Try to create product without product create permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Products",
    expectedUrl: "/home",
    navChildButtonText: "Create Product",
    expectedNewUrl: "/products/add",
    expectedHeader: "Create product",
  });

  createProductGlobalVariables(page);
  const { submitButton, additionalPrice } = productContext;
  await fillProductForm(
    page,
    "Organization with User, Sale and Resources",
    "authProductTest",
    "Test auth product",
    ["root test"],
    "someAuthBArcode",
  );
  await page.getByRole("button", { name: "Resources" }).click();
  await fillTableCellAndPress(page, 1, 1, "2");
  await page.getByRole("button", { name: "Save" }).click();
  await additionalPrice.fill("2");
  await submitButton.click();

  await expect(
    page.getByText("You do not have permission to perform this action"),
  ).toBeVisible();
});

test("Try to delete product without product delete permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Products",
    expectedUrl: "/home",
    navChildButtonText: "All Products",
    expectedNewUrl: "/products",
    expectedHeader: "Products Table",
  });

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-cart-off"),
  ).not.toBeVisible();
});

test("Try to update product without product update permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Products",
    expectedUrl: "/home",
    navChildButtonText: "All Products",
    expectedNewUrl: "/products",
    expectedHeader: "Products Table",
  });

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-pencil"),
  ).not.toBeVisible();
});

test("Try to transfer product without product transfer permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Products",
    expectedUrl: "/home",
    navChildButtonText: "All Products",
    expectedNewUrl: "/products",
    expectedHeader: "Products Table",
  });

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-swap-horizontal"),
  ).not.toBeVisible();
});

test("Try to access products by resource without product read permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Diamond",
    expectedNewUrl: "resources?clazz=Diamond",
    expectedHeader: "All Diamonds table",
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
      name: "P.0",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "P.0",
      exact: true,
    })
    .click();

  await expect(page.getByText("Products Table")).toBeVisible();
  await page.getByText("Products Table").click();
  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to add resource to organization without add permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Element",
    expectedNewUrl: "resources?clazz=Element",
    expectedHeader: "All Elements table",
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
      name: "E.C",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "E.C",
      exact: true,
    })
    .click();

  await page.waitForTimeout(300);

  await expect(page.getByText("Add Quantity")).toBeVisible();
  await page.getByText("Add Quantity").click();
  await expect(page.getByText("Add Quantity")).toBeVisible();

  await page
    .locator(".v-input__control")
    .filter({
      has: page.getByText("Select organization", { exact: true }),
    })
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: "Organization with User, Sale and Resources" })
    .click();

  await page.getByLabel("Quantity", { exact: true }).fill(String(22));
  await page.getByLabel("Delivery Cost", { exact: true }).fill(String(22));
  await page.locator(".v-btn__content", { hasText: "Submit" }).click();

  await expect(
    page.getByText("You do not have permission to perform this action"),
  ).toBeVisible();
});

test("Try to remove resource quantity from organization without remove permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
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
      name: "Organization with User, Sale and Resources",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "Organization with User, Sale and Resources",
      exact: true,
    })
    .click();

  await expect(page.getByText("Resources Table")).toBeVisible();
  await page.getByText("Resources Table").click();
  await expect(
    page.getByText(
      "Organization with User, Sale and Resources's resource table",
    ),
  ).toBeVisible();

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-minus"),
  ).not.toBeVisible();
});

test("Try to transfer resource from organization without transfer permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
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
      name: "Organization with User, Sale and Resources",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "Organization with User, Sale and Resources",
      exact: true,
    })
    .click();

  await expect(page.getByText("Resources Table")).toBeVisible();
  await page.getByText("Resources Table").click();
  await expect(
    page.getByText(
      "Organization with User, Sale and Resources's resource table",
    ),
  ).toBeVisible();

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-swap-horizontal"),
  ).not.toBeVisible();
});

test("Try to access organization quantities by resource only for permitted organizations", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Diamond Melee",
    expectedNewUrl: "resources?clazz=DiamondMelee",
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
    .getByRole("cell", {
      name: "S.C",
      exact: true,
    })
    .click();

  await expect(page.getByText("Organizations Table")).toBeVisible();
  await page.getByText("Organizations Table").click();
  await expect(
    page.getByText("Organizations Owning The Resource Table"),
  ).toBeVisible();

  await expect(
    page.getByText(
      "This is the Organization with User and Sale and Resources.",
    ),
  ).toBeVisible();

  await expect(page.getByText("1-1 of 1")).toBeVisible();
});

test("Try to access organization quantities by resource withot read permissions", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Diamond Melee",
    expectedNewUrl: "resources?clazz=DiamondMelee",
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
    .getByRole("cell", {
      name: "S.C",
      exact: true,
    })
    .click();

  await expect(page.getByText("Organizations Table")).toBeVisible();
  await page.getByText("Organizations Table").click();
  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to create sale without create permission", async ({ page }) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Sales",
    expectedUrl: "/home",
    navChildButtonText: "New Sale",
    expectedNewUrl: "/sales/add",
    expectedHeader: "New Sale",
  });

  await createSaleGlobalVariables(page);
  await firstInputSelect(page, "Organization with User, Sale and Resources");
  await secondInputSelect(page);
  await selectDate(page, expect);
  await selectResource(page);

  const discountField = page.locator(".v-row ", {
    hasText: "quantities of",
  });
  await discountField
    .locator(".v-input__control")
    .filter({
      has: page.getByText("Discount", { exact: true }),
    })
    .locator("input")
    .fill("3");

  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.getByText("You do not have permission to perform this action"),
  ).toBeVisible();
});

test("Try to return product from sale without return permission", async ({
  page,
}) => {
  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Sales",
    expectedUrl: "/home",
    navChildButtonText: "All Sales",
    expectedNewUrl: "/sales",
    expectedHeader: "Sales table",
  });

  await expect(
    page.getByRole("cell", {
      name: "%5.00",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "%5.00",
      exact: true,
    })
    .click();

  await expect(page.getByText("Products Table")).toBeVisible();
  await page.getByText("Products Table").click();
  await expect(page.getByText("Products in the current sale")).toBeVisible();

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-cart-remove"),
  ).not.toBeVisible();
});

test("Try to return resource from sale without return permission", async ({
  page,
}) => {
  await appLogin(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Sales",
    expectedUrl: "/home",
    navChildButtonText: "New Sale",
    expectedNewUrl: "/sales/add",
    expectedHeader: "New Sale",
  });

  await createSaleGlobalVariables(page);
  await firstInputSelect(page, "Organization with User, Sale and Resources");
  await secondInputSelect(page);
  await selectDate(page, expect);
  await selectResource(page);

  const discountField = page.locator(".v-row ", {
    hasText: "quantities of",
  });
  await discountField
    .locator(".v-input__control")
    .filter({
      has: page.getByText("Discount", { exact: true }),
    })
    .locator("input")
    .fill("2");

  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("Successfully sold the product!")).toBeVisible();

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Profile",
    expectedUrl: "/sales",
    navChildButtonText: "Logout",
    expectedNewUrl: "/login",
    expectedHeader: "Welcome Back!",
  });

  await loginUserWithSomePermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Sales",
    expectedUrl: "/home",
    navChildButtonText: "All Sales",
    expectedNewUrl: "/sales",
    expectedHeader: "Sales table",
  });

  await expect(
    page.getByRole("cell", {
      name: "%2.00",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "%2.00",
      exact: true,
    })
    .click();

  await expect(page.getByText("Resources Table")).toBeVisible();
  await page.getByText("Resources Table").click();
  await expect(page.getByText("Current sale's resource table")).toBeVisible();

  await expect(
    page.locator(".v-data-table__tr").locator(".mdi-cart-remove"),
  ).not.toBeVisible();
});

test("Try to get sales from organization without read permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Sales",
    expectedUrl: "/home",
    navChildButtonText: "All Sales",
    expectedNewUrl: "/sales",
    expectedHeader: "Sales table",
  });

  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to access sale page without sale read permission", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);
  await page.goto("./sales/f71bd98e-a7dd-4fb6-8f3e-02e6ac45333c");
  await expect(page.getByText("Sale not found")).toBeVisible();
});

test("Try to access sales by resource without read permissions", async ({
  page,
}) => {
  await loginUserWithoutPermissions(page);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Diamond Melee",
    expectedNewUrl: "resources?clazz=DiamondMelee",
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
    .getByRole("cell", {
      name: "S.C",
      exact: true,
    })
    .click();

  await expect(page.getByText("Sales Table")).toBeVisible();
  await page.getByText("Sales Table").click();
  await expect(page.getByText("No data available")).toBeVisible();
});

test("Try to access role page that does not exists", async ({ page }) => {
  await appLogin(page);
  await page.goto("./roles/c676d048-d0ae-40a8-b5bd-cffcf2095cb2");
  await expect(page.getByText("Role not found")).toBeVisible();
});

test("Add user in organization without role assign permission roles field should not be visible", async ({
  page,
}) => {
  await loginUserWithManyPermissions(page);
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/home",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
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
      name: "Organization with User, Sale and Resources",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: "Organization with User, Sale and Resources",
      exact: true,
    })
    .click();

  await expect(page.getByText("Members Table")).toBeVisible();
  await page.getByText("Members Table").click();
  await expect(page.getByText("Organization members")).toBeVisible();

  await expect(page.getByText("Add User")).toBeVisible();
  await page.getByText("Add User").click();
  await expect(page.getByText("Select Role")).not.toBeVisible();
});
