import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/entry_ad');
});

test.describe('Entry Ad', () => {
    test('Modal is open on page load', async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.clear(); // Zajistí, že modal se znovu objeví
        });
    
        const modal = page.getByRole('heading', { name: 'THIS IS A MODAL WINDOW' });
        await expect(modal).toBeVisible({ timeout: 10000 });
    })

    test('Modal shows and hides correctly', async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.clear(); 
        });
    
        const modal = page.getByRole('heading', { name: 'THIS IS A MODAL WINDOW' });
        await expect(modal).toBeVisible({ timeout: 10000 });

        await page.locator('.modal-footer >> text=Close').click();

        // Ověříme, že modal po kliknutí zmizel
        await expect(modal).toBeHidden();

        // Reload a kontrola, že se znovu neobjeví
        await page.reload();
        await expect(modal).toBeHidden();
    })
    
})