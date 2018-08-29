import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import AuthService from './../../services/AuthService'
import protectedRoute from '../../hoc/withRights';

const apiDomain = 'http://localhost:1337'

class EditForm extends Component {
  constructor (props) {
    super(props)

    this.auth = new AuthService()
    this.onSubmited = this.onSubmited.bind(this)
    this.onChanged = this.onChanged.bind(this)
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
    console.log(this.state)

    let newData = Object.assign({}, this.state.settings)

    this.auth.fetch(`${apiDomain}/api/articles/${this.props.match.params.article}`, {
      method: 'PUT',
      body: JSON.stringify({article: newData})
    })
      .then(console.log)
      .catch(console.log)
  }

  onChanged (e) {
    let name = e.target.name
    let value = e.target.value

    this.setState((prev) => {
      return {
        settings: {
          ...prev.settings,
          [name]: value
        }
      }
    })
    console.log(3)
  }

  render () {
    return (
      <Form onSubmit={this.onSubmited}>
        <FormGroup>
          <Label for='exampleTitle'>Title</Label>
          <Input onChange={this.onChanged} type='text' name='title' id='exampleTitle' placeholder='with a placeholder' value={this.state.settings.title} />
        </FormGroup>
        <FormGroup>
          <Label for='exampleBody'>Body</Label>
          <Input onChange={this.onChanged} type='body' name='body' id='exampleBody' placeholder='with a placeholder' value={this.state.settings.body} />
        </FormGroup>
        <FormGroup>
          <Label for='exampleDescription'>Description</Label>
          <Input onChange={this.onChanged} type='textarea' name='description' id='exampleText' value={this.state.settings.description} />
        </FormGroup>
        
        <Button type='submit'>Submit</Button>
      </Form>
    )
  }
}

// let authRoute = protectedRoute(['admin', 'user'], () => {
//   return this.auth.loggedIn()
// })
// let ProtectedEdit = authRoute(EditForm)
//
export default EditForm
