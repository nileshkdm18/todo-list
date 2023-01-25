const app = require('./app')
const db = require('./database')
const port = process.env.PORT || 3001
let server = null

// start express server
function startServer () {
  server = app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })
  // close db connection on closing server
  server.on('close', () => {
    db.close()
  })
}

// Database connection
db.connect()
  .then(() => {
    console.log('Connected to the database!')
    startServer()
  })
  .catch(err => {
    console.log('Cannot connect to the database!', err)
    process.exit()
  })

module.exports = { server, app }
