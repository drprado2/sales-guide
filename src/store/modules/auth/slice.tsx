import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FcBusinessman, FcDepartment, FcPieChart, FcSmartphoneTablet,
} from 'react-icons/all';
import {
  AuthState, LoginForm, Role, Route, User,
} from './types';
import DashboardPage from '../../../pages/Dashboard';
import dashboardImg from '../../../assets/images/dashboard-svg-back.svg';
import companyImg from '../../../assets/images/company-page-img.svg';
import sellersImg from '../../../assets/images/sellers-page-img.svg';
import productsImg from '../../../assets/images/products-page-img.svg';
import CompanyPage from '../../../pages/Company';
import SellersPage from '../../../pages/Sellers';
import ProductsPage from '../../../pages/Products';
import UserProfilePage from '../../../pages/UserProfile';

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
    id: 'company',
    component: CompanyPage,
    exact: true,
    path: '/company',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Empresa',
    icon: <FcDepartment />,
    pageImage: companyImg,
    showOnMenu: true,
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
    id: 'user-profile',
    component: UserProfilePage,
    exact: true,
    path: '/user_profile',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Meu Perfil',
    icon: <FcSmartphoneTablet />,
    pageImage: undefined,
    showOnMenu: false,
  },
];

const authTokenKey = 'auth:token';
const authRolesKey = 'auth:roles';
const authUserKey = 'auth:user';

export const authorizedRoutes = (roles: Role[]) => allRoutes.filter((route) =>
  roles.some((userRole: string) => route.roles.indexOf(userRole) > -1));

const initialState: AuthState = {
  loadingSignInRequest: false,
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
