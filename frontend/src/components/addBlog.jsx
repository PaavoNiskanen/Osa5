import { useState } from 'react'

const AddBlog = ({ createBlog }) => {
  const [Title, setTitle] = useState('')
  const [Author, setAuthor] = useState('')
  const [Url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title: Title, author: Author, url: Url })
    console.log('Blogi lisätty', Title)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title <input placeholder='title' value={Title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        author <input placeholder='author' value={Author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
        url <input placeholder='url' value={Url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit" style={{ background: 'lightblue', borderRadius: 5 + 'px' }}>create</button>
    </form>
  )
}

export default AddBlog