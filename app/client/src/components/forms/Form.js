import React, { Component } from 'react'

class Form extends Component {
  constructor (props) {
    super(props)

    this.state = genState(this.props.children, this.props.settings)
    this.onChanged = this.onChanged.bind(this)
    this.onSubmited = this.onSubmited.bind(this)
  }

  onChanged (e) {
    let name = e.target.name
    let value = e.target.value

    this.setState({[name]: value})
    console.log(3)
  }

  onSubmited (e) {
    e.preventDefault()

    this.props.onSubmited(Object.assign({}, this.state))
  }

  render () {
    console.log(this.state)

    return (
      <form onSubmit={this.onSubmited}>
        {React.Children.map(this.props.children, mapChirdren.bind(this))}
      </form>
    )
  }
}

export default Form

function mapChirdren (child) {
  if (isValid(child)) {
    return React.cloneElement(child, {onChange: this.onChanged, value: this.state[child.props.name]})
  }

  return child
}

function genState (children) {
  let settings = {}

  React.Children.forEach(children, child => {
    console.log(child)

    if (isValid(child)) {
      settings[child.props.name] = child.props.value || ''
    }
  })

  return settings
}

function isValid (child) {
  if (child.type === 'input' && child.props.name) {
    return true
  }

  return false
}
