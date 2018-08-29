import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import RegisterForm from './forms/RegisterForm'
import LoginForm from './forms/LoginForm'
import ArticleForm from './forms/ArticleForm'
import Feed from './Feed'
import Details from './Details'
import ProtectedEdit from './forms/EditForm'
import DeleteForm from './forms/DeleteForm'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/login' component={LoginForm} />
      <Route exact path='/register' component={RegisterForm} />
      <Route exact path='/articles/create' component={ArticleForm} />
      <Route exact path='/articles/feed' component={Feed} />
      <Route path='/articles/edit/:article' component={ProtectedEdit} />
      <Route path='/articles/delete/:article' component={DeleteForm} />
      <Route path='/articles/:article' component={Details} />
    </Switch>
  </main>
)

export default Main
