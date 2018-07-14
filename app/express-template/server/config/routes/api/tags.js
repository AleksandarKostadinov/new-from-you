const router = require('express').Router()
const tagsController = require('./../../../controllers').tags

router.get('/', tagsController.all)

module.exports = router
