import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm.jsx'
import AddBlog from './components/addBlog.jsx'
import Notification from './components/Notification.jsx'
import Togglable from './components/Togglable.jsx'
import BlogBox from './components/BlogStyle.jsx'
import blogService from './services/blogs.js'
import loginService from './services/login.js'
import PropTypes from 'prop-types'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs( blogs )
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      notify(`Tervetuloa ${user.name}!`)
    } catch (error) {
      notify('Wrong username or password!', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    console.log('Kirjauduttu ulos')
    window.localStorage.removeItem('loggedBlogappUser')
    notify('Olet kirjautunut ulos')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(`${returnedBlog.author} lisäsi blogin ${returnedBlog.title}`)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      notify('Blogin lisääminen epäonnistui', 'error')
    }
  }

  const updateBlog = (updated) => {
    setBlogs(blogs.map(b => b.id === updated.id ? updated : b))
    console.log('Blogi päivitetty', updated)
  }

  const deleteBlog = async (id) => {
    if (window.confirm('Haluatko poistaa blogin?')) {
      try {
        await blogService.deleteBlog(id)
        const freshBlogs = await blogService.getAll()
        setBlogs(freshBlogs)
        notify('Blogin poistaminen onnistui!')
        console.log('Blogi poistettu', id)
      } catch (error) {
        notify('Blogin poistaminen epäonnistui!', 'error')
        console.log('Blogin poistaminen epäonnistui', id)
      }
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (!user) {
    return (
      <div>
        <h1>Log in to application</h1>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <p>
        {user.name} logged in. <button onClick={handleLogout} style={{ background: 'lightblue', borderRadius: 5 + 'px' }}>logout</button>
      </p>

      <Togglable buttonLabel="create a new blog" ref={blogFormRef}>
        <AddBlog createBlog={addBlog} />
      </Togglable>

      {sortedBlogs.map(blog =>
        <BlogBox key={blog.id} blog={blog} onLike={updateBlog} onDelete={deleteBlog} Tester={user} />
      )}
    </div>
  )
}

export default App