import { Redirect, Route } from 'react-router-dom';
import React from 'react';
import { auth } from '../../services/auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (!auth.currentUser) {
        return <Redirect to={{ pathname: '/login' }} />;
      }

      return <Component {...props} />;
    }}
  />
);

export default PrivateRoute;
