import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
  });

test.describe('Add/Remove Elements', () => {
    test('Adding element', async ({ page }) => {
        await page.getByRole('button', {name: 'Add Element'}).click()

        await expect(page.getByRole('button', {name: 'Delete'})).toBeVisible()
    })

    test('Removing element', async ({ page }) => {
        await page.getByRole('button', {name: 'Add Element'}).click()
        await page.getByRole('button', {name: 'Delete'}).click()

        await expect(page.getByRole('button', {name: 'Delete'})).toHaveCount(0);
    })

    test('Adding 3 elements', async ({ page }) => {
        for (let i = 0; i < 3; i++) {
            await page.getByRole('button', {name: 'Add Element'}).click()
        }
        const deleteButtons = await page.getByRole('button', {name: 'Delete'}).all()
        await expect(deleteButtons).toHaveLength(3)
    })

    test('Removing 1 out of 3 elements', async ({ page }) => {
        for (let i = 0; i < 3; i++) {
            await page.getByRole('button', {name: 'Add Element'}).click()
        }
        await page.getByRole('button', {name: 'Delete'}).nth(0).click()

        const deleteButtons = await page.getByRole('button', {name: 'Delete'}).all()
        await expect(deleteButtons).toHaveLength(2)
    })

    test('Removing 3 elements', async ({ page }) => {
        for (let i = 0; i < 3; i++) {
            await page.getByRole('button', {name: 'Add Element'}).click()
        }
        // await page.pause();
        for (let i = 0; i < 3; i++) {
            await page.getByRole('button', {name: 'Delete'}).nth(0).click()
        }

        await expect(page.getByRole('button', {name: 'Delete'})).toHaveCount(0);
    })

    test('No delete buttons by default', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Delete' })).toHaveCount(0);
    });
})

//   test('should clear text input field when an item is added', async ({ page }) => {
//     // create a new todo locator
//     const newTodo = page.getByPlaceholder('What needs to be done?');

//     // Create one todo item.
//     await newTodo.fill(TODO_ITEMS[0]);
//     await newTodo.press('Enter');

//     // Check that input is empty.
//     await expect(newTodo).toBeEmpty();
//     await checkNumberOfTodosInLocalStorage(page, 1);
//   });