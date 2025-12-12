import { test, expect } from "@playwright/test";
import { resourceTypesData } from "tests/utils/resourceTypes";
import { appLogin, navigateViaNavbar, wait } from "tests/utils/functions";

const selectResource = async (page, type, pageTitle) => {
  await expect(page.locator(".v-select")).toBeVisible();
  await page.locator(".v-select .v-field__input").click();
  await expect(
    page.getByRole("option", { name: `${type}`, exact: true })
  ).toBeVisible();
  await page.getByRole("option", { name: type, exact: true }).click();

  await expect(page.locator(".v-main").getByText(pageTitle)).toBeVisible();
};

const selectDropdownField = async (
  page,
  selectFieldLabel,
  selectFieldValue
) => {
  if (selectFieldLabel) {
    await page
      .locator(".v-select")
      .filter({
        has: page.getByText(selectFieldLabel, { exact: true }),
      })
      .click();
    await page
      .locator(".v-overlay-container .v-list-item", {})
      .filter({ hasText: selectFieldValue })
      .click();
  }
};

const fillFields = async (page, fields) => {
  for (const field of fields) {
    if (field.sku) {
      const row = page.locator(".v-form .d-flex.flex-row").filter({
        has: page.getByLabel(field.label, { exact: true }),
      });

      await row.getByLabel(field.label, { exact: true }).fill(field.value);
      const skuInput = row.getByLabel("SKU", { exact: true });

      if (await skuInput.isEnabled()) {
        await skuInput.fill(field.sku);
      }
    } else {
      await page.getByLabel(field.label, { exact: true }).fill(field.value);
    }
  }
};

const submitResource = async (page) => {
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    await page.getByText("Successfully created resource!")
  ).toBeVisible();
  const response = await page.waitForResponse((response) => response.request());
  expect(response).toBeDefined();
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
};

const generateFinalSkuString = (fields) => {
  return fields
    .filter((field) => field.sku !== undefined)
    .map((field) => field.sku)
    .join(".");
};

test.beforeEach(async ({ page }) => {
  await appLogin(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Access resources 'Add button' from navbar and its content ", async ({
  page,
}) => {
  await navigateViaNavbar(page, expect, {
    navParentButtonText: "All Resources",
    expectedUrl: "/home",
    navChildButtonText: "Add Resource",
    expectedNewUrl: "/resources/add",
    expectedHeader: "Add Resource",
  });

  await expect(page.locator(".v-select")).toBeVisible();

  for (const { type } of resourceTypesData) {
    await page.locator(".v-select .v-field__input").click();
    const menu = page.locator(".v-overlay__content .v-list");
    await menu.waitFor();

    await expect(
      menu.locator(".v-list-item-title", {
        hasText: new RegExp(`^${type}$`),
      })
    ).toBeVisible();

    await page.locator(".v-select .v-field__input").click();
  }
});

for (const { type, button, pageTitle } of resourceTypesData) {
  test(`Access resources 'Add ${type}' from navbar and its content `, async ({
    page,
  }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: button,
      expectedUrl: "/home",
      navChildButtonText: `Add ${button}`,
      expectedNewUrl: `/resources/add?clazz=${type}`,
      expectedHeader: pageTitle,
    });
  });
}

for (const { type, button, pageTitle } of resourceTypesData) {
  test(`Access 'Add ${type}' from navbar and go back by pressing back button `, async ({
    page,
  }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: button,
      expectedUrl: "/home",
      navChildButtonText: `Add ${button}`,
      expectedNewUrl: `/resources/add?clazz=${type}`,
      expectedHeader: pageTitle,
    });

    await page.getByRole("button", { name: "BACK" }).click();
    await expect(page).toHaveURL("/home");
  });
}

for (const {
  type,
  selectFieldLabel,
  button,
  pageTitle,
  fields,
} of resourceTypesData) {
  test(`Create ${type} should fail when required fields are empty `, async ({
    page,
  }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: button,
      expectedUrl: "/home",
      navChildButtonText: `Add ${button}`,
      expectedNewUrl: `/resources/add?clazz=${type}`,
      expectedHeader: pageTitle,
    });

    const errorMessage = "Input field is required";

    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();

    if (selectFieldLabel) {
      const selectableRaw = page.locator(".v-select").filter({
        has: page.getByText(selectFieldLabel, { exact: true }),
      });
      await expect(selectableRaw.locator(".v-messages__message")).toHaveText(
        errorMessage
      );
    }

    for (const field of fields) {
      if (field.required) {
        if (field.sku) {
          const row = page.locator(".v-form .d-flex.flex-row").filter({
            has: page.getByLabel(field.label, { exact: true }),
          });
          await expect(row.locator(".v-messages__message")).toHaveText(
            errorMessage
          );
        } else {
          await expect(
            page
              .locator(".v-input", {
                has: page.getByLabel(field.label, { exact: true }),
              })
              .locator(".v-messages__message")
          ).toHaveText(errorMessage);
        }
      }
    }
    await expect(
      page
        .locator(".v-input", {
          has: page.getByLabel("Stock Keeping Unit", { exact: true }),
        })
        .locator(".v-messages__message")
    ).toHaveText(errorMessage);
  });
}

for (const {
  type,
  pageTitle,
  selectFieldLabel,
  selectFieldValue,
  fields,
} of resourceTypesData) {
  test(`Reset button should reset ${type} form`, async ({ page }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: "All Resources",
      expectedUrl: "/home",
      navChildButtonText: "Add Resource",
      expectedNewUrl: "/resources/add",
      expectedHeader: "Add Resource",
    });

    await selectResource(page, type, pageTitle);

    await selectDropdownField(page, selectFieldLabel, selectFieldValue);
    await fillFields(page, fields);

    await page.getByRole("button", { name: "GENERATE" }).click();

    await page.getByRole("button", { name: "RESET" }).click();

    for (const field of fields) {
      if (field.sku) {
        const row = page.locator(".v-form .d-flex.flex-row").filter({
          has: page.getByLabel(field.label, { exact: true }),
        });

        await expect(row.getByLabel(field.label, { exact: true })).toHaveValue(
          ""
        );
        await expect(row.getByLabel("SKU", { exact: true })).toHaveValue("");
      } else {
        await expect(page.getByLabel(field.label, { exact: true })).toHaveValue(
          ""
        );
      }
    }

    await expect(
      page.getByLabel("Stock Keeping Unit", { exact: true })
    ).toHaveValue("");
  });
}

for (const {
  type,
  pageTitle,
  selectFieldLabel,
  selectFieldValue,
  fields,
  button,
} of resourceTypesData) {
  test(`Create a resource type '${type}' with same Stock Keeping Unit should fail`, async ({
    page,
  }) => {
    const SKU = `${type} Test Sku`;

    await navigateViaNavbar(page, expect, {
      navParentButtonText: "All Resources",
      expectedUrl: "/home",
      navChildButtonText: "Add Resource",
      expectedNewUrl: "/resources/add",
      expectedHeader: "Add Resource",
    });

    await selectResource(page, type, pageTitle);

    await selectDropdownField(page, selectFieldLabel, selectFieldValue);
    await fillFields(page, fields);

    await page.getByLabel("Stock Keeping Unit", { exact: true }).fill(SKU);

    await submitResource(page);

    wait(5);

    await page
      .locator(".v-btn", { hasText: `ADD ${button.toUpperCase()}` })
      .click();

    await selectDropdownField(page, selectFieldLabel, selectFieldValue);
    await fillFields(page, fields);

    await page.getByLabel("Stock Keeping Unit", { exact: true }).fill(SKU);

    await page.getByRole("button", { name: "SUBMIT" }).click();

    await expect(
      page.getByText(`Stock Keeping Unit: ${SKU} already exists!`)
    ).toBeVisible();
  });
}

for (const {
  type,
  pageTitle,
  selectFieldLabel,
  selectFieldValue,
  fields,
  initialSku,
} of resourceTypesData) {
  test(`Create a resource type '${type}'`, async ({ page }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: "All Resources",
      expectedUrl: "/home",
      navChildButtonText: "Add Resource",
      expectedNewUrl: "/resources/add",
      expectedHeader: "Add Resource",
    });

    await selectResource(page, type, pageTitle);

    await selectDropdownField(page, selectFieldLabel, selectFieldValue);
    await fillFields(page, fields);

    await page.getByRole("button", { name: "GENERATE" }).click();
    const sku = initialSku + generateFinalSkuString(fields);
    await expect(
      page
        .locator(".v-input", { hasText: "Stock Keeping Unit" })
        .locator("input")
    ).toHaveValue(sku);

    await submitResource(page);
  });
}
