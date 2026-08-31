import { expect, test } from '@playwright/test'

test('landing page shows the disclaimer and the urna preview', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Treine Seu Voto' })).toBeVisible()
  await expect(page.getByText('simulador educativo independente')).toBeVisible()
})

test('full voting flow: state → mode → valid number → confirm → next office → finish', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Começar simulação' }).click()

  await expect(page).toHaveURL(/\/estado/)
  await page.getByRole('button', { name: /^PE / }).click()

  await expect(page).toHaveURL(/\/modo/)
  await page.getByRole('button', { name: /Modo Simulação/ }).click()

  await expect(page).toHaveURL(/\/votar/)
  await expect(page.getByText('Deputado Federal', { exact: true })).toBeVisible()

  // Seed candidate 9000 (see src/data/seedCandidates.ts)
  await page.getByRole('button', { name: 'Tecla 9' }).click()
  await page.getByRole('button', { name: 'Tecla 0' }).click()
  await page.getByRole('button', { name: 'Tecla 0' }).click()
  await page.getByRole('button', { name: 'Tecla 0' }).click()

  await expect(page.getByText('Ana Exemplo (exemplo)')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Confirma' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Confirma' })).toBeEnabled({ timeout: 2000 })
  await page.getByRole('button', { name: 'Confirma' }).click()

  await expect(page.getByText('Deputado Estadual ou Distrital', { exact: true })).toBeVisible()
})

test('invalid number shows the not-found message and CORRIGE recovers', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Começar simulação' }).click()
  await page.getByRole('button', { name: /^SP / }).click()
  await page.getByRole('button', { name: /Modo Simulação/ }).click()

  for (const digit of ['1', '2', '3', '4']) {
    await page.getByRole('button', { name: `Tecla ${digit}` }).click()
  }
  await expect(page.getByText('NÚMERO NÃO ENCONTRADO')).toBeVisible()

  await page.getByRole('button', { name: 'Corrige' }).click()
  await expect(page.getByText('Digite o número da candidata ou do candidato.')).toBeVisible()
})

test('blank vote requires an explicit confirmation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Começar simulação' }).click()
  await page.getByRole('button', { name: /^DF / }).click()
  await page.getByRole('button', { name: /Modo Simulação/ }).click()

  await page.getByRole('button', { name: 'Branco' }).click()
  await expect(page.getByText('VOTO EM BRANCO')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Confirma' })).toBeEnabled({ timeout: 2000 })
})
