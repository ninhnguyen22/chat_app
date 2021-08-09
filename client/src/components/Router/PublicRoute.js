import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth } from '../../services/auth';

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      auth.currentUser
        ? <Redirect to="/" />
        : <Component {...props} />
    )}
  />
);

export default PublicRoute;
