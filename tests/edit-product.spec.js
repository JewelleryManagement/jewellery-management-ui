import { test, expect } from "@playwright/test";

const wait = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

test("Edit product successfully", async ({ page }, testInfo) => {
  await page.goto("./");

  await page.getByPlaceholder("Email Address").fill("root@gmail.com");
  await page.getByPlaceholder("Password").fill("p@s5W07d");

  // Login
  await page.getByRole("button", { name: "Log in" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole("heading", { name: "Home Page" })).toBeVisible();

  //Go to products tab and edit product
  await page.getByRole("link", { name: "Products" }).click();
  await wait(0.5).then(async () => {
    const screenshot = await page.screenshot();
    await testInfo.attach("screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
  await page
    .getByRole("row", { name: "4 4444 This is my best test" })
    .getByRole("button")
    .nth(4)
    .click();
  await page.getByRole("button", { name: "Resources" }).click();
  await page
    .getByRole("row", { name: "Metal Carat 0 0" })
    .getByLabel("")
    .click();
  await page
    .getByRole("row", { name: "Metal Carat 0 0" })
    .getByLabel("")
    .fill("10");
  await page
    .getByRole("row", { name: "Element Carat 0" })
    .getByLabel("")
    .click();
  await page
    .getByRole("row", { name: "Element Carat 0" })
    .getByLabel("")
    .fill("2");
  await page
    .getByRole("row", { name: "28 PreciousStone Carat 0.00x0" })
    .getByLabel("")
    .click();
  await page
    .getByRole("row", { name: "28 PreciousStone Carat 0.00x0" })
    .getByLabel("")
    .fill("2");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Products" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("button", { name: "󰆦" }).first().click();

  await expect(
    page.getByRole("row", { name: "2 PreciousStone Carat 0.00x0" })
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: "10 Metal Carat 0 0" })
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: "2 Element Carat 0" })
  ).toBeVisible();
});
