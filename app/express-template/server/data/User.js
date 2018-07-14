const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const encryption = require('../utilities/encryption')
const jwt = require('jsonwebtoken')
const env = process.env.NODE_ENV || 'development'
const secret = require('./../config/settings')[env].secret

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: [true, REQUIRED_VALIDATION_MESSAGE], lowercase: true, index: true },
  email: { type: String, unique: true, required: [true, REQUIRED_VALIDATION_MESSAGE], lowercase: true, index: true },
  bio: String,
  image: String,
  salt: String,
  hash: String,
  roles: [String],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

userSchema.plugin(uniqueValidator, { message: 'is already taken.' })

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
    following: user ? user.isFollowing(this._id) : false
  }
}

userSchema.methods.favorite = function (id) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id)
  }
  return this.save()
}

userSchema.methods.unfavorite = function (id) {
  this.favorites.remove(id)
  return this.save()
}

userSchema.methods.isFavorite = function (id) {
  return this.favorites.some(function (favoriteId) {
    return id.toString() === favoriteId.toString()
  })
}

userSchema.methods.follow = function (id) {
  if (this.following.indexOf(id) === -1) {
    this.following.push(id)
  }
  return this.save()
}

userSchema.methods.unfollow = function (id) {
  this.following.remove(id)
  return this.save()
}

userSchema.methods.isFollowing = function (id) {
  return this.following.some(function (followId) {
    return id.toString() === followId.toString()
  })
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
