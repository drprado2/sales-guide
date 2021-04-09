import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth/slice';
import errors from './errors/slice';
import template from './template/slice';
import userProfile from './user-profile/slice';
import company from './company/slice';
import zones from './zones/slice';
import sellers from './sellers/slice';
import employeeTypes from './employeeTypes/slice';

const rootReducer = combineReducers({
  auth,
  errors,
  template,
  userProfile,
  company,
  zones,
  sellers,
  employeeTypes,
});
export default rootReducer;
