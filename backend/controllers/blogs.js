const express = require('express')
const Blog = require('../models/blog.js')
const middleware = require('../utils/middleware')

const blogsRouter = express.Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
  console.log('Blogit haettu:', blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
    console.log('Blogi löytyi:', blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'Authentikaatio vaaditaan!' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title or url puuttuu!' })
  }

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const token = request.token
  if (!token) {
    return response.status(401).json({ error: 'Token puuttuu tai väärä!' })
  }
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'Authentikaatio vaaditaan!' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'Blogia ei löytynyt!' })
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'Vain luoja voi poistaa blogin!' })
  }

  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter