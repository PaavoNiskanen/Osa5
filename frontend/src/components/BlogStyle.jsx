import { useState } from 'react'
import blogService from '../services/blogs.js'

const BlogBox = ({ blog, onLike, onDelete, Tester }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
    console.log('Vaihdetta näkyvyyttä blogille:', blog.title)
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      onLike({ ...returnedBlog, user: blog.user })
      console.log('Tykkäys onnistui:', returnedBlog)
    } catch (error) {
      console.error('Like failed:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await onDelete(blog.id)
      console.log('Blogi poistettu:', blog.title)
    }
  }

  return (
    <div className="blog" style={blogStyle}>
      <div className="title">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={{ background: 'lightblue', borderRadius: 5 + 'px' }}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike} style={{ background: 'lightblue', borderRadius: 5 + 'px' }}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {blog.user?.username === Tester.username && (
            <button onClick={handleDelete} style={{ background: 'red', borderRadius: 5 + 'px' }}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default BlogBox