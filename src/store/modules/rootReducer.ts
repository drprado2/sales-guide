import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth/slice';
import errors from './errors/slice';
import template from './template/slice';
import userProfile from './user-profile/slice';
import company from './company/slice';

const rootReducer = combineReducers({
  auth,
  errors,
  template,
  userProfile,
  company,
});
export default rootReducer;
