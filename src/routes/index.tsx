import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { v4 } from 'uuid';
import { StoreState } from '../store';
import AuthenticatedRoutes from './authenticated.route';
import AnonymousRoutes from './anonymous.route';
import Template from '../components/Template';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import DrawerMenu from '../components/DrawerMenu';
import Footer from '../components/Footer';
import { signInSuccess } from '../store/modules/auth/slice';

export default function Routes() {
  const { isSignedIn } = useSelector((state: StoreState) => state.auth);
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && !isSignedIn()) {
      console.log('dispatching', isAuthenticated);
      dispatch(signInSuccess({
        user: {
          id: user?.email ?? v4(),
          password: '********',
          avatarImage: user?.picture ?? '',
          companyId: v4(),
          email: user?.email ?? '',
          name: user?.name ?? '',
          createdAt: new Date(),
          updatedAt: new Date(user?.updated_at ?? ''),
        },
        roles: ['VIEWER', 'SELLER'],
        token: '',
      }));
    }
  }, [isAuthenticated, isLoading]);

  console.log('dados do auto 0', user, isAuthenticated, isLoading);

  return (
    <>
      {isAuthenticated
        ? (
          <Template
            header={<Header />}
            breadcrumb={<Breadcrumb />}
            content={<AuthenticatedRoutes />}
            drawer={<DrawerMenu />}
            footer={<Footer />}
          />
        )
        : <AnonymousRoutes />}
    </>
  );
}
