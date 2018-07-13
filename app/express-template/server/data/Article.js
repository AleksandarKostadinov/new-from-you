const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const URLSlugs = require('mongoose-url-slugs')
const User = mongoose.model('User')

let articleSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  title: { type: String, default: 'Default Title' },
  description: { type: String, default: 'WOW something happened' },
  body: String,
  tagList: [{ type: String }],
  favoritesCount: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

articleSchema.plugin(uniqueValidator, { message: 'is already taken.' })

articleSchema.plugin(URLSlugs('title', { field: 'slug' }))

articleSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    favoritesCount: this.favoritesCount,
    favorited: user ? user.isFavorite(this._id) : false,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: this.author.toProfileJSONFor(user)
  }
}

module.exports = mongoose.model('Article', articleSchema)
