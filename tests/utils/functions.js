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

export const navigateToPage = async (
  page,
  expect,
  navParrentButton,
  expectedUrl,
  navChildButton,
  expectedNewUrl,
  expectedHeader
) => {
  const drawer = page.locator(".v-navigation-drawer");

  await drawer.hover();
  await expect(
    drawer.getByText(navParrentButton, { exact: true })
  ).toBeVisible();
  await wait(1);

  await drawer.getByText(navParrentButton, { exact: true }).click();
  await expect(page).toHaveURL(expectedUrl);
  await expect(drawer.getByText(navChildButton, { exact: true })).toBeVisible();
  await wait(1);

  await drawer.getByText(navChildButton, { exact: true }).click();
  await expect(page).toHaveURL(expectedNewUrl);
  wait(1);
  await expect(page.getByText(expectedHeader, { exact: true })).toBeVisible();
  await wait(1);
};
