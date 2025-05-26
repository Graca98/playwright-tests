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

        await expect(page.getByRole('button', {name: 'Delete'})).toBeHidden()
    })
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