import React, { Component } from 'react'
import NavLink from '../../node_modules/react-router-dom/NavLink'
import AuthService from './../services/AuthService'

let auth = new AuthService()

export class Details extends Component {
  constructor (props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount () {
    console.log(this.props)
    auth.fetch('http://localhost:1337' + '/api/articles' + '/' + this.props.match.params.article)
      .then(a => {
        this.setState(a)
      })
      .catch(console.log)
  }

  render () {
    if (!this.state.article) {
      return <h1>Loading...</h1>
    }

    return (
      <div >
        <h1>{this.state.article.title}</h1>
        <p>{this.state.article.body} </p>
        <h2>{this.state.article.description} </h2>
        <NavLink to={'/articles/delete/' + this.state.article.slug}>Delete</NavLink>
        <br />
        <NavLink to={'/articles/edit/' + this.state.article.slug}>Edit</NavLink>
      </div>
    )
  }
}

export default Details
