import React from 'react';
import {
  Redirect,
  Route, Switch, useHistory,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { StoreState } from '../store';
import { authorizedRoutes } from '../store/modules/auth/slice';

export interface HomeParams {
  companyId: string;
}

export default function AuthenticatedRoutes() {
  return (
    <Switch>
      {authorizedRoutes(['VIEWER', 'SELLER']).filter((r) => !r.isGrouper).map((route) => (
        <Route
          key={route.path}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      )).concat(authorizedRoutes(['VIEWER', 'SELLER']).filter((r) => r.isGrouper).map((r) => r.subPages).reduce((rA, rB) => rA.concat(rB), [])
        .map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        )))
      }
      <Route path="*" render={() => <Redirect to={authorizedRoutes(['VIEWER', 'SELLER'])[0].path} />} />
    </Switch>
  );
}
