import { all } from 'redux-saga/effects';
import auth from './auth/sagas';
import userProfile from './user-profile/sagas';
import company from './company/sagas';

export default function* rootSaga() {
  // @ts-ignore
  return yield all([auth, userProfile, company]);
}
