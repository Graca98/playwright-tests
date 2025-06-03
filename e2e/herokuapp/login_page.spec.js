import { test, expect } from "@playwright/test";

//todo Pomocná funkce na login
// async function attemptLogin(page, username, password) {
//   await page.getByLabel("username").fill(username);
//   await page.getByLabel("password").fill(password);
//   await page.getByRole("button", { name: "Login" }).click();
// }
// await attemptLogin(page, "tom", "SuperSecretPassword!");

const invalidUsernames = [
  "<script>alert(1)</script>",
  " OR 1=1 --",
  "admin'; DROP TABLE users;--",
  "     ",
  "👾🛑🚫",
  "user\nname",
  '"quoted"name',
];

const invalidPasswords = [
  "<script>alert(1)</script>",
  " OR 1=1 --",
  "admin'; DROP TABLE users;--",
  "     ",
  "👾🛑🚫",
  "SuperSecretPassword",
  "supersecretpassword!",
];

test.beforeEach(async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/login");
});

test.describe("Positive testing", () => {
  test("should successfully login with valid username and password", async ({
    page,
  }) => {
    await page.getByLabel("username").fill("tomsmith");
    await page.getByLabel("password").fill("SuperSecretPassword!");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("#content > div > h2")).toHaveText("Secure Area");
    await expect(page).toHaveURL(/secure/);
  });

  test("should successfully login with valid username and password using enter key", async ({
    page,
  }) => {
    await page.getByLabel("username").fill("tomsmith");
    await page.getByLabel("password").fill("SuperSecretPassword!");
    await page.keyboard.press("Enter");

    await expect(page.locator("#content > div > h2")).toHaveText("Secure Area");
    await expect(page).toHaveURL(/secure/);
  });
});

test.describe("Negative testing", () => {
  test("should not login with empty username and password", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("#flash")).toContainText(
      "Your username is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });

  test("should not login with invalid username", async ({ page }) => {
    await page.getByLabel("username").fill("tom");
    await page.getByLabel("password").fill("SuperSecretPassword!");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("#flash")).toContainText(
      "Your username is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });

  test("should not login with invalid password", async ({ page }) => {
    await page.getByLabel("username").fill("tomsmith");
    await page.getByLabel("password").fill("NotSoSuperSecretPassword!");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("#flash")).toContainText(
      "Your password is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });

  test("should not login with valid username but empty password", async ({
    page,
  }) => {
    await page.getByLabel("username").fill("tomsmith");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("#flash")).toContainText(
      "Your password is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });

  test("should not login with valid password but empty username", async ({
    page,
  }) => {
    await page.getByLabel("password").fill("SuperSecretPassword!");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("#flash")).toContainText(
      "Your username is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });

  test("should not login with username exceeding maximum length", async ({
    page,
  }) => {
    let username = "a".repeat(1001);
    await page.getByLabel("username").fill(username);
    await page.getByLabel("password").fill("SuperSecretPassword!");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator("#flash")).toContainText(
      "Your username is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });

  test("should not login after 5 attempts with invalid username", async ({
    page,
  }) => {
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("username").fill("tom");
      await page.getByLabel("password").fill("SuperSecretPassword!");
      await page.getByRole("button", { name: "Login" }).click();
    }

    await expect(page.locator("#flash")).toContainText(
      "Your username is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });

  test("should not login after 5 attempts with invalid password", async ({
    page,
  }) => {
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("username").fill("tomsmith");
      await page.getByLabel("password").fill("SuperSecret");
      await page.getByRole("button", { name: "Login" }).click();
    }

    await expect(page.locator("#flash")).toContainText(
      "Your password is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });
});

test.describe("Negative username input tests", () => {
  invalidUsernames.forEach((username) => {
    test(`should not accept username: "${username}"`, async ({ page }) => {
      await page.getByLabel("username").fill(username);
      await page.getByLabel("password").fill("SomePassword123!");
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.locator("#flash")).toContainText(
        "Your username is invalid!"
      );
      await expect(page).toHaveURL(/login/);
    });
  });
});

test.describe("Negative password input tests", () => {
  invalidPasswords.forEach((password) => {
    test(`should not accept password: "${password}"`, async ({ page }) => {
      await page.getByLabel("username").fill("tomsmith");
      await page.getByLabel("password").fill(password);
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.locator("#flash")).toContainText(
        "Your password is invalid!"
      );
      await expect(page).toHaveURL(/login/);
    });
  });
});

test.describe("XSS tests", () => {
  test("should reject XSS payload in username field", async ({ page }) => {
    const xssPayload = `<script>alert('xss')</script>`;
    await page.getByLabel("username").fill(xssPayload);
    await page.getByLabel("password").fill("SuperSecretPassword!");
    await page.getByRole("button", { name: "Login" }).click();

    const pageContent = await page.content();
    expect(pageContent).not.toContain(xssPayload);

    await expect(page.locator("#flash")).toContainText(
      "Your username is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });

  test("should reject XSS payload in password field", async ({ page }) => {
    const xssPayload = `<script>alert('xss')</script>`;
    await page.getByLabel("username").fill("tomsmith");
    await page.getByLabel("password").fill(xssPayload);
    await page.getByRole("button", { name: "Login" }).click();

    const pageContent = await page.content();
    expect(pageContent).not.toContain(xssPayload);

    await expect(page.locator("#flash")).toContainText(
      "Your password is invalid!"
    );
    await expect(page).toHaveURL(/login/);
  });
});
