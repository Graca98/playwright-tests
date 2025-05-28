import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
});

test.describe('Pozitive testing', () => {
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

    // Příliš dlouhý vstup (např. 300 znaků)

    // Speciální znaky: "; DROP TABLE users; (někdo to testuje kvůli XSS / SQLi prevenci)

    // Bílé znaky: " " jako vstup

    // Zadání hodnot s Enter místo kliknutí

    // Chování po několika špatných pokusech

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

    test.only('login with valid username but empty password', async ({ page }) => {
        await page.getByLabel('username').fill('tomsmith');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('#flash')).toContainText('Your password is invalid!')
        await expect(page).toHaveURL(/login/);
    })

    test.only('login with valid password but empty username', async ({ page }) => {
        await page.getByLabel('password').fill('NotSoSuperSecretPassword!')
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.locator('#flash')).toContainText('Your username is invalid!')
        await expect(page).toHaveURL(/login/);
    })
})
