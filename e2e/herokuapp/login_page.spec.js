import { test, expect } from '@playwright/test';

const invalidUsernames = [
    "<script>alert(1)</script>",
    " OR 1=1 --",
    "admin'; DROP TABLE users;--",
    "     ",
    "👾🛑🚫",
    "user\nname",
    "\"quoted\"name"
  ];

test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
});

test.describe('Positive testing', () => {
    test('should log in with valid credentials', async ({ page }) => {
        await page.getByLabel('username').fill('tomsmith');
        await page.getByLabel('password').fill('SuperSecretPassword!')
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('#content > div > h2')).toHaveText('Secure Area')
        await expect(page).toHaveURL(/secure/);
    })
    
})

test.describe('Negative testing', () => {
    test('should not login with empty username and password', async ({ page }) => {
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('#flash')).toContainText('Your username is invalid!')
        await expect(page).toHaveURL(/login/);
    })

    //todo Login with long username + invalid characters
    //todo login with right name but empty password + invalid characters and vice versa
    // Nepokrytý edge-case:

    // Speciální znaky: "; DROP TABLE users; (někdo to testuje kvůli XSS / SQLi prevenci)

    // Bílé znaky: " " jako vstup

    // Zadání hodnot s Enter místo kliknutí

    // Chování po několika špatných pokusech

    // Ochrana proti brute-force
    // Zkus 5× špatně a sleduj, zda se něco změní – např. zablokování účtu, změna hlášky.

    // Lze zadat skript do pole? (např. <script>alert('xss')</script>)

    test('login with invalid username', async ({ page }) => {
        await page.getByLabel('username').fill('tom');
        await page.getByLabel('password').fill('SuperSecretPassword!')
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('#flash')).toContainText('Your username is invalid!')
        await expect(page).toHaveURL(/login/);
    })
   
    test('login with invalid password', async ({ page }) => {
        await page.getByLabel('username').fill('tomsmith');
        await page.getByLabel('password').fill('NotSoSuperSecretPassword!')
        await page.getByRole('button', { name: 'Login' }).click();
        
        await expect(page.locator('#flash')).toContainText('Your password is invalid!')
        await expect(page).toHaveURL(/login/);
    })

    test('login with valid username but empty password', async ({ page }) => {
        await page.getByLabel('username').fill('tomsmith');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('#flash')).toContainText('Your password is invalid!')
        await expect(page).toHaveURL(/login/);
    })

    test('login with valid password but empty username', async ({ page }) => {
        await page.getByLabel('password').fill('SuperSecretPassword!')
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('#flash')).toContainText('Your username is invalid!')
        await expect(page).toHaveURL(/login/);
    })

    test('login with very long username', async ({ page }) => {
        let username = 'a'.repeat(1001)
        await page.getByLabel('username').fill(username);
        await page.getByLabel('password').fill('SuperSecretPassword!')
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('#flash')).toContainText('Your username is invalid!')
        await expect(page).toHaveURL(/login/);
    })
})

test.describe('Negative username input tests', () => {
    invalidUsernames.forEach((username) => {
      test(`should not accept username: "${username}"`, async ({ page }) => {
        await page.getByLabel('username').fill(username);
        await page.getByLabel('password').fill('SomePassword123!');
        await page.getByRole('button', { name: 'Login' }).click();
  
        await expect(page.locator('#flash')).toContainText('Your username is invalid!')
        await expect(page).toHaveURL(/login/);
      });
    });
  });
