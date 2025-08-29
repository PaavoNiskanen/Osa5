// Testi tiedosto, jossa testailin kurssimateriaalissa esiteltyjä esimerkkejä

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'
import Togglable from './Togglable'


describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test('renders its children', () => {
    screen.getByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('renders blog title and author', async () => {
    const blog = {
      title: 'Testing React components with Vitest',
      author: 'John Doe',
      url: 'http://example.com',
      likes: 10,
      important: true
    }

    const mockHandler = vi.fn()

    const { container } = render(<Blog blog={blog} toggleImportance={mockHandler} />)

    const titleElement = container.querySelector('.blog')
    const authorElement = container.querySelector('.blog')

    const user = userEvent.setup()
    const button = screen.getByText('make not important')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)

    expect(titleElement).toHaveTextContent('Testing React components with Vitest')
    expect(authorElement).toHaveTextContent('John Doe')
  })
})