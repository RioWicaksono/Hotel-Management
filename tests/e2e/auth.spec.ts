import { test, expect } from '@playwright/test'

test.describe('🔐 Authentication', () => {
  test('SA-001: Super Admin login with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('ID').fill('SA')
    await page.getByLabel('Password').fill('SA#123')
    await page.getByRole('button', { name: 'Masuk' }).click()

    await expect(page).toHaveURL('/rooms')
    await expect(page.getByText('Manajemen Kamar')).toBeVisible()
  })

  test('SA-002: Admin login with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('ID').fill('Admin')
    await page.getByLabel('Password').fill('Admin#123')
    await page.getByRole('button', { name: 'Masuk' }).click()

    await expect(page).toHaveURL('/rooms')
  })

  test('SA-003: Login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('ID').fill('Invalid')
    await page.getByLabel('Password').fill('WrongPass')
    await page.getByRole('button', { name: 'Masuk' }).click()

    await expect(page.getByText(/salah|error/i)).toBeVisible()
  })

  test('SA-004: Logout redirects to login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('ID').fill('SA')
    await page.getByLabel('Password').fill('SA#123')
    await page.getByRole('button', { name: 'Masuk' }).click()

    await page.getByRole('button', { name: 'Logout' }).click()
    await expect(page).toHaveURL('/login')
  })
})
