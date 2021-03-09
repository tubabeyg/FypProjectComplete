import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated } from './index';

const DoctorRouter = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/doctor/signin',
            state: {
              from: props.location,
            },
          }}
        />
      )
    }
  />
);

export default DoctorRouter;
