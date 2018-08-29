import React, { Component } from 'react'
import { NavLink } from '../../node_modules/react-router-dom'
import { Media } from 'reactstrap'

class Article extends Component {
  render () {
    console.log(this.props)

    return (
      <Media>
        <Media body>
          <Media heading>
            {this.props.title}
          </Media>
          {this.props.body}
          <NavLink to={'/articles/' + this.props.slug}>Details</NavLink>
        </Media>
      </Media>
    )
  }
}

export default Article
