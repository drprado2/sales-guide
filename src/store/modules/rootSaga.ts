import { all } from 'redux-saga/effects';
import auth from './auth/sagas';
import userProfile from './user-profile/sagas';
import company from './company/sagas';
import zones from './zones/sagas';
import sellers from './sellers/sagas';
import employeeTypes from './employeeTypes/sagas';

export default function* rootSaga() {
  // @ts-ignore
  return yield all([auth, userProfile, company, zones, sellers, employeeTypes]);
}
