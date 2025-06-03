import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/entry_ad");
});

test.describe("Entry Ad", () => {
  test("should display modal window on page load", async ({ page }) => {
    await page.addInitScript(() => {
      // Zajistí, že modal se znovu objeví
      window.localStorage.clear();
    });

    const modal = page.getByRole("heading", { name: "THIS IS A MODAL WINDOW" });
    await expect(modal).toBeVisible({ timeout: 10000 });
  });

  test("should display modal on load and hide it after closing", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    const modal = page.getByRole("heading", { name: "THIS IS A MODAL WINDOW" });
    await expect(modal).toBeVisible({ timeout: 10000 });

    await page.locator(".modal-footer >> text=Close").click();

    await expect(modal).toBeHidden();

    await page.reload();
    await expect(modal).toBeHidden();
  });
});
