import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import AuthService from './../../services/AuthService'

const apiDomain = 'http://localhost:1337'

class DeleteForm extends Component {
  constructor (props) {
    super(props)

    this.auth = new AuthService()
    this.onSubmited = this.onSubmited.bind(this)
    this.state = {
      settings: {
        title: '',
        description: '3',
        body: ''
      }
    }
  }

  componentDidMount () {
    this.auth.fetch(`${apiDomain}/api/articles/${this.props.match.params.article}`, {
      method: 'GET'
    })
      .then(data => {
        console.log(data)

        this.setState({
          settings: Object.assign({}, data.article)
        })
      })
      .catch(console.log)
  }

  onSubmited (e) {
    e.preventDefault()

    this.auth.fetch(`${apiDomain}/api/articles/${this.props.match.params.article}`, {
      method: 'DELETE'
    })
      .then(console.log)
      .catch(console.log)
  }

  render () {
    return (
      <Form onSubmit={this.onSubmited}>
        <FormGroup>
          <Label for='exampleTitle'>Title</Label>
          <Input disabled onChange={this.onChanged} type='text' name='title' id='exampleTitle' placeholder='with a placeholder' value={this.state.settings.title} />
        </FormGroup>
        <FormGroup>
          <Label for='exampleBody'>Body</Label>
          <Input disabled onChange={this.onChanged} type='body' name='body' id='exampleBody' placeholder='with a placeholder' value={this.state.settings.body} />
        </FormGroup>
        <FormGroup>
          <Label for='exampleDescription'>Description</Label>
          <Input disabled onChange={this.onChanged} type='textarea' name='description' id='exampleText' value={this.state.settings.description} />
        </FormGroup>
        
        <Button color='danger' type='submit'>Delete</Button>
      </Form>
    )
  }
}

export default DeleteForm
