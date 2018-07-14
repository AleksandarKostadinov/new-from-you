const mongoose = require('mongoose')
const Article = mongoose.model('Article')
const User = mongoose.model('User')
const Comment = mongoose.model('Comment')

module.exports = {
  feedGet: function (req, res, next) {
    let limit = 20
    let query = {}
    let offset = 0
    if (typeof req.query.limit !== 'undefined') {
      limit = req.query.limit
    }
    if (typeof req.query.offset !== 'undefined') {
      offset = req.query.offset
    }
    User.findById(req.payload.id).then(function (user) {
      if (!user) { return res.sendStatus(401) }
      query = { author: { $in: user.following } }
      Promise.all([
        Article.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .populate('author')
          .exec(),
        Article.count(query)
      ]).then(function (results) {
        let articles = results[0]
        let articleCount = results[1]
        return res.json({
          articles: articles.map(function (article) {
            return article.toJSONFor(user)
          }),
          articleCount: articleCount
        })
      })
    }).catch(next)
  },

  get: function (req, res, next) {
    let limit = 20
    let offset = 0
    let query = {}
    if (typeof req.query.limit !== 'undefined') {
      limit = req.query.limit
    }
    if (typeof req.query.offset !== 'undefined') {
      offset = req.query.offset
    }
    if (typeof req.query.tag !== 'undefined') {
      query.tagList = { '$in': [req.query.tag] }
    }
    Promise.all([
      req.query.author ? User.findOne({ username: req.query.author }) : null,
      req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
    ]).then(function (results) {
      let favoriter = results[1]
      let author = results[0]
      if (author) {
        query.author = author._id
      }
      if (favoriter) {
        query._id = { $in: favoriter.favorites }
      } else if (req.query.favorited) {
        query._id = { $in: [] }
      }

      return Promise.all([
        Article.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ createdAt: 'desc' })
          .populate('author')
          .exec(),
        Article.count(query).exec(),
        req.payload ? User.findById(req.payload.id) : null
      ]).then(function (results) {
        let articles = results[0]
        let articleCount = results[1]
        let user = results[2]
        return res.json({
          articles: articles.map(function (article) {
            return article.toJSONFor(user)
          }),
          articleCount: articleCount
        })
      })
    }).catch(next)
  },

  post: function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
      if (!user) { return res.sendStatus(401) }
      let article = new Article(req.body.article)
      article.author = user
      return article.save().then(function () {
        return res.json({ article: article.toJSONFor(user) })
      })
    }).catch(next)
  },

  detailsGet: function (req, res, next) {
    Promise.all([
      req.payload ? User.findById(req.payload.id) : null,
      req.article.populate('author').execPopulate()
    ]).then(function (results) {
      let user = results[0]
      return res.json({ article: req.article.toJSONFor(user) })
    }).catch(next)
  },

  detailsPut: function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
      if (req.article.author._id.toString() === req.payload.id.toString()) {
        if (typeof req.body.article.title !== 'undefined') {
          req.article.title = req.body.article.title
        }
        if (typeof req.body.article.description !== 'undefined') {
          req.article.description = req.body.article.description
        }
        if (typeof req.body.article.body !== 'undefined') {
          req.article.body = req.body.article.body
        }
        return req.article.save().then(function () {
          return res.json({ article: req.article.toJSONFor(user) })
        })
      } else {
        return res.sendStatus(403)
      }
    }).catch(next)
  },

  deleteArticle: function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
      if (req.article.author._id.toString() === req.payload.id.toString()) {
        req.article.remove().then(function () {
          return res.sendStatus(204)
        })
      } else {
        return res.sendStatus(403)
      }
    }).catch(next)
  },

  commentsByArticleGet: function (req, res, next) {
    Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function (user) {
      return req.article.populate({
        path: 'comments',
        populate: {
          path: 'author'
        },
        options: {
          sort: {
            createdAt: 'desc'
          }
        }
      }).execPopulate().then(function () {
        return res.json({
          comments: req.article.comments.map(function (comment) {
            return comment.toJSONFor(user)
          })
        })
      })
    }).catch(next)
  },

  commentInArticlePost: function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
      if (!user) { return res.sendStatus(401) }
      let comment = new Comment(req.body.comment)
      comment.author = user
      comment.article = req.article
      comment.save()
      req.article.comments.push(comment)
      return req.article.save().then(function () {
        return res.json({ comment: comment.toJSONFor(user) })
      })
    }).catch(next)
  },

  deleteComment: function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
      if (req.comment.author._id.toString() === req.payload.id.toString()) {
        req.article.comments.remove(req.comment._id)
        return req.article.save()
          .then(Comment.findOne({ _id: req.comment._id }).remove().exec())
          .then(function () {
            return res.sendStatus(204)
          })
      } else {
        return res.sendStatus(403)
      }
    }).catch(next)
  },

  favoritePost: function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
      if (!user) { return res.sendStatus(401) }
      return user.favorite(req.article._id).then(function () {
        return req.article.updateFavoriteCount().then(function () {
          return res.json({ article: req.article.toJSONFor(user) })
        })
      })
    }).catch(next)
  },

  favoriteDelete: function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
      if (!user) { return res.sendStatus(401) }
      return user.unfavorite(req.article._id).then(function () {
        return req.article.updateFavoriteCount().then(function () {
          return res.json({ article: req.article.toJSONFor(user) })
        })
      })
    }).catch(next)
  }
}
