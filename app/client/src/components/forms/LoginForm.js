import React, { Component } from 'react'
import Form from './Form'
import AuthService from './../../services/AuthService'

class LoginForm extends Component {
  constructor (props) {
    super(props)

    this.auth = new AuthService()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (data, e) {
    this.auth
      .login(data.email, data.password)
      .then(user => console.log(user))
      .catch(console.log)
  }

  render () {
    return (
      <Form onSubmited={this.onSubmit}>
        Email: <input type='email' name='email' id='login-email' />
        Password: <input type='password' name='password' id='login-password' />
        <input type='submit' value='Login' id='login-submit' />
      </Form>
    )
  }
}

export default LoginForm
