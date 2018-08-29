import React, { Component } from 'react'
import Header from './components/common/Header'
import Main from './components/Main'

class App extends Component {
  render () {
    return (
      <div className='container-fluid'>
        <Header />
        <Main />
      </div>
    )
  }
}

export default App
