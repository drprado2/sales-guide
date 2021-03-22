import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth/slice';
import errors from './errors/slice';
import template from './template/slice';

const rootReducer = combineReducers({
  auth,
  errors,
  template,
});
export default rootReducer;
