const mongoose = require('mongoose')
const User = mongoose.model('User')
const router = require('express').Router()
const auth = require('./../../auth')
const profilesController = require('./../../../controllers').frofiles

router.param('username', function (req, res, next, username) {
  User.findOne({ username: username }).then(function (user) {
    if (!user) { return res.sendStatus(404) }
    req.profile = user
    return next()
  }).catch(next)
})

router.get('/:username', auth.optional, profilesController.get)

router.post('/:username/follow', auth.required, profilesController.follow)

router.delete('/:username/follow', auth.required, profilesController.unfollow)

module.exports = router
