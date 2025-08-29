const app = require('./app.js')
const config = require('./utils/config.js')

app.listen(config.PORT, () => {
  console.log(`Serveri on käynnissä portilla: ${config.PORT}`)
})
