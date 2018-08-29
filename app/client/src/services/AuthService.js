import fetcher from './fetcher'
import observer from './observer'

export default class AuthService {
  // Initializing important variables
  constructor (domain) {
    this.domain = domain || 'http://localhost:1337' // API server domain
    this.fetch = this.fetch.bind(this) // React binding stuff
    this.login = this.login.bind(this)
    this.register = this.register.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }

  register (username, password, email) {
    return this.fetch(`${this.domain}/api/users/`, {
      method: 'POST',
      body: JSON.stringify({
        user: {
          email,
          username,
          password
        }
      })
    }).then(this.handleResponse)
  }

  login (email, password) {
    // Get a token from api server using the fetch api
    return this.fetch(`${this.domain}/api/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        user: {
          email,
          password
        }
      })
    }).then(this.handleResponse)
  }

  loggedIn () {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken() // GEtting token from localstorage
    return token && true // handwaiving here
  }

  handleResponse (res) {
    observer.login.subscribe(() => {}, res.user.username)
    observer.login.trigger()
    window.localStorage.setItem('username', res.user.username)
    this.setToken(res.user.token) // Setting the token in localStorage
    return Promise.resolve(res)
  }

  setToken (idToken) {
    // Saves user token to localStorage
    window.localStorage.setItem('id_token', idToken)
  }

  getToken () {
    // Retrieves the user token from localStorage
    return window.localStorage.getItem('id_token')
  }

  logout () {
    observer.clear()
    // Clear user token and profile data from localStorage
    window.localStorage.removeItem('id_token')
  }

  fetch (url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers['Authorization'] = 'Bearer ' + this.getToken()
    }

    return fetcher(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json())
  }

  _checkStatus (response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }
}
