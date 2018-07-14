const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = {
  get: function (req, res, next) {
    if (req.payload) {
      User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.json({ profile: req.profile.toProfileJSONFor(false) }) }
        return res.json({ profile: req.profile.toProfileJSONFor(user) })
      }).catch(next)
    } else {
      return res.json({ profile: req.profile.toProfileJSONFor(false) })
    }
  },

  follow: function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
      if (!user) { return res.sendStatus(401) }
      return user.follow(req.profile._id).then(function () {
        return res.json({ profile: req.profile.toProfileJSONFor(user) })
      })
    }).catch(next)
  },

  unfollow: function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
      return user.unfollow(req.profile._id).then(function () {
        return res.json({ profile: req.profile.toProfileJSONFor(user) })
      })
    }).catch(next)
  }
}
