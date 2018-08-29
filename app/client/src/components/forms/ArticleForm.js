import React, { Component } from 'react'
import Form from './Form'
import AuthService from './../../services/AuthService'

class ArticleForm extends Component {
  constructor (props) {
    super(props)

    this.auth = new AuthService()
    this.onSubmited = this.onSubmited.bind(this)
  }

  onSubmited (data, e) {
    this.auth.fetch('http://localhost:1337' + '/api/articles', {
      method: 'POST',
      body: JSON.stringify({article: data})
    })
      .then(console.log)
      .catch(console.log)
  }

  render () {
    return (
      <Form onSubmited={this.onSubmited}>
        Title: <input type='title' name='title' id='form-title' />
        <br />
        Description: <input type='description' name='description' id='form-description' />
        <br />
        Content: <input type='body' name='body' id='form-body' />
        <br />
        <input type='submit' value='CreateArticle' />
      </Form>
    )
  }
}

export default ArticleForm
