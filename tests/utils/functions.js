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

export const navigateToPage = async (page, expect, name) => {
  const thePage = name.charAt(0).toUpperCase() + name.slice(1);
  await page.getByRole("link", { name: thePage }).click();
  await expect(page).toHaveURL(`/${name}`);
};
