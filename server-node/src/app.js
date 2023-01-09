const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const swaggerUi = require('swagger-ui-express')

const app = express()
app.use(cors())
app.use(express.json())

// Register routes
require('./routes')(app)

// Register Swagger route
const swaggerDoc = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/swagger/swagger.json'), 'utf8'))
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
// Dynamically set host for swagger docs config
app.use('/docs', function (req, res, next) {
  swaggerDoc.host = req.get('host')
  req.swaggerDoc = swaggerDoc
  next()
}, swaggerUi.serve, swaggerUi.setup())

module.exports = app
