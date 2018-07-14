const jwtMiddleware = require('express-jwt')
const env = process.env.NODE_ENV || 'development'
const secret = require('./../config/settings')[env].secret
const User = require('mongoose').model('User')

function getTokenFromHeaders (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  }
  return null
}

let auth = {
  required: jwtMiddleware({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders
  }),
  optional: jwtMiddleware({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeaders
  }),
  isInRole: (role) => {
    return (req, res, next) => {
      User
        .findById(req.payload.id)
        .then(user => {
          if (user && user.roles.indexOf(role) > -1) {
            next()
          } else {
            res.status(401).json({error: 'Unauthorized. For Admins only!'})
          }
        }).catch(next)
    }
  }
}

module.exports = auth
