const logger = require('./logger.js')
const User = require('../models/user.js')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.replace('Bearer ', '')
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)

      if (!decodedToken.id) {
        return response.status(401).json({ error: 'Väärä token!' })
      }

      const user = await User.findById(decodedToken.id)
      request.user = user
    } catch (error) {
      console.error('Token verification failed:', error.message)
      return response.status(401).json({ error: 'Token on väärä tai vanhentunut!' })
    }
  } else {
    request.user = null
  }

  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger,
  tokenExtractor,
  userExtractor
}
