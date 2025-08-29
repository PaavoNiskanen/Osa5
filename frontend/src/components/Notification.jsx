const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const style = {
    color: type === 'error' ? 'red' : 'green',
    background: 'white',
    fontSize: 20,
    border: `3px solid ${type === 'error' ? 'red' : 'green'}`,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={style}>{message}</div>
}

export default Notification