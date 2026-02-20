export const saleContext = {};

export const createSaleGlobalVariables = async (page) => {
  saleContext.newSaleBtn = page.getByRole("link", { name: "New Sale" });

  saleContext.calendarBtn = page.getByRole("button", { name: "Calendar" });
  saleContext.productsBtn = page.getByRole("button", { name: "Products" });
  saleContext.resourcesBtn = page.getByRole("button", { name: "Resources" });

  saleContext.saveBtn = page.getByRole("button", { name: "Save" });

  saleContext.submitButton = page.getByRole("button", { name: "Submit" });
  saleContext.resetButton = page.getByRole("button", { name: "Reset" });
  saleContext.goBackButton = page.getByRole("button", { name: "Go Back" });
};

export const firstInputSelect = async (page) => {
  await page.locator(".v-field__input").first().click();
  await page.getByRole("option").first().click();
};

export const secondInputSelect = async (page) => {
  await page.locator(".v-field__input").nth(1).click();
  await page.getByRole("option").nth(1).click();
};

export const selectDate = async (page, expect) => {
  const { calendarBtn } = saleContext;

  const today = new Date();
  const day = today.getDate().toString();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();
  await calendarBtn.click();
  await page
    .locator(".v-btn")
    .filter({
      hasText: new RegExp(`^${day}$`),
    })
    .click();
  await expect(
    page.getByText(`Selected date: ${day.padStart(2, "0")}/${month}/${year}`),
  ).toBeVisible();
};

export const selectProduct = async (page) => {
  const { productsBtn, saveBtn } = saleContext;

  await productsBtn.click();
  await page
    .locator("tr.v-data-table__tr--clickable")
    .first()
    .locator("i.mdi-plus")
    .click();
  await saveBtn.click();
};

export const selectResource = async (page) => {
  const { resourcesBtn, saveBtn } = saleContext;

  await resourcesBtn.click();
  const locator = page.locator("td").first();
  await locator.click();
  await locator.press("1");
  await saveBtn.click();
};

export const checkErrorMessages = async (page, expect) => {
  await expect(
    page.getByText("Please select at least one author").first(),
  ).toBeVisible();
  await expect(
    page.getByText("Please select at least one author").nth(1),
  ).toBeVisible();
};

export const checkDisabledButtons = async (
  page,
  calendarBtn,
  productsBtn,
  resourcesBtn,
  expect,
) => {
  const calendarClassAttr =
    "v-btn v-btn--disabled v-theme--light bg-primary-green v-btn--density-default v-btn--size-small v-btn--variant-elevated";
  const productsClassAttr =
    "v-btn v-btn--disabled v-theme--light bg-primary-blue v-btn--density-default v-btn--size-small v-btn--variant-elevated";
  const resourcesClassAttr =
    "v-btn v-btn--disabled v-theme--light bg-teal v-btn--density-default v-btn--size-small v-btn--variant-elevated";

  await expect(page.getByText("Selected date: ")).not.toBeVisible();
  await expect(calendarBtn).toHaveClass(calendarClassAttr);
  await expect(productsBtn).toHaveClass(productsClassAttr);
  await expect(resourcesBtn).toHaveClass(resourcesClassAttr);
};
