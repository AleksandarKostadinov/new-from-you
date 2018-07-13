const api = require('./api')

module.exports = (app) => {
  app.use('/api', api)
  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
