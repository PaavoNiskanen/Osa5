const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const app = require('../app')
const helper = require('./test_helper.js')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

const { addInitialBlogsForUser } = require('./test_helper')
const { test, beforeEach, after, describe } = require('node:test')

const api = supertest(app)

describe('Kun alussa on vain yksi käyttäjä', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = new User({
      username: 'tester',
      name: 'Testikäyttäjä',
      passwordHash: await bcrypt.hash('salasana', 10),
    })
    const savedUser = await newUser.save()

    await addInitialBlogsForUser(savedUser)
  })

  test('uuden käyttäjän luonti onnistuu, jos käyttäjätunnus on uniikki ja salasana riittävän pitkä', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('käyttäjän luonti epäonnistuu, jos käyttäjätunnus on jo käytössä', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'tester',
      name: 'Root Duplicate',
      password: 'salasana123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username pitää olla uniikki'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('Käyttäjän salasanan validointi', () => {
  test('liian lyhyt salasana aiheuttaa virheen', async () => {
    const newUser = {
      username: 'lyhyt',
      name: 'Lisa Loser',
      password: 'pw'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('password pitää olla vähintään 3 merkkiä pitkä'))

    const users = await helper.usersInDb()
    assert(!users.find(u => u.username === newUser.username))
  })

  test('liian lyhyt käyttäjätunnus aiheuttaa virheen', async () => {
    const newUser = {
      username: 'ab',
      name: 'Anne Baris',
      password: 'salasana'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('username pitää olla vähintään 3 merkkiä pitkä'))

    const users = await helper.usersInDb()
    assert(!users.find(u => u.username === newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})
