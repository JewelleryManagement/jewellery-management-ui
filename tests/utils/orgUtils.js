export const myContext = {};

export const createGlobalVariables = async (page) => {
  myContext.createBtn = page.getByRole("link", { name: "New Organization" });

  myContext.nameInput = page.getByLabel("Name");
  myContext.addressInput = page.getByLabel("Address");
  myContext.noteInput = page.getByLabel("Note");

  myContext.submitButton = page.getByRole("button", { name: "Submit" });
  myContext.resetButton = page.getByRole("button", { name: "Reset" });
  myContext.goBackButton = page.getByRole("button", { name: "Go Back" });
};
