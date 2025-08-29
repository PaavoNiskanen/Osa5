const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const groups = _.groupBy(blogs, 'author')

  const AuthorInfo = _.map(groups, (blogs, author) => ({
    author,
    blogs: blogs.length
  }))

  return _.maxBy(AuthorInfo, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const groups = _.groupBy(blogs, 'author')

  const AuthorLikes = _.map(groups, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes')
  }))

  return _.maxBy(AuthorLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}