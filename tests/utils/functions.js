export const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

export const appLogin = async (page) => {
  await page.goto("./");
  await page.getByPlaceholder("Email Address").fill("root@gmail.com");
  await page.getByPlaceholder("Password").fill("p@s5W07d");
  await page.getByRole("button", { name: "Log in" }).click();
  await wait(3);
};

export const navigateViaNavbar = async (
  page,
  expect,
  {
    navParentButtonText,
    expectedUrl,
    navChildButtonText,
    expectedNewUrl,
    expectedHeader,
  }
) => {
  const drawer = page.locator(".v-navigation-drawer");

  await drawer.hover();
  await expect(
    drawer.getByText(navParentButtonText, { exact: true })
  ).toBeVisible();
  await wait(1);

  await drawer.getByText(navParentButtonText, { exact: true }).click();
  await expect(page).toHaveURL(expectedUrl);
  await expect(
    drawer.getByText(navChildButtonText, { exact: true })
  ).toBeVisible();
  await wait(1);

  await drawer.getByText(navChildButtonText, { exact: true }).click();
  await expect(page).toHaveURL(expectedNewUrl);
  wait(1);
  await expect(page.getByText(expectedHeader, { exact: true })).toBeVisible();
  await wait(1);
};

export function requiredField(page, labelText) {
  return page
    .locator(".v-input", {
      hasText: labelText,
    })
    .locator(".v-messages__message", { hasText: "Input field is required" });
}
