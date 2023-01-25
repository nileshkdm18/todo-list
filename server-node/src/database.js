const db = require('./models')
const connect = async () => {
  return db.mongoose
    .connect(db.url, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true
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
