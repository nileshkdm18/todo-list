require('dotenv').config()
const evn = process.env.NODE_ENV
const dbUrl = process.env.DATABASE_URL
const db = evn === 'test' ? 'demo-test' : 'demo'
const mongoString = `${dbUrl}/${db}`
module.exports = {
  url: mongoString
}
