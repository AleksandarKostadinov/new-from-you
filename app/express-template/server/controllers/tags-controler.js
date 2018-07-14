const Article = require('mongoose').model('Article')

module.exports = {
  all: function (req, res, next) {
    Article.find().distinct('tagList').then(function (tags) {
      return res.json({ tags: tags })
    }).catch(next)
  }
}
