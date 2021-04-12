import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth/slice';
import errors from './errors/slice';
import template from './template/slice';
import userProfile from './user-profile/slice';
import company from './company/slice';
import zones from './zones/slice';
import sellers from './sellers/slice';
import employeeTypes from './employeeTypes/slice';
import productCategories from './productCategories/slice';
import products from './products/slice';

const rootReducer = combineReducers({
  auth,
  errors,
  template,
  userProfile,
  company,
  zones,
  sellers,
  employeeTypes,
  productCategories,
  products,
});
export default rootReducer;
