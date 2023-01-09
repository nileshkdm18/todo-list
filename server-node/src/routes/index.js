const tasks = require('./task.routes')
module.exports = (app) => {
  app.use('/api/tasks', tasks)
}
