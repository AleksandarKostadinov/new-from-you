import React, { Component } from 'react'
import Form from './Form'
import AuthService from '../../services/AuthService'

class RegisterForm extends Component {
  constructor (props) {
    super(props)

    this.auth = new AuthService()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (data, e) {
    this.auth
      .register(data.username, data.password, data.email)
      .then(user => console.log(user))
      .catch(console.log)
  }

  render () {
    return (
      <Form onSubmited={this.onSubmit}>
        Email: <input type='email' name='email' id='login-email' />
        Username: <input type='username' name='username' id='login-username' />
        Password: <input type='password' name='password' id='login-password' />
        <input type='submit' value='Register' id='login-submit' />
      </Form>
    )
  }
}

export default RegisterForm
