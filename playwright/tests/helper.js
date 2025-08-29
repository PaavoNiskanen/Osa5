const loginWith = async (page, username, password) => {
  await page.getByPlaceholder('username').fill(username)
  await page.getByPlaceholder('password').fill(password)
  await page.getByRole('button', { name: /login/i  }).click()
}

const createBlog = async (page, title) => {
  await page.getByRole('button', { name: 'create a new blog' }).click()
  await page.getByPlaceholder('title').fill(title)
  await page.getByPlaceholder('author').fill('Test Author')
  await page.getByPlaceholder('url').fill('http://playwright-blog.com')
  await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, createBlog }