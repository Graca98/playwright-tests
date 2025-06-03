import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/add_remove_elements/");
});

test.describe("Add/Remove Elements functionality", () => {
  test("should add one element when button is clicked", async ({ page }) => {
    await page.getByRole("button", { name: "Add Element" }).click();

    await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
  });

  test("should remove the added element when delete is clicked", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Element" }).click();
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(0);
  });

  test("should add three elements when add button is clicked three times", async ({
    page,
  }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Add Element" }).click();
    }
    await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(3);
  });

  test("should remove one of three added elements", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Add Element" }).click();
    }
    await page.getByRole("button", { name: "Delete" }).nth(0).click();

    await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(2);
  });

  test("should remove all three added elements", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Add Element" }).click();
    }

    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Delete" }).nth(0).click();
    }

    await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(0);
  });

  test("should not display delete buttons by default", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(0);
  });
});
