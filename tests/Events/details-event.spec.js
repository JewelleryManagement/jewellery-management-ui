import { test, expect } from "@playwright/test";
import { wait } from "tests/utils/functions";
import { getRandomNumber } from "tests/utils/getRandomNumberOrString";
import { navigateViaNavbar, appLogin } from "tests/utils/functions";
import { userContext, createGlobalVariables } from "tests/utils/userUtils";
import {
  createOrganizationGlobalVariables,
  organizationContext,
} from "tests/utils/orgUtils";
import {
  createProductGlobalVariables,
  productContext,
  fillProductForm,
  fillTableCellAndPress,
} from "tests/utils/productsUtils";
import {
  firstInputSelect,
  secondInputSelect,
  selectDate,
  saleContext,
  createSaleGlobalVariables,
} from "tests/utils/salesUtils";

let firstName = null;
let lastName = null;
let email = null;
let password = null;

let resourceDescription = null;
let pricePerQuantity = null;
let sku = null;

let organizationName = null;
let address = null;
let organizationNote = null;

let productName = null;
let productDescription = null;
let authors = null;
let barcode = null;

test.beforeEach(async ({ page }) => {
  await appLogin(page);
  createGlobalVariables(page);
  createOrganizationGlobalVariables(page);
  createProductGlobalVariables(page);
  createSaleGlobalVariables(page);

  firstName = "firstName" + getRandomNumber();
  lastName = "lastName" + getRandomNumber();
  email = "email" + getRandomNumber() + "@gmail.com";
  password = "p@s5W07d" + getRandomNumber();

  resourceDescription = "Description" + getRandomNumber();
  pricePerQuantity = getRandomNumber();
  sku = "SKU" + getRandomNumber();

  organizationName =
    getRandomNumber() + "Test Organization" + getRandomNumber();
  address = "Test Address" + getRandomNumber();
  organizationNote = "Test Note" + getRandomNumber();

  productName = "Product" + getRandomNumber();
  productDescription = "Description" + getRandomNumber();
  authors = ["root testroot@gmail.com"];
  barcode = `asd${getRandomNumber()}asdf`;
});

const createUser = async (page) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Users",
    expectedUrl: "/home",
    navChildButtonText: "Create User",
    expectedNewUrl: "/users/create",
    expectedHeader: "Users Create",
  });

  await userContext.firstNameLabel.fill(firstName);
  await userContext.lastNameLabel.fill(lastName);
  await userContext.emailLabel.fill(email);
  await userContext.passwordLabel.fill(password);
  await userContext.submitButton.click();

  await expect(page.getByText("Successfully created user")).toBeVisible();
};

const visitEventPage = async (page, entityIdentifier, eventName) => {
  if (entityIdentifier !== null) {
    await page
      .locator(".v-data-table-footer__items-per-page .v-input__control")
      .click();
    await page
      .locator(".v-overlay-container .v-list-item", {})
      .filter({ hasText: "All" })
      .click();
    await expect(
      page.getByRole("cell", { name: entityIdentifier, exact: true }),
    ).toBeVisible();
    await page
      .getByRole("cell", { name: entityIdentifier, exact: true })
      .click();
  }
  await expect(page.getByText("EVENTS TABLE")).toBeVisible();
  await page.getByText("EVENTS TABLE").click();
  await expect(
    page
      .getByRole("cell", {
        name: eventName,
        exact: true,
      })
      .first(),
  ).toBeVisible();
  await page
    .getByRole("cell", {
      name: eventName,
      exact: true,
    })
    .first()
    .click();
  await expect(
    page.locator(".v-card-title", { hasText: eventName }),
  ).toBeVisible();
};

const checkEventContent = async (locator, ...fields) => {
  for (const field of fields) {
    await expect(locator.getByText(field, { exact: true })).toBeVisible();
  }
};

const checkEventRawContent = async (page) => {
  await expect(page.getByText("RAW")).toBeVisible();
  await page.getByText("RAW").click();
  const jsonText = await page.locator("pre.text-left.text-body-2").innerText();
  expect(() => JSON.parse(jsonText)).not.toThrow();
};

const clickIconButton = async (page, entityIdentifier, icon) => {
  await expect(
    page
      .locator(".v-data-table__tr", { hasText: entityIdentifier })
      .locator(icon),
  ).toBeVisible();

  await page
    .locator(".v-data-table__tr", { hasText: entityIdentifier })
    .locator(icon)
    .click();
};

const checkEntityContent = async (page, entityTitle, ...fields) => {
  const card = page.locator(".v-card", { hasText: entityTitle });
  await expect(page.getByText(entityTitle)).toBeVisible();
  await checkEventContent(card, ...fields);
  await card.getByText("RAW").click();
  const jsonBefore = await card
    .locator("pre.text-left.text-body-2")
    .innerText();
  expect(() => JSON.parse(jsonBefore)).not.toThrow();
};

const createResource = async (page, expectedurl, organization) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Resources",
    expectedUrl: expectedurl,
    navChildButtonText: "Element",
    expectedNewUrl: "/resources?clazz=Element",
    expectedHeader: "All Elements table",
  });
  await expect(
    page.locator(".v-btn__content", { hasText: "Add Element" }),
  ).toBeVisible();
  await page.locator(".v-btn__content", { hasText: "Add Element" }).click();
  await expect(page.getByText("Submit")).toBeVisible();
  await page.getByLabel("Description").fill(String(resourceDescription));
  await page
    .getByLabel("Price per quantity", { exact: true })
    .fill(String(pricePerQuantity));
  await page
    .getByRole("textbox", { name: "Stock Keeping Unit Stock" })
    .fill(String(sku));
  await page.locator(".v-btn__content", { hasText: "Submit" }).click();
  if (organization !== null) {
    await fillDropdownInput(page, "Select organization", organization);
  }

  await addQuantity(page);
};

const addQuantity = async (page) => {
  await page.getByLabel("Quantity", { exact: true }).fill(String(22));
  await page.getByLabel("Delivery Cost", { exact: true }).fill(String(22));
  await page.locator(".v-btn__content", { hasText: "Submit" }).click();
  await expect(page.getByText("All Elements table")).toBeVisible();
};

const createOrganization = async (page, expectedUrl) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: expectedUrl,
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
  });
  await expect(
    page.locator(".v-btn__content", { hasText: "NEW ORGANIZATION" }),
  ).toBeVisible();
  page.locator(".v-btn__content", { hasText: "NEW ORGANIZATION" }).click();
  await expect(page.getByText("Create organization")).toBeVisible();
  const { nameInput, addressInput, noteInput, submitButton } =
    organizationContext;
  await nameInput.fill(organizationName);
  await addressInput.fill(address);
  await noteInput.fill(organizationNote);

  await submitButton.click();

  await expect(
    page.getByText("Successfully created an organization!"),
  ).toBeVisible();
};

const addUserToOrganization = async (page) => {
  await expect(page.getByText("Members table")).toBeVisible();
  await page.getByText("Members table").click();
  await expect(page.getByText("Organization members")).toBeVisible();
  await expect(page.getByText("Add User")).toBeVisible();
  await page.getByText("Add User").click();
  await fillDropdownInput(page, "Select a user", "admin@gmail.com");
  const checkbox = page.locator(".v-input__control", {
    hasText: "CREATE_PRODUCT",
  });
  await expect(
    checkbox
      .locator(".v-selection-control__input")
      .locator(".mdi-checkbox-blank-outline"),
  ).toBeVisible();
  await checkbox.locator(".v-selection-control__input").click();
  await page.locator(".v-btn__content", { hasText: "Add User" }).click();
  await expect(page.getByText("Successfully added user to org!")).toBeVisible();
};

const acceptDialog = (page) => {
  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });
};

const createProduct = async (page, expectedUrl) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Products",
    expectedUrl: expectedUrl,
    navChildButtonText: "Create Product",
    expectedNewUrl: "/products/add",
    expectedHeader: "Create product",
  });
  const { submitButton, additionalPrice } = productContext;
  await fillProductForm(
    page,
    productName,
    productDescription,
    authors,
    barcode,
  );
  await page.getByRole("button", { name: "Resources" }).click();
  await fillTableCellAndPress(page, 1, 1, "2");
  await page.getByRole("button", { name: "Save" }).click();
  await additionalPrice.fill("2");
  await submitButton.click();
  await expect(page.getByText("Successfully added product!")).toBeVisible();
};

const fillDropdownInput = async (page, fieldName, identifier) => {
  await page
    .locator(".v-input__control")
    .filter({
      has: page.getByText(fieldName, { exact: true }),
    })
    .click();
  await page
    .locator(".v-overlay-container .v-list-item", {})
    .filter({ hasText: identifier })
    .click();
};

const createSale = async (page, discount) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Sales",
    expectedUrl: "/products",
    navChildButtonText: "New Sale",
    expectedNewUrl: "/sales/add",
    expectedHeader: "New Sale",
  });
  const { submitButton, resourcesBtn, saveBtn, productsBtn } = saleContext;
  await firstInputSelect(page, 1);
  await secondInputSelect(page);
  await selectDate(page, expect);
  await wait(3);
  await resourcesBtn.click();
  await page
    .locator(".v-data-table__tr", { hasText: sku })
    .locator(".v-data-table__td")
    .first()
    .click();

  await page
    .locator(".v-data-table__tr", { hasText: sku })
    .locator(".v-data-table__td")
    .first()
    .press("1");
  await saveBtn.click();
  await productsBtn.click();
  await clickIconButton(page, productDescription, ".mdi-plus");
  await saveBtn.click();

  await fillDiscountField(page, "quantities of", discount);
  await fillDiscountField(page, `Price for ${productName}`, discount);

  await submitButton.click();
  await expect(page.getByText("Successfully sold the product!")).toBeVisible();
};

const fillDiscountField = async (page, identifier, discount) => {
  const discountField = page.locator(".v-row ", {
    hasText: identifier,
  });
  await discountField
    .locator(".v-input__control")
    .filter({
      has: page.getByText("Discount", { exact: true }),
    })
    .locator("input")
    .fill(discount);
};

const checkEntityAfterTable = async (
  page,
  tableWithData,
  data,
  tableWithoutData,
) => {
  const vCardAfter = page.locator(".v-card", { hasText: "Entity After" });
  await vCardAfter.getByText("BACK").click();
  await vCardAfter.getByText(tableWithData).click();
  await expect(vCardAfter.getByText(data)).toBeVisible();
  await vCardAfter.getByText(tableWithoutData).click();
  await expect(vCardAfter.getByText("No data available")).toBeVisible();
};

test("Create user event", async ({ page }) => {
  await createUser(page);
  await visitEventPage(page, email, "Create User");
  await checkEventContent(page, firstName, lastName, email);
  await checkEventRawContent(page);
});

test("Update user event", async ({ page }) => {
  await createUser(page);
  await clickIconButton(page, email, ".mdi-pencil");

  const newEmail = "email" + getRandomNumber() + "@gmail.com";
  await userContext.emailLabel.fill(newEmail);
  await userContext.submitButton.click();
  await expect(page.getByText("Successfully updated user")).toBeVisible();

  await visitEventPage(page, newEmail, "Update User");
  await checkEntityContent(page, "Entity Before", firstName, lastName, email);
  await checkEntityContent(page, "Entity After", firstName, lastName, newEmail);
});

test("Create resource event", async ({ page }) => {
  await createResource(page, "/home", null);
  await visitEventPage(page, resourceDescription, "Create Resource");
  await checkEventContent(page, resourceDescription, pricePerQuantity, sku);
  await checkEventRawContent(page);
});

test("Update resource event", async ({ page }) => {
  await createResource(page, "/home", null);
  await clickIconButton(page, resourceDescription, ".mdi-pencil");

  await expect(page.getByText("Edit Element")).toBeVisible();
  const newDescription = resourceDescription + getRandomNumber();
  await page.getByLabel("Description").fill(String(newDescription));
  await page.locator(".v-btn__content", { hasText: "SUBMIT" }).click();
  await expect(page.getByText("Successfully edited resource!")).toBeVisible();

  await visitEventPage(page, newDescription, "Update Resource");

  await checkEntityContent(
    page,
    "Entity Before",
    resourceDescription,
    pricePerQuantity,
    sku,
  );
  await checkEntityContent(
    page,
    "Entity After",
    newDescription,
    pricePerQuantity,
    sku,
  );
});

test("Create organization event", async ({ page }) => {
  await createOrganization(page, "/home");
  await visitEventPage(page, organizationName, "Create Organization");
  await checkEventContent(page, organizationName, address, organizationNote);
  await checkEventRawContent(page);
});

test("Create user in organization event", async ({ page }) => {
  await createOrganization(page, "/home");

  await expect(page.getByText(organizationName)).toBeVisible();
  await page.getByText(organizationName).click();

  await addUserToOrganization(page);
  await visitEventPage(page, null, "Create User In Organization");
  await checkEventContent(page, `[ "CREATE_PRODUCT" ]`);
  await checkEventRawContent(page);
});

test("Delete user in organization event", async ({ page }) => {
  await createOrganization(page, "/home");

  await expect(page.getByText(organizationName)).toBeVisible();
  await page.getByText(organizationName).click();

  await addUserToOrganization(page);

  await expect(page.getByText("Members table")).toBeVisible();
  await page.getByText("Members table").click();
  await expect(page.getByText("Organization members")).toBeVisible();

  acceptDialog(page);

  await clickIconButton(page, "admin@gmail.com", ".mdi-delete");

  await page.reload();

  await visitEventPage(page, null, "Delete User In Organization");
  await checkEventContent(page, "admin@gmail.com");
  await checkEventRawContent(page);
});

test("Update user in organization event", async ({ page }) => {
  await createOrganization(page, "/home");

  await expect(page.getByText(organizationName)).toBeVisible();
  await page.getByText(organizationName).click();

  await addUserToOrganization(page);

  await expect(page.getByText("Members table")).toBeVisible();
  await page.getByText("Members table").click();
  await expect(page.getByText("Organization members")).toBeVisible();

  await clickIconButton(page, "admin@gmail.com", ".mdi-pencil");

  const checkbox2 = page.locator(".v-input__control", {
    hasText: "EDIT_PRODUCT",
  });
  await expect(
    checkbox2
      .locator(".v-selection-control__input")
      .locator(".mdi-checkbox-blank-outline"),
  ).toBeVisible();
  await checkbox2.locator(".v-selection-control__input").click();
  await page.locator(".v-btn__content", { hasText: "Add User" }).click();
  await expect(
    page.getByText("Successfully Edited user in org!"),
  ).toBeVisible();

  await visitEventPage(page, null, "Update User In Organization");
  await checkEntityContent(page, "Entity Before", `[ "CREATE_PRODUCT" ]`);
  await checkEntityContent(
    page,
    "Entity After",
    `[ "CREATE_PRODUCT", "EDIT_PRODUCT" ]`,
  );
});

test("Add resource quantity to organization event", async ({ page }) => {
  await createResource(page, "/home", null);
  await clickIconButton(page, resourceDescription, ".mdi-plus");
  await addQuantity(page);
  await visitEventPage(
    page,
    resourceDescription,
    "Add Resource Quantity To Organization",
  );

  await checkEntityContent(page, "Entity Before", "Quantity: 22");
  await checkEntityContent(page, "Entity After", "Quantity: 44");
});

test("Remove resource quantity from organization event", async ({ page }) => {
  await createOrganization(page, "/home");
  await createResource(page, "/organizations", organizationName);

  await navigateViaNavbar(page, expect, {
    navParentButtonText: "Organizations",
    expectedUrl: "/resources?clazz=Element",
    navChildButtonText: "All Organizations",
    expectedNewUrl: "/organizations",
    expectedHeader: "Organizations Table",
  });
  await expect(page.getByText(organizationName)).toBeVisible();
  await page.getByText(organizationName).click();
  await expect(page.getByText("Resources Table")).toBeVisible();
  await page.getByText("Resources Table").click();

  await clickIconButton(page, resourceDescription, ".mdi-minus");

  await expect(page.getByText("Remove Quantity")).toBeVisible();
  await page.locator(".v-btn__content", { hasText: "Submit" }).click();

  await visitEventPage(
    page,
    null,
    "Remove Resource Quantity From Organization",
  );
  await checkEntityContent(page, "Entity Before", "Quantity: 22");
  await checkEntityContent(page, "Entity After", "Quantity: 0");
});

test("Create product event", async ({ page }) => {
  await createProduct(page, "/home");
  await visitEventPage(page, productDescription, "Create Products");
  await checkEventContent(page, productName, productDescription);
  await checkEventRawContent(page);
});

test("Update product event", async ({ page }) => {
  const { submitButton, catalogNameButton } = productContext;
  await createProduct(page, "/home");

  await page.getByLabel("Search").fill(productName);
  await expect(page.getByRole("cell", { name: productName })).toBeVisible();
  await expect(page.getByRole("cell", { name: productName })).toBeVisible();

  await clickIconButton(page, productName, ".mdi-pencil");

  await expect(page.getByText("Edit product")).toBeVisible();
  const newProductName = productName + getRandomNumber();
  await catalogNameButton.fill(newProductName);
  await submitButton.click();
  await expect(page.getByText("Successfully updated product!")).toBeVisible();

  await visitEventPage(page, newProductName, "Update Product");
  await checkEntityContent(
    page,
    "Entity Before",
    productName,
    productDescription,
    "Resources Table",
    "Products Table",
  );
  await checkEntityContent(
    page,
    "Entity After",
    newProductName,
    productDescription,
    "Resources Table",
    "Products Table",
  );
});

test("Transfer Product event", async ({ page }) => {
  await createProduct(page, "/home");
  await createOrganization(page, "/products");

  await expect(
    page.getByText("Organization with User, Sale and Resources"),
  ).toBeVisible();
  await page.getByText("Organization with User, Sale and Resources").click();
  await expect(page.getByText("Products Table")).toBeVisible();
  await page.getByText("Products Table").click();

  await clickIconButton(page, productDescription, ".mdi-swap-horizontal");
  await fillDropdownInput(page, "Select organization", organizationName);

  await page.locator(".v-btn", { hasText: "Submit" }).click();
  await page.reload();

  await visitEventPage(page, null, "Transfer Product");
  await checkEntityContent(
    page,
    "Entity Before",
    productName,
    productDescription,
    "Organization with User, Sale and Resources",
    "Resources Table",
    "Products Table",
  );
  await checkEntityContent(
    page,
    "Entity After",
    productName,
    productDescription,
    organizationName,
    "Resources Table",
    "Products Table",
  );
});

test("Transfer resource event", async ({ page }) => {
  await createResource(page, "/home", null);
  await createOrganization(page, "/resources?clazz=Element");

  await expect(
    page.getByText("Organization with User, Sale and Resources"),
  ).toBeVisible();
  await page.getByText("Organization with User, Sale and Resources").click();

  await expect(page.getByText("Resources Table")).toBeVisible();
  await page.getByText("Resources Table").click();

  await clickIconButton(page, sku, ".mdi-swap-horizontal");
  await fillDropdownInput(page, "Select organization", organizationName);

  await page.locator(".v-btn", { hasText: "Submit" }).click();
  await expect(page.getByText("Events Table")).toBeVisible();

  await page.reload();

  await visitEventPage(page, null, "Transfer Resource");
  await checkEventContent(
    page,
    "Previous Owner: Organization with User, Sale and Resources",
    `New Owner: ${organizationName}`,
    resourceDescription,
    pricePerQuantity,
    sku,
  );
  await checkEventRawContent(page);
});

test("Create sale event", async ({ page }) => {
  test.setTimeout(60000);
  await createResource(page, "/home", null);
  await createProduct(page, "/resources?clazz=Element");
  const discount = "23";
  await createSale(page, discount);
  await visitEventPage(page, `%${discount}.00`, "Create Sale");
  await checkEventContent(
    page,
    `Discount:${discount}`,
    "Resources Table",
    "Products Table",
  );
  await checkEventRawContent(page);
});

test("Return product event", async ({ page }) => {
  test.setTimeout(60000);
  await createResource(page, "/home", null);
  await createProduct(page, "/resources?clazz=Element");
  const discount = "24";
  await createSale(page, discount);

  await expect(page.getByText(`%${discount}`)).toBeVisible();
  await page.getByText(`%${discount}`).click();
  await expect(page.getByText("PRODUCTS TABLE")).toBeVisible();
  await page.getByText("PRODUCTS TABLE").click();

  acceptDialog(page);
  await clickIconButton(page, productDescription, ".mdi-cart-remove");

  await expect(page.getByText("Sales table")).toBeVisible();

  await visitEventPage(page, `%${discount}.00`, "Return Product From Sale");
  await checkEntityContent(
    page,
    "Returned Product",
    productName,
    productDescription,
  );
  await checkEntityContent(
    page,
    "Entity After",
    `Discount:${discount}`,
    "Resources Table",
    "Products Table",
  );

  await checkEntityAfterTable(page, "Resources Table", sku, "Products Table");
});

test("Return resource event", async ({ page }) => {
  test.setTimeout(60000);
  await createResource(page, "/home", null);
  await createProduct(page, "/resources?clazz=Element");
  const discount = "25";
  await createSale(page, discount);

  await expect(page.getByText(`%${discount}`)).toBeVisible();
  await page.getByText(`%${discount}`).click();
  await expect(page.getByText("RESOURCES TABLE")).toBeVisible();
  await page.getByText("RESOURCES TABLE").click();

  acceptDialog(page);
  await clickIconButton(page, sku, ".mdi-cart-remove");

  await expect(page.getByText("Sales table")).toBeVisible();

  await visitEventPage(page, `%${discount}.00`, "Return Resource From Sale");

  await checkEntityContent(page, "Returned Resource", sku, resourceDescription);
  await checkEntityContent(
    page,
    "Entity After",
    `Discount:${discount}`,
    "Resources Table",
    "Products Table",
  );

  await checkEntityAfterTable(
    page,
    "Products Table",
    productDescription,
    "Resources Table",
  );
});
