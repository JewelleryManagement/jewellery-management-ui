import { test, expect } from "@playwright/test";

const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const login = async (page) => {
  await page.goto("./");
  await page.getByPlaceholder("Email Address").fill("root@gmail.com");
  await page.getByPlaceholder("Password").fill("p@s5W07d");
  await page.getByRole("button", { name: "Log in" }).click();
  await wait(3);
};

const navigateToResourcePage = async (page) => {
  await page.getByRole("link", { name: "Resources" }).click();
  await expect(page).toHaveURL("/resources");
  await expect(page.getByText("All resources table")).toBeVisible();
  await expect(page.getByRole("link", { name: "Add resource" })).toBeVisible();
};

const resourceTypes = [
  { label: "All", tableText: "All resources table" },
  { label: "Pearl", tableText: "Pearl's resources table" },
  { label: "Metal", tableText: "Metal's resources table" },
  { label: "Element", tableText: "Element's resources table" },
  { label: "PreciousStone", tableText: "PreciousStone's resources table" },
  {
    label: "SemiPreciousStone",
    tableText: "SemiPreciousStone's resources table",
  },
];

const filterResourceTable = async (page, resourceTypeBtn) => {
  for (const { label, tableText } of resourceTypes) {
    await resourceTypeBtn.click();
    await page
      .locator("div")
      .filter({ hasText: new RegExp(`^${label}$`) })
      .first()
      .click();
    await expect(page.getByText(tableText)).toBeVisible();
  }
};

test.beforeEach(async ({ page }) => {
  await login(page);
  await navigateToResourcePage(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test("FIlter button and its menu is visible ", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Resource Type" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Resource Type" }).click();

  for (const resourceType of resourceTypes) {
    await expect(
      page
        .locator("div")
        .filter({ hasText: new RegExp(`^${resourceType.label}$`) })
        .first()
    ).toBeVisible();
  }
});

test("Clicking fast on filter button works ", async ({ page }) => {
  const resourceTypeBtn = page.getByRole("button", { name: "Resource Type" });
  await expect(resourceTypeBtn).toBeVisible();

  await filterResourceTable(page, resourceTypeBtn);
  await filterResourceTable(page, resourceTypeBtn);
  await filterResourceTable(page, resourceTypeBtn);
});
