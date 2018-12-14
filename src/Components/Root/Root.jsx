import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import App from '../App';
import Login from '../Auth/Login';
import Registration from '../Auth/Register';
class Root extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={App}/>
        <Route path='/login' component={Login}/>
        <Route path='/registration' component={Registration}/>
      </Switch>
    );
  }
}

export default Root;