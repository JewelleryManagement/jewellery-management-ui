export const myContext = {};

export const createGlobalVariables = async (page) => {
  myContext.newSaleBtn = page.getByRole("link", { name: "New Sale" });
  myContext.calendarBtn = page.getByRole("button", { name: "Calendar" });

  myContext.productsBtn = page.getByRole("button", { name: "Products" });
  myContext.resourcesBtn = page.getByRole("button", { name: "Resources" });
  myContext.saveBtn = page.getByRole("button", { name: "Save" });

  myContext.submitButton = page.getByRole("button", { name: "Submit" });
  myContext.resetButton = page.getByRole("button", { name: "Reset" });
  myContext.goBackButton = page.getByRole("button", { name: "Go Back" });
};

export const firstInputSelect = async (page) => {
  await page.locator(".v-field__input").first().click();
  await page.getByRole("option", { name: "root test root@gmail.com" }).click();
};

export const secondInputSelect = async (page) => {
  await page
    .locator(
      "div:nth-child(2) > .v-input__control > .v-field > .v-field__field > .v-field__input"
    )
    .click();
  await page.getByRole("option", { name: "testUser1 test testUser1@" }).click();
};

export const selectDate = async (page) => {
  const { calendarBtn } = myContext;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");

  const year = today.getFullYear();
  await calendarBtn.click();
  await page.getByRole("button", { name: day.toString() }).click();
  await expect(
    page.getByText(`Selected date: ${day}/${month}/${year}`)
  ).toBeVisible();
};

export const selectProduct = async (page) => {
  const { productsBtn, saveBtn } = myContext;

  await productsBtn.click();
  await page.locator("td").first().click();
  await saveBtn.click();
};

export const selectResource = async (page) => {
  const { resourcesBtn, saveBtn } = myContext;

  await resourcesBtn.click();
  const locator = page.locator("td").first();
  await locator.click();
  await locator.press("1");
  await saveBtn.click();
};
