const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user.js')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'username pitää olla vähintään 3 merkkiä pitkä'
    })
  }

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password pitää olla vähintään 3 merkkiä pitkä'
    })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username pitää olla uniikki'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1
  })
  response.json(users)
})

module.exports = usersRouter