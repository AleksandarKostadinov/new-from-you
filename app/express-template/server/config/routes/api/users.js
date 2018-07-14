const router = require('express').Router()
const auth = require('../../auth')
const userContriller = require('./../../../controllers').users

router.post('/', userContriller.registerPost)

router.post('/login', userContriller.loginPost)

router.get('/me', auth.required, userContriller.meGet)

router.put('/me', auth.required, auth.isInRole('Admin'), userContriller.mePut)

router.use(function (err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message
        return errors
      }, {})
    })
  }
  return next(err)
})

module.exports = router
