import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StoreState } from '../store';
import AuthenticatedRoutes from './authenticated.route';
import AnonymousRoutes from './anonymous.route';
import Template from '../components/Template';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import DrawerMenu from '../components/DrawerMenu';
import Footer from '../components/Footer';

export default function Routes() {
  const { isSignedIn } = useSelector((state: StoreState) => state.auth);

  return (
    <>
      {isSignedIn()
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
