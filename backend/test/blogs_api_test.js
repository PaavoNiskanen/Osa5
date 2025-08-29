const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const app = require('../app.js')

const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const helper = require('./test_helper.js')

const { test, beforeEach, after, describe } = require('node:test')

const api = supertest(app)

describe('Kun blogeja on jo tallennettu etukäteen', () => {
  let token = ''

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const testUser = new User({ username: 'tester', name: 'Testaaja', passwordHash })
    await testUser.save()

    const response = await api
      .post('/api/login')
      .send({ username: 'tester', password: 'salasana' })

    token = response.body.token

    const initialBlogs = helper.initialBlogs(testUser._id)

    for (const blog of initialBlogs) {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
    }
  })

  test('blogien id on olemassa', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => {
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('Blogien API GET, POST, DELETE', () => {
    test('GET /api/blogs', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsInDb = await helper.blogsInDb()
      assert.strictEqual(response.body.length, blogsInDb.length)
    })

    test('POST /api/blogs', async () => {
      const newBlog = {
        title: 'Testiblogi',
        author: 'Testaaja',
        url: 'http://testi.com',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()
      const contents = blogsAfter.map(b => b.title)

      assert(blogsAfter.length > 0)
      assert(contents.includes('Testiblogi'))
    })

    test('DELETE /api/blogs/:id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })
  })

  test('blogin tykkäykset voidaan päivittää', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedLikes = { likes: blogToUpdate.likes + 10 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
  })

  describe('Kun blogin lisäyksessä on jotain puutteelista', () => {
    test('likes-kenttä saa oletusarvon 0, jos sitä ei ole määritelty', async () => {
      const blogWithoutLikes = {
        title: 'Blogi ilman tykkäyksiä',
        author: 'Testaaja',
        url: 'http://testi.net'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutLikes)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('blogia ei lisätä jos title ja url puuttuvat', async () => {
      const invalidBlog = {
        author: 'Joku',
        likes: 4
      }

      const blogsBefore = await helper.blogsInDb()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidBlog)
        .expect(400)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, blogsBefore.length)
    })

    test('blogin lisääminen ilman tokenia ei onnistu', async () => {
      const newBlog = {
        title: 'Ilman tokenia',
        author: 'Hakkeri',
        url: 'http://salainen.com',
        likes: 1,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs().length)
    })
  })

  test('Kaikki blogit palautetaan JSON-muodossa', async () => {
    const initialCount = await helper.blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialCount.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})