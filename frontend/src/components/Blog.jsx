// Käytän tätä tiedostoa vain test.jsx testien testaamiseen

import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, toggleImportance }) => {
  const [visible, setVisible] = useState(false)

  const label = blog.important
    ? 'make not important' : 'make important'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="blog">
      <h2>{blog.title}</h2>
      <p>{blog.author}</p>
      <p><a href={blog.url}>{blog.url}</a></p>
      <p>likes {blog.likes} <button onClick={onLike}>like</button></p>
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={onDelete}>delete</button>
      <button onClick={toggleVisibility}>
        {visible ? 'hide' : 'view'}
      </button>
    </div>
  )
}

export default Blog
