const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper.js')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy palauttaa yhden', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('Tykkäykset yhdessä blogissa', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('Kun listassa on vain yksi blogi, niin palautetaan sen tykkäykset', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('Kaikki tykkäykset', () => {
  test('Kun listassa on useampi blogi, niin näyttää tykkäysten kokonaissumman', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('Suosituin blogi', () => {
  test('Palauttaa blogin, jossa on eniten tykkäyksiä', () => {
    const expected = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, expected)
  })

  test('Ei palauta virheilmoitusta tyhjille blogeille', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})

describe('Eniten blogeja', () => {
  test('Palauttaa henkilön, jolla on eniten blogeja', () => {
    const result = listHelper.mostBlogs(blogs)

    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    assert.deepStrictEqual(result, expected)
  })

  test('Ei palauta virheilmoitusta tyhjille blogeille', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})

describe('Eniten tykkäykset', () => {
  test('Palauttaa kirjailijan, jolla on eniten tykkäyksiä yhteensä', () => {
    const result = listHelper.mostLikes(blogs)

    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    assert.deepStrictEqual(result, expected)
  })

  test('Ei palauta virheilmoitusta tyhjille blogeille', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
})
