import React from 'react';
import Main from '../components/Main';
import Home from '../components/Home';
import Profile from '../components/Profile';
import Login from '../components/Login'
import { Route, IndexRoute } from 'react-router';

const NoMatch = React.createClass({
  render() {
    return (
      <div>
        <h2>silly goose</h2>
        {/* etc. */}
      </div>
    )
  }
})

export default (
  <Route path="/" component={Main}>
    <Route path="profile/:username" component={Profile} />
    <Route path="login" component={Login} />
    <Route path="*" component={NoMatch}/>
    <IndexRoute component={Home} />
  </Route>
);