import React, { Component } from 'react'
import Article from './Article'
import AuthService from './../services/AuthService'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      articles: []
    }
    this.auth = new AuthService()
  }

  componentDidMount () {
    this.auth.fetch('http://localhost:1337' + '/api/articles')
      .then(data => {
        console.log(data, ' hi')
        this.setState(data)
      })
      .catch(console.log)
  }

  render () {
    return (
      <div className='container'>
        {this.state.articles.map(a => <Article {...a} key={a.slug} />)}
      </div>
    )
  }
}

export default Home
