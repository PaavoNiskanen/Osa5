import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Blog from './Blog.jsx'
import AddBlog from './addBlog.jsx'

describe('Blogin komponentti testit', () => {
  const blog = {
    id: '123',
    title: 'Testing React Components',
    author: 'Testaaja',
    url: 'http://example.com',
    likes: 10,
    user: {
      username: 'tester',
      name: 'Testaaja Paavo'
    }
  }

  test('5.13 renderöi blogin otsikon ja kirjoittajan', () => {
    const { container } = render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} />)

    const titleElement = container.querySelector('.blog')
    const authorElement = container.querySelector('.blog')

    expect(titleElement).toHaveTextContent('Testing React Components')
    expect(authorElement).toHaveTextContent('Testaaja')
  })

  test('5.14 näyttää linkin, tykkäysten määrän ja käyttäjän', async () => {
    const { container } = render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} />)

    const urlElement = container.querySelector('.blog')
    const LikeElement = container.querySelector('.blog')

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(urlElement).toHaveTextContent('http://example.com')
    expect(LikeElement).toHaveTextContent('likes 10')
  })

  test('5.15 komponentin like-nappia painetaan kahdesti, jolloin mockLikeHandler tapahtuu kahdesti', async () => {
    const mockLikeHandler = vi.fn()
    const { container } = render(<Blog blog={blog} onLike={mockLikeHandler} onDelete={() => {}} />)

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockLikeHandler).toHaveBeenCalledTimes(2)
  })
})

describe('AddBlog.jsx testi', () => {
  test('5.16 kutsuu createBlog ja tekee blogin oikein', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<AddBlog createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    await user.type(titleInput, 'New Blog')

    const authorInput = screen.getByPlaceholderText('author')
    await user.type(authorInput, 'Author')

    const urlInput = screen.getByPlaceholderText('url')
    await user.type(urlInput, 'http://newblog.com')

    const button = screen.getByText('create')
    await user.click(button)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'New Blog',
      author: 'Author',
      url: 'http://newblog.com'
    })
  })
})