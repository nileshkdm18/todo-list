const db = require('./models')
const connect = async () => {
  db.mongoose
    .connect(db.url, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('Connected to the database!')
    })
    .catch(err => {
      console.log('Cannot connect to the database!', err)
      process.exit()
    })
}

const close = async () => {
  await db.mongoose.disconnect()
}

const clear = async () => {
  const collections = db.mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

module.exports = { connect, close, clear }
