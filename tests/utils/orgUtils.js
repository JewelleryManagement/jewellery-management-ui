export const organizationContext = {};

export const createOrganizationGlobalVariables = async (page) => {
  organizationContext.createBtn = page.getByRole("link", {
    name: "New Organization",
  });

  organizationContext.nameInput = page.getByLabel("Name");
  organizationContext.addressInput = page.getByLabel("Address");
  organizationContext.noteInput = page.getByLabel("Note");

  organizationContext.submitButton = page.getByRole("button", {
    name: "Submit",
  });
  organizationContext.resetButton = page.getByRole("button", { name: "Reset" });
  organizationContext.goBackButton = page.getByRole("button", {
    name: "Go Back",
  });
};
