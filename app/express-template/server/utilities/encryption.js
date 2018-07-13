const crypto = require('crypto')

module.exports = {
  generateSalt: () => {
    return crypto.randomBytes(16).toString('hex')
  },
  generateHashedPassword: (salt, password) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
  }
}
