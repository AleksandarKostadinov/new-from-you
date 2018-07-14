const mongoose = require('mongoose')
const router = require('express').Router()
const Article = mongoose.model('Article')
const Comment = mongoose.model('Comment')
const auth = require('../../auth')
const articlesController = require('./../../../controllers').articles

router.get('/feed', auth.required, articlesController.feedGet)

router.get('/', auth.optional, articlesController.get)

router.post('/', auth.required, articlesController.post)

router.param('article', function (req, res, next, slug) {
  Article.findOne({ slug: slug })
    .populate('author')
    .then(function (article) {
      if (!article) {
        return res.sendStatus(404)
      }
      req.article = article
      return next()
    }).catch(next)
})

router.get('/:article', auth.optional, articlesController.detailsGet)

router.put('/:article', auth.required, articlesController.detailsPut)

router.delete('/:article', auth.required, articlesController.deleteArticle)

router.get('/:article/comments', auth.optional, articlesController.commentsByArticleGet)

router.post('/:article/comments', auth.required, articlesController.commentInArticlePost)

router.param('comment', function (req, res, next, id) {
  Comment.findById(id).then(function (comment) {
    if (!comment) { return res.sendStatus(404) }
    req.comment = comment
    return next()
  }).catch(next)
})

router.delete('/:article/comments/:comment', auth.required, articlesController.deleteComment)

router.post('/:article/favorite', auth.required, articlesController.favoritePost)

router.delete('/:article/favorite', auth.required, articlesController.favoriteDelete)

module.exports = router
