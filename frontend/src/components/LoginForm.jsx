import React, { useState } from 'react'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ username, password })
    console.log('Kirjauduttu sisään', username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username <input type="text" id="username" placeholder="username" value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password <input type="password" id="password" placeholder="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit" style={{ background: 'lightblue', borderRadius: 5 + 'px' }}>login</button>
    </form>
  )
}

export default LoginForm