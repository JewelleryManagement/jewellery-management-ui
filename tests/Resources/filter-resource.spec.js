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

for (const { clazz, clazzName, filterButtonValues } of resourceTypesData) {
  test(`${clazz} filter buttons are visible `, async ({ page }) => {
    await navigateViaNavbar(page, expect, {
      navParentButtonText: "Resources",
      expectedUrl: "/home",
      navChildButtonText: clazzName,
      expectedNewUrl: `/resources?clazz=${clazz}`,
      expectedHeader: `All ${clazzName}s table`,
    });

    if (filterButtonValues) {
      for (const filterButton of filterButtonValues) {
        await page.locator(".v-btn", { hasText: filterButton }).click();
        await expect(
          page.getByText(`${filterButton} ${clazzName}s table`)
        ).toBeVisible();
      }
    } else {
      await expect(page.getByText(`All ${clazzName}s table`)).toBeVisible();
    }
  });
}
