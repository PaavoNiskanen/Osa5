const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper.js')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Testaaja',
        username: 'tester',
        password: 'salasana'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await loginWith(page, 'tester', 'salasana')
    await expect(page.getByText('Tervetuloa Testaaja!')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'salasana')
      await expect(page.getByText('Tervetuloa Testaaja!')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'väärä')
      await expect(page.getByText('Wrong username or password!')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'salasana')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright test blog')
      await expect(page.getByText('Playwright test blog Test Author').first()).toBeVisible()
    })

    test('the new blog can be liked', async ({ page }) => {
      const blog = page.locator('.blog').filter({ hasText: 'Playwright test blog Test Author' })
      await blog.getByRole('button', { name: /view/i }).first().click()
      await expect(blog.getByText(/likes 0/)).toBeVisible()
      await blog.getByRole('button', { name: /like/i }).first().click()
      await expect(blog.getByText(/likes 1/)).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      const blog = page.locator('.blog').filter({ hasText: 'Playwright test blog Test Author' })
      await blog.getByRole('button', { name: /view/i }).click()
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })
      await blog.getByRole('button', { name: /remove/i }).click()
    })

    test('only the user who added the blog sees the remove button', async ({ page, request }) => {
      await createBlog(page, 'Tester1 blog')
      await expect(page.getByText('Tester1 blog Test Author').first()).toBeVisible()

      const blog = page.locator('.blog').filter({ hasText: 'Tester1 blog Test Author' })
      await blog.getByRole('button', { name: /view/i }).click()
      await expect(blog.getByRole('button', { name: /remove/i })).toBeVisible()

      const tester2 = {
        name: 'Toinen Käyttäjä',
        username: 'tester2',
        password: 'salasana2'
      }
      await request.post('/api/users', { data: tester2 })
    
      await page.getByRole('button', { name: 'logout' }).click()
    
      await page.getByPlaceholder('Username').fill('tester2')
      await page.getByPlaceholder('Password').fill('salasana2')
      await page.getByRole('button', { name: 'login' }).click()
    
      const sameBlog = page.locator('.blog').filter({ hasText: 'Tester1 blog Test Author' })
      await sameBlog.getByRole('button', { name: /view/i }).click()
      await expect(sameBlog.getByRole('button', { name: /remove/i })).not.toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'tester', 'salasana')
      await expect(page.getByText('Tervetuloa Testaaja!')).toBeVisible()

      // Poistetaan Tester1 blog, jotta seuraavassa testissä ei ole ylimääräisiä blogeja
      await blog.getByRole('button', { name: /view/i }).click()
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })
      await blog.getByRole('button', { name: /remove/i }).click()
    })
  })
  
  test('blogs are ordered by number of likes', async ({ page }) => {
    const blogs = page.locator('.blog')
    const count = await blogs.count()
    for (let i = 0; i < count; i++) {
      await blogs.getByRole('button', { name: /view/i }).click()
    }
  
    const likesTexts = await blogs.locator('text=likes').allTextContents()
    const likes = likesTexts.map(text => Number(text.split(' ')[1]))
  
    for (let i = 0; i < likes.length - 1; i++) {
      expect(likes[i]).toBeGreaterThanOrEqual(likes[i + 1])
    }
  })
})

