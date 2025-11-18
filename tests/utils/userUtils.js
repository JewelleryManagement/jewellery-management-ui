export const userContext = {};

export const createGlobalVariables = async (page) => {
  userContext.tableHeader = page.getByRole("heading", { name: "Users table" });
  userContext.editHeader = page.getByText("Edit user");

  userContext.createButton = page.getByRole("link", {
    name: "Create user",
  });

  userContext.form = page.locator(".v-form");

  userContext.firstNameLabel = userContext.form.getByLabel("First name");
  userContext.lastNameLabel = userContext.form.getByLabel("Last name");
  userContext.emailLabel = userContext.form.getByLabel("Email");
  userContext.passwordLabel = userContext.form.getByLabel("Password", {
    exact: true,
  });
  userContext.firstPhoneLabel = userContext.form.getByLabel("Phone", {
    exact: true,
  });
  userContext.secondPhoneLabel = userContext.form.getByLabel("Phone2", {
    exact: true,
  });
  userContext.birthDateLabel = userContext.form.getByLabel("Birth date");
  userContext.noteLabel = userContext.form.getByLabel("Note");
  userContext.role = userContext.form.getByRole("combobox", { name: "Role" });

  userContext.submitButton = userContext.form.getByRole("button", {
    name: "Submit",
  });
  userContext.resetButton = userContext.form.getByRole("button", {
    name: "Reset",
  });
  userContext.backButton = userContext.form.getByRole("button", {
    name: "Go Back",
  });
};
