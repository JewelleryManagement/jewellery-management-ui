import { test, expect } from "@playwright/test";
import { resourceTypesData } from "tests/utils/resourceTypes";
import { appLogin, navigateViaNavbar } from "tests/utils/functions";

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
};

const fillAddQuantityFormAndSubmit = async (page, clazzName) => {
  await expect(page.getByText("Add Quantity")).toBeVisible();
  await expect(page.getByLabel("Quantity", { exact: true })).toBeVisible();
  await page.getByLabel("Quantity", { exact: true }).fill("200");
  await expect(page.getByLabel("Delivery Cost", { exact: true })).toBeVisible();
  await page.getByLabel("Delivery Cost", { exact: true }).fill("50");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(
    page.locator(".v-btn__content", { hasText: `Add ${clazzName}` })
  ).toBeVisible();
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
    navParentButtonText: "Resources",
    expectedUrl: "/home",
    navChildButtonText: "Add Resource",
    expectedNewUrl: "/resources/add",
    expectedHeader: "Add Resource",
  });

  await expect(page.locator(".v-select")).toBeVisible();

  for (const { clazz } of resourceTypesData) {
    await page.locator(".v-select .v-field__input").click();
    const menu = page.locator(".v-overlay__content .v-list");
    await menu.waitFor();

    await expect(
      menu.locator(".v-list-item-title", {
        hasText: new RegExp(`^${clazz}$`),
      })
    ).toBeVisible();

    await page.locator(".v-select .v-field__input").click();
  }
});

for (const { clazz, clazzName, pageTitle } of resourceTypesData) {
  test(`Access resources 'Add ${clazz}' from resource page and its content `, async ({
    page,
  }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: "Resources",
      expectedUrl: "/home",
      navChildButtonText: `${clazzName}`,
      expectedNewUrl: `/resources?clazz=${clazz}`,
      expectedHeader: pageTitle,
    });

    await expect(
      page.locator(".v-btn__content", { hasText: `Add ${clazzName}` })
    ).toBeVisible();
    await page
      .locator(".v-btn__content", { hasText: `Add ${clazzName}` })
      .click();
    await expect(page.getByText(`Add ${clazzName}`)).toBeVisible();
  });
}

for (const { clazz, clazzName, pageTitle } of resourceTypesData) {
  test(`Access 'Add ${clazz}' from resource page and go back by pressing back button `, async ({
    page,
  }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: "Resources",
      expectedUrl: "/home",
      navChildButtonText: `${clazzName}`,
      expectedNewUrl: `/resources?clazz=${clazz}`,
      expectedHeader: pageTitle,
    });

    await expect(
      page.locator(".v-btn__content", { hasText: `Add ${clazzName}` })
    ).toBeVisible();
    await page
      .locator(".v-btn__content", { hasText: `Add ${clazzName}` })
      .click();

    await page.getByRole("button", { name: "BACK" }).click();
    await expect(page).toHaveURL(`/resources?clazz=${clazz}`);
  });
}

for (const {
  clazz,
  selectFieldLabel,
  clazzName,
  pageTitle,
  fields,
} of resourceTypesData) {
  test(`Create ${clazz} should fail when required fields are empty `, async ({
    page,
  }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: "Resources",
      expectedUrl: "/home",
      navChildButtonText: `${clazzName}`,
      expectedNewUrl: `/resources?clazz=${clazz}`,
      expectedHeader: pageTitle,
    });

    await expect(
      page.locator(".v-btn__content", { hasText: `Add ${clazzName}` })
    ).toBeVisible();
    await page
      .locator(".v-btn__content", { hasText: `Add ${clazzName}` })
      .click();

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
  clazz,
  pageTitle,
  selectFieldLabel,
  selectFieldValue,
  fields,
  clazzName,
} of resourceTypesData) {
  test(`Reset button should reset ${clazz} form`, async ({ page }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: "Resources",
      expectedUrl: "/home",
      navChildButtonText: `${clazzName}`,
      expectedNewUrl: `/resources?clazz=${clazz}`,
      expectedHeader: pageTitle,
    });

    await expect(
      page.locator(".v-btn__content", { hasText: `Add ${clazzName}` })
    ).toBeVisible();
    await page
      .locator(".v-btn__content", { hasText: `Add ${clazzName}` })
      .click();

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
  clazz,
  pageTitle,
  selectFieldLabel,
  selectFieldValue,
  fields,
  clazzName,
} of resourceTypesData) {
  test(`Create a resource clazz '${clazz}' with same Stock Keeping Unit should fail`, async ({
    page,
  }) => {
    const SKU = `${clazz} Test Sku`;

    await navigateViaNavbar(page, expect, {
      navParentButtonText: "Resources",
      expectedUrl: "/home",
      navChildButtonText: `${clazzName}`,
      expectedNewUrl: `/resources?clazz=${clazz}`,
      expectedHeader: pageTitle,
    });

    await expect(
      page.locator(".v-btn__content", { hasText: `Add ${clazzName}` })
    ).toBeVisible();
    await page
      .locator(".v-btn__content", { hasText: `Add ${clazzName}` })
      .click();

    await selectDropdownField(page, selectFieldLabel, selectFieldValue);
    await fillFields(page, fields);

    await page.getByLabel("Stock Keeping Unit", { exact: true }).fill(SKU);

    await submitResource(page);

    await fillAddQuantityFormAndSubmit(page, clazzName);

    await page
      .locator(".v-btn__content", { hasText: `Add ${clazzName}` })
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
  clazz,
  pageTitle,
  selectFieldLabel,
  selectFieldValue,
  fields,
  clazzName,
  initialSku,
} of resourceTypesData) {
  test(`Create a resource clazz '${clazz}'`, async ({ page }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: "Resources",
      expectedUrl: "/home",
      navChildButtonText: `${clazzName}`,
      expectedNewUrl: `/resources?clazz=${clazz}`,
      expectedHeader: pageTitle,
    });

    await expect(
      page.locator(".v-btn__content", { hasText: `Add ${clazzName}` })
    ).toBeVisible();
    await page
      .locator(".v-btn__content", { hasText: `Add ${clazzName}` })
      .click();

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

    await fillAddQuantityFormAndSubmit(page, clazzName);
  });
}
