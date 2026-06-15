import { test, expect } from '@playwright/test'

test.describe('🏠 Room Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('ID').fill('SA')
    await page.getByLabel('Password').fill('SA#123')
    await page.getByRole('button', { name: 'Masuk' }).click()
    await page.waitForURL('/rooms')
  })

  test('RM-001: Room page displays status board', async ({ page }) => {
    await expect(page.getByText('Manajemen Kamar')).toBeVisible()
    await expect(page.getByText('Total')).toBeVisible()
    await expect(page.getByText('Tersedia')).toBeVisible()
    await expect(page.getByText('Terisi')).toBeVisible()
  })

  test('RM-002: Room cards display correctly', async ({ page }) => {
    const roomCards = page.locator('text=/Kamar \\d+/')
    await expect(roomCards.first()).toBeVisible()
  })

  test('RM-003: Add new room', async ({ page }) => {
    await page.getByRole('button', { name: 'Tambah Kamar' }).click()
    await page.getByLabel('Nomor Kamar').fill('201')
    await page.getByLabel('Tipe Kamar').fill('Suite')
    await page.getByLabel('Harga per Malam (IDR)').fill('300000')
    await page.getByRole('button', { name: 'Tambah' }).click()

    await expect(page.getByText('Kamar 201')).toBeVisible()
  })

  test('RM-004: Edit room', async ({ page }) => {
    await page.getByText('Kamar 101').locator('..').getByRole('button', { name: 'Edit' }).click()
    await page.getByLabel('Harga per Malam (IDR)').fill('175000')
    await page.getByRole('button', { name: 'Simpan' }).click()

    await expect(page.getByText('175.000')).toBeVisible()
  })
})
