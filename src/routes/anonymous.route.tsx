import React from 'react';
import {
  Route, Switch, Redirect, RouteComponentProps,
} from 'react-router-dom';
import SignInPage from '../pages/SignIn';

export default function AnonymousRoutes() : JSX.Element {
  return (
    <Switch>
      <Route path="*" exact component={SignInPage} />
      <Route
        path="*"
        render={(props: RouteComponentProps<any>) => <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
      />
    </Switch>
  );
}
