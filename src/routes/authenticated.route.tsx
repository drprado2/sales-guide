import React from 'react';
import {
  Redirect,
  Route, Switch, useHistory,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StoreState } from '../store';
import { authorizedRoutes } from '../store/modules/auth/slice';

export interface HomeParams {
  companyId: string;
}

export default function AuthenticatedRoutes() {
  const { roles } = useSelector((state: StoreState) => state.auth);

  return (
    <Switch>
      {authorizedRoutes(roles).filter((r) => !r.isGrouper).map((route) => (
        <Route
          key={route.path}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      )).concat(authorizedRoutes(roles).filter((r) => r.isGrouper).map((r) => r.subPages).reduce((rA, rB) => rA.concat(rB), [])
        .map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        )))
      }
      <Route path="*" render={() => <Redirect to={authorizedRoutes(roles)[0].path} />} />
    </Switch>
  );
}
