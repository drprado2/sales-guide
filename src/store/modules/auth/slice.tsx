import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FcBusinessman, FcDepartment, FcPieChart, FcSmartphoneTablet,
} from 'react-icons/all';
import { generatePath } from 'react-router';
import {
  AuthState, LoginForm, Role, Route, User,
} from './types';
import DashboardPage from '../../../pages/Dashboard';
import dashboardImg from '../../../assets/images/dashboard-svg-back.svg';
import companyImg from '../../../assets/images/company-page-img.svg';
import sellersImg from '../../../assets/images/sellers-page-img.svg';
import productsImg from '../../../assets/images/products-page-img.svg';
import ViewCompanyPage from '../../../pages/ViewCompany';
import SellersPage from '../../../pages/Sellers';
import ProductsPage from '../../../pages/Products';
import EditUserProfilePage from '../../../pages/EditUserProfile';
import ViewUserProfilePage from '../../../pages/ViewUserProfile';
import EditCompanyPage from '../../../pages/EditCompany';

const authTokenKey = 'auth:token';
const authRolesKey = 'auth:roles';
const authUserKey = 'auth:user';

export const allRoutes: Route[] = [
  {
    id: 'dashboard',
    component: DashboardPage,
    exact: true,
    path: '/dashboard',
    isDefaultForCurrentUser: (roles) => roles.includes('VIEWER'),
    roles: ['VIEWER'],
    title: 'Dashboard',
    icon: <FcPieChart />,
    pageImage: dashboardImg,
    showOnMenu: true,
  },
  {
    id: 'view-company',
    component: ViewCompanyPage,
    exact: true,
    path: '/company/:id',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Empresa',
    icon: <FcDepartment />,
    pageImage: companyImg,
    showOnMenu: true,
  },
  {
    id: 'edit-company',
    component: EditCompanyPage,
    exact: true,
    path: '/company/:id/edit',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Editar Empresa',
    icon: <FcDepartment />,
    pageImage: companyImg,
    showOnMenu: false,
  },
  {
    id: 'sellers',
    component: SellersPage,
    exact: true,
    path: '/sellers',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Vendedores',
    icon: <FcBusinessman />,
    pageImage: sellersImg,
    showOnMenu: true,
  },
  {
    id: 'products',
    component: ProductsPage,
    exact: true,
    path: '/products',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Produtos',
    icon: <FcSmartphoneTablet />,
    pageImage: productsImg,
    showOnMenu: true,
  },
  {
    id: 'edit-user-profile',
    component: EditUserProfilePage,
    exact: true,
    path: '/user_profile/:id/edit',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Editar Meu Perfil',
    icon: <FcSmartphoneTablet />,
    pageImage: undefined,
    showOnMenu: false,
  },
  {
    id: 'view-user-profile',
    component: ViewUserProfilePage,
    exact: true,
    path: '/user_profile/:id',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Meu Perfil',
    icon: <FcSmartphoneTablet />,
    pageImage: undefined,
    showOnMenu: false,
  },
];

export const authorizedRoutes = (roles: Role[]) => allRoutes.filter((route) =>
  roles.some((userRole: string) => route.roles.indexOf(userRole) > -1));

const initialState: AuthState = {
  loadingSignInRequest: false,
  authorizedRoutes: allRoutes.filter((route) => {
    const roles = JSON.parse(localStorage.getItem(authRolesKey) ?? '[]');
    return roles.some((userRole: string) => route.roles.indexOf(userRole) > -1);
  }).map((r) => {
    const user = JSON.parse(localStorage.getItem(authUserKey) || '{}') as User;
    const route = { ...r };
    if (route.id === 'view-company' || route.id === 'edit-company') {
      route.path = generatePath(route.path, { id: user.companyId });
    }
    return route;
  }),
  isSignedIn: () => !!localStorage.getItem(authTokenKey),
  error: false,
  token: localStorage.getItem(authTokenKey),
  roles: JSON.parse(localStorage.getItem(authRolesKey) ?? '[]'),
  loginForm: {
    email: '',
    password: '',
    keepSigned: true,
  },
  user: JSON.parse(localStorage.getItem(authUserKey) || '{}') as User,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInRequest(state, action: PayloadAction<LoginForm>) {
      state.loadingSignInRequest = true;
    },
    signOutRequest(state, action: PayloadAction) {
      localStorage.removeItem(authTokenKey);
      localStorage.removeItem(authRolesKey);
      localStorage.removeItem(authUserKey);
      state.token = '';
      state.isSignedIn = () => !!localStorage.getItem(authTokenKey);
      state.roles = [];
    },
    signInSuccess(
      state,
      action: PayloadAction<{ token: string; roles: string[], user: User }>,
    ) {
      const { token, roles, user } = action.payload;
      if (state.loginForm.keepSigned) {
        localStorage.setItem(authTokenKey, token);
        localStorage.setItem(authUserKey, JSON.stringify(user));
        localStorage.setItem(authRolesKey, JSON.stringify(roles));
      } else {
        sessionStorage.setItem(authTokenKey, token);
        sessionStorage.setItem(authUserKey, JSON.stringify(user));
        sessionStorage.setItem(authRolesKey, JSON.stringify(roles));
      }
      state.authorizedRoutes = allRoutes.filter((route) =>
        roles.some((userRole: string) => route.roles.indexOf(userRole) > -1)).map((r) => {
        const newRoute = { ...r };
        if (newRoute.id === 'view-company' || newRoute.id === 'edit-company') {
          newRoute.path = generatePath(r.path, { id: user.companyId });
        }
        return newRoute;
      });

      state.loginForm = {
        email: '',
        password: '',
        keepSigned: true,
      };
      state.loadingSignInRequest = false;
      state.token = token;
      state.isSignedIn = () => !!localStorage.getItem(authTokenKey);
      state.roles = roles;
      state.user = user;
    },
    signInFailure(state, action: PayloadAction) {
      state.loadingSignInRequest = false;
      state.error = true;
    },
    setLoginEmail(state, action: PayloadAction<string>) {
      state.loginForm.email = action.payload;
    },
    setLoginPassword(state, action: PayloadAction<string>) {
      state.loginForm.password = action.payload;
    },
    setKeepSigned(state, action: PayloadAction<boolean>) {
      state.loginForm.keepSigned = action.payload;
    },
  },
});

export const {
  signInSuccess,
  signInRequest,
  signInFailure,
  signOutRequest,
  setLoginEmail,
  setLoginPassword,
  setKeepSigned,
} = authSlice.actions;

export default authSlice.reducer;
