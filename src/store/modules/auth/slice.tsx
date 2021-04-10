import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FaBook,
  FaBoxes,
  FaBoxOpen,
  FaPhotoVideo,
  FcBriefcase,
  FcBusinessman, FcDepartment, FcGlobe, FcPieChart, FcSmartphoneTablet,
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
import zonesImg from '../../../assets/images/zones-page.svg';
import employeeTypeImg from '../../../assets/images/employee-type-page.svg';
import ViewCompanyPage from '../../../pages/ViewCompany';
import ProductsPage from '../../../pages/Products';
import EditUserProfilePage from '../../../pages/EditUserProfile';
import ViewUserProfilePage from '../../../pages/ViewUserProfile';
import EditCompanyPage from '../../../pages/EditCompany';
import ZonesPage from '../../../pages/Zone/List';
import ViewZonePage from '../../../pages/Zone/View';
import EditZonePage from '../../../pages/Zone/Edit';
import CreateZonePage from '../../../pages/Zone/Create';
import SellersPage from '../../../pages/Sellers/List';
import ViewSellerPage from '../../../pages/Sellers/View';
import EditSellerPage from '../../../pages/Sellers/Edit';
import CreateSellerPage from '../../../pages/Sellers/Create';
import CreateEmployeeTypePage from '../../../pages/EmployeeType/Create';
import EditEmployeeTypePage from '../../../pages/EmployeeType/Edit';
import ViewEmployeeTypePage from '../../../pages/EmployeeType/View';
import EmployeeTypesPage from '../../../pages/EmployeeType/List';
import ProductCategoriesPage from '../../../pages/ProductCategory/List';
import ViewProductCategoryPage from '../../../pages/ProductCategory/View';
import EditProductCategoryPage from '../../../pages/ProductCategory/Edit';
import CreateProductCategoryPage from '../../../pages/ProductCategory/Create';

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
    subPages: [],
    isGrouper: false,
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
    subPages: [],
    isGrouper: false,
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
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'zone-list',
    component: ZonesPage,
    exact: true,
    path: '/zones',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Regiões',
    icon: <FcGlobe />,
    pageImage: zonesImg,
    showOnMenu: true,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'view-zone',
    component: ViewZonePage,
    exact: true,
    path: '/zones/:id/view',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Visualizar Região',
    icon: <FcGlobe />,
    pageImage: zonesImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'edit-zone',
    component: EditZonePage,
    exact: true,
    path: '/zones/:id/edit',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Editar Região',
    icon: <FcGlobe />,
    pageImage: zonesImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'create-zone',
    component: CreateZonePage,
    exact: true,
    path: '/zones/create',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Criar Região',
    icon: <FcGlobe />,
    pageImage: zonesImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'employeeType-list',
    component: EmployeeTypesPage,
    exact: true,
    path: '/employee_types',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Tipos de Contratação',
    icon: <FcBriefcase />,
    pageImage: employeeTypeImg,
    showOnMenu: true,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'view-employeeType',
    component: ViewEmployeeTypePage,
    exact: true,
    path: '/employee_types/:id/view',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Visualizar Tipo de Contratação',
    icon: <FcBriefcase />,
    pageImage: employeeTypeImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'edit-employeeType',
    component: EditEmployeeTypePage,
    exact: true,
    path: '/employee_types/:id/edit',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Editar Tipo de Contratação',
    icon: <FcBriefcase />,
    pageImage: employeeTypeImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'create-employeeType',
    component: CreateEmployeeTypePage,
    exact: true,
    path: '/employee_types/create',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Criar Tipo de Contratação',
    icon: <FcBriefcase />,
    pageImage: employeeTypeImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'seller-list',
    component: SellersPage,
    exact: true,
    path: '/sellers',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Vendedores',
    icon: <FcBusinessman />,
    pageImage: sellersImg,
    showOnMenu: true,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'view-seller',
    component: ViewSellerPage,
    exact: true,
    path: '/sellers/:id/view',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Visualizar Vendedor',
    icon: <FcBusinessman />,
    pageImage: sellersImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'edit-seller',
    component: EditSellerPage,
    exact: true,
    path: '/sellers/:id/edit',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Editar Vendedor',
    icon: <FcBusinessman />,
    pageImage: sellersImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'create-seller',
    component: CreateSellerPage,
    exact: true,
    path: '/sellers/create',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Criar Vendedor',
    icon: <FcBusinessman />,
    pageImage: sellersImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'productsGrouper',
    component: () => <div />,
    exact: true,
    path: '',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Produtos e Treinamentos',
    icon: <FcSmartphoneTablet />,
    pageImage: productsImg,
    showOnMenu: true,
    subPages: [
      {
        id: 'productCategory-list',
        component: ProductCategoriesPage,
        exact: true,
        path: '/product_categories',
        isDefaultForCurrentUser: (roles) => false,
        roles: ['VIEWER'],
        title: 'Categorias de Produto',
        icon: <FcGlobe />,
        pageImage: zonesImg,
        showOnMenu: true,
        subPages: [],
        isGrouper: false,
      },
      {
        id: 'products',
        component: ProductsPage,
        exact: true,
        path: '/products',
        isDefaultForCurrentUser: (roles) => false,
        roles: ['VIEWER'],
        title: 'Produtos',
        icon: <FaBoxOpen />,
        pageImage: productsImg,
        showOnMenu: true,
        subPages: [],
        isGrouper: false,
      },
      {
        id: 'treinaments',
        component: ProductsPage,
        exact: true,
        path: '/treinaments',
        isDefaultForCurrentUser: (roles) => false,
        roles: ['VIEWER'],
        title: 'Treinamentos',
        icon: <FaBook />,
        pageImage: productsImg,
        showOnMenu: true,
        subPages: [],
        isGrouper: false,
      },
      {
        id: 'comprovations',
        component: ProductsPage,
        exact: true,
        path: '/comprovations',
        isDefaultForCurrentUser: (roles) => false,
        roles: ['VIEWER'],
        title: 'Comprovações',
        icon: <FaPhotoVideo />,
        pageImage: productsImg,
        showOnMenu: true,
        subPages: [],
        isGrouper: false,
      },
    ],
    isGrouper: true,
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
    subPages: [],
    isGrouper: false,
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
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'view-productCategory',
    component: ViewProductCategoryPage,
    exact: true,
    path: '/product_categories/:id/view',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Visualizar Categoria de Produto',
    icon: <FcGlobe />,
    pageImage: zonesImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'edit-productCategory',
    component: EditProductCategoryPage,
    exact: true,
    path: '/product_categories/:id/edit',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Editar Categoria de Produto',
    icon: <FcGlobe />,
    pageImage: zonesImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
  },
  {
    id: 'create-productCategory',
    component: CreateProductCategoryPage,
    exact: true,
    path: '/product_categories/create',
    isDefaultForCurrentUser: (roles) => false,
    roles: ['VIEWER'],
    title: 'Criar Categoria de Produto',
    icon: <FcGlobe />,
    pageImage: zonesImg,
    showOnMenu: false,
    subPages: [],
    isGrouper: false,
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
