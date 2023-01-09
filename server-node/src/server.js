const app = require('./app')
const db = require('./database')
const port = process.env.PORT || 3001

// Database connection
db.connect()

// create server
const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

// close db connection on closing server
server.on('close', () => {
  db.close()
})

module.exports = { server, app }
