import { test, expect } from '@playwright/test'

test.describe('📅 Booking Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('ID').fill('SA')
    await page.getByLabel('Password').fill('SA#123')
    await page.getByRole('button', { name: 'Masuk' }).click()
    await page.goto('/bookings')
  })

  test('BK-001: Booking page loads correctly', async ({ page }) => {
    await expect(page.getByText('Manajemen Booking')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Tambah Booking' })).toBeVisible()
  })

  test('BK-002: Filter buttons work', async ({ page }) => {
    await page.getByRole('button', { name: 'Aktif' }).click()
    await page.getByRole('button', { name: 'Selesai' }).click()
    await page.getByRole('button', { name: 'Semua' }).click()
  })

  test('BK-003: Navigate to bookings from sidebar', async ({ page }) => {
    await page.getByRole('link', { name: 'Booking' }).click()
    await expect(page).toHaveURL('/bookings')
  })
})
