import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

const SuperAdminRouter = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/superAdmin/superAdminsignin",
            state: {
              from: props.location,
            },
          }}
        />
      )
    }
  />
);

export default SuperAdminRouter;
