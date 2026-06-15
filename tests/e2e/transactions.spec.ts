import { test, expect } from '@playwright/test'

test.describe('💰 Transaction & Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('ID').fill('SA')
    await page.getByLabel('Password').fill('SA#123')
    await page.getByRole('button', { name: 'Masuk' }).click()
  })

  test('TX-001: Transaction page shows summary cards', async ({ page }) => {
    await page.goto('/transactions')
    await expect(page.getByText('Total Pemasukan')).toBeVisible()
    await expect(page.getByText('Total Pengeluaran')).toBeVisible()
    await expect(page.getByText('Saldo')).toBeVisible()
  })

  test('TX-002: Add income transaction', async ({ page }) => {
    await page.goto('/transactions')
    await page.getByRole('button', { name: 'Tambah Transaksi' }).click()
    await page.getByLabel('Jumlah (IDR)').fill('500000')
    await page.getByLabel('Deskripsi').fill('Test Income')
    await page.getByRole('button', { name: 'Tambah' }).click()

    await expect(page.getByText('Test Income')).toBeVisible()
  })

  test('RP-001: Reports page shows P&L cards', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByText('Pemasukan Bulan Ini')).toBeVisible()
    await expect(page.getByText('Laporan Laba/Rugi')).toBeVisible()
  })

  test('RP-002: Export button exists', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible()
  })
})
