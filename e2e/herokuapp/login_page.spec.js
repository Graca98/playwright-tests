import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
});

test.describe('Succesfull login', () => {
    test('should login with clicking on labels', async ({ page }) => {
        await page.getByRole('label', { name: 'Username' }).fill('tomsmith');
        await page.getByRole('label', { name: 'Password' }).fill('SuperSecretPassword!')
        await page.locator('#login > button .radius').click()
        // username.click()
        // username.fill('tomsmith')

        await expect(page.locator('#content > div > h2')).toHaveText('Secure Area')
    })
    
})
