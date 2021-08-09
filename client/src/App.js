import React from 'react';

import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './components/Login/LoginPage';
import Register from './components/Register/RegisterPage';
import PrivateRoute from './components/Router/PrivateRoute';
import PublicRoute from './components/Router/PublicRoute';

import 'antd/dist/antd.css';
import ChatContainer from './components/Chat/ChatContainer';

const App = () => (
  <Router>
    <Switch>
      <PublicRoute path="/register" component={Register} />
      <PublicRoute path="/login" component={Login} />
      <PrivateRoute path="/" component={ChatContainer} />
    </Switch>
  </Router>
);

export default App;
