require('express-async-errors')
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')
const config = require('./utils/config.js')
const logger = require('./utils/logger.js')
const middleware = require('./utils/middleware.js')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

console.log('Yhdistetään', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Yhdistetty MongoDB'))
  .catch(error => console.log('Virhe yhdistäessä MongoDB', error.message))

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing.js')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app