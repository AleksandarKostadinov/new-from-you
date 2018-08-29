import React, { Component } from 'react'
import Article from './Article'
import AuthService from './../services/AuthService'

class Feed extends Component {
  constructor (props) {
    super(props)

    this.state = {
      articles: []
    }
    this.auth = new AuthService()
  }

  componentDidMount () {
    this.auth.fetch('http://localhost:1337' + '/api/articles/feed')
      .then(data => {
        console.log(data, ' hi')
        this.setState(data)
      })
      .catch(console.log)
  }

  render () {
    return (
      <div className='constainer'>
        {this.state.articles.map(a => <Article {...a} />)}
      </div>
    )
  }
}

export default Feed
