export const myContext = {};

export const createGlobalVariables = async (page) => {
  myContext.catalogNameButton = page.getByLabel("Catalog name");
  myContext.descriptionButton = page.getByLabel("Description of the product");
  myContext.authorsComboBox = page
    .getByRole("combobox")
    .locator("div")
    .filter({ hasText: "AuthorsAuthors" })
    .locator("div");
  myContext.additionalPrice = page.getByLabel("Additional price");
  myContext.barcodeButton = page.getByLabel("Barcode...");
  myContext.resourcesButton = page.getByRole("button", { name: "Resources" });
  myContext.productsButton = page.getByRole("button", { name: "Products" });
  myContext.selectPictureButton = page.getByLabel("Select picture", {
    exact: true,
  });
  myContext.submitButton = page.getByRole("button", { name: "Submit" });
  myContext.resetButton = page.getByRole("button", { name: "Reset" });
  myContext.goBackButton = page.getByRole("button", { name: "Go Back" });
};

export const fillProductForm = async (
  page,
  catalogName,
  description,
  authors,
  barcode
) => {
  const {
    catalogNameButton,
    descriptionButton,
    authorsComboBox,
    barcodeButton,
  } = myContext;

  const input = page.locator(".v-select input");

  if (!(await input.isDisabled())) {
    await page.locator(".v-field__input").first().click();
    await page.getByRole("option").first().click();
  }

  await catalogNameButton.fill(catalogName);
  await descriptionButton.fill(description);
  await authorsComboBox.click();
  for (const author of authors) {
    await page
      .locator(".v-overlay__content .v-list:visible")
      .getByText(author, { exact: true })
      .click();
  }
  await barcodeButton.fill(barcode);
};

export const fillTableCellAndPress = async (page, numRows, cellIndex, key) => {
  for (let i = 1; i <= numRows; i++) {
    const cell = page
      .locator(`tr:nth-child(${i}) > td:nth-child(${cellIndex})`)
      .first();
    await cell.click();
    await cell.press("Backspace");
    await cell.press(key);
  }
};
