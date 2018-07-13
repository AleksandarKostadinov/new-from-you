const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/new-from-you-dev',
    port: 1337,
    secret: 'very-secret'
  },
  staging: {
  },
  production: {
    port: process.env.PORT
  }
}
