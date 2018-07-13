const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const encryption = require('../utilities/encryption')
const jwt = require('jsonwebtoken')
const env = process.env.NODE_ENV || 'development'
const secret = require('./../config/settings')[env].secret

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: [true, REQUIRED_VALIDATION_MESSAGE], lowercase: true, index: true},
  email: {type: String, unique: true, required: [true, REQUIRED_VALIDATION_MESSAGE], lowercase: true, index: true},
  bio: String,
  image: String,
  salt: String,
  hash: String,
  roles: [String]
}, {timestamps: true})

userSchema.plugin(uniqueValidator, {message: 'is already taken.'})

userSchema.methods.setPassword = function (password) {
  this.salt = encryption.generateSalt()
  this.hash = encryption.generateHashedPassword(this.salt, password)
}

userSchema.methods.validPassword = function (password) {
  let hash = encryption.generateHashedPassword(this.salt, password)
  return this.hash === hash
}

userSchema.methods.generateJWT = function () {
  let today = new Date()
  let exp = new Date(today)
  exp.setDate(today.getDate() + 60)
  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, secret)
}

userSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    token: this.generateJWT()
  }
}

userSchema.methods.toProfileJSONFor = function (user) {
  return {
    username: this.username,
    bio: this.bio,
    image: this.image,
    following: false
  }
}

let User = mongoose.model('User', userSchema)

module.exports = User
module.exports.seedAdminUser = () => {
  User.find({}).then(users => {
    if (users.length > 0) return

    let salt = encryption.generateSalt()
    let hashedPass = encryption.generateHashedPassword(salt, '123456')

    User.create({
      username: 'Admin',
      email: 'Admin',
      bio: 'Admin',
      salt: salt,
      hash: hashedPass,
      roles: ['Admin']
    })
  })
}
