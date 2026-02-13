export const productContext = {};

export const createProductGlobalVariables = async (page) => {
  productContext.catalogNameButton = page.getByLabel("Catalog name");
  productContext.descriptionButton = page.getByLabel(
    "Description of the product",
  );
  productContext.authorsComboBox = page
    .getByRole("combobox")
    .locator("div")
    .filter({ hasText: "AuthorsAuthors" })
    .locator("div");
  productContext.additionalPrice = page.getByLabel("Additional price");
  productContext.barcodeButton = page.getByLabel("Barcode...");
  productContext.resourcesButton = page.getByRole("button", {
    name: "Resources",
  });
  productContext.productsButton = page.getByRole("button", {
    name: "Products",
  });
  productContext.selectPictureButton = page.getByLabel("Select picture", {
    exact: true,
  });
  productContext.submitButton = page.getByRole("button", { name: "Submit" });
  productContext.resetButton = page.getByRole("button", { name: "Reset" });
  productContext.goBackButton = page.getByRole("button", { name: "Go Back" });
};

export const fillProductForm = async (
  page,
  catalogName,
  description,
  authors,
  barcode,
) => {
  const {
    catalogNameButton,
    descriptionButton,
    authorsComboBox,
    barcodeButton,
  } = productContext;

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
