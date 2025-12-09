import { test, expect } from "@playwright/test";
import { navigateViaNavbar } from "tests/utils/functions";
import { resourceTypesData } from "tests/utils/resourceTypes";

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

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
});

for (const {
  type,
  button,
  childButton,
  filter,
  filterValue,
  filterButtonValues,
} of resourceTypesData) {
  test(`${type} filter buttons are visible `, async ({ page }) => {
    if (type === "Element") return;
    await navigateViaNavbar(page, expect, {
      navParentButtonText: button,
      expectedUrl: "/home",
      navChildButtonText: childButton,
      expectedNewUrl: `/resources?clazz=${type}&${filter}=${filterValue}`,
      expectedHeader: `${filterValue} ${button}s  table`,
    });

    for (const filterButton of filterButtonValues) {
      await page.locator(".v-btn", { hasText: filterButton }).click();
      await expect(
        page.getByText(`${filterButton} ${button}s  table`)
      ).toBeVisible();
    }
  });
}
