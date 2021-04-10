import {
  takeLatest, call, put, all, takeEvery, select,
} from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import * as actions from './slice';
import api from '../../../services/api';
import { UserProfile } from './types';
import * as errorsActions from '../errors/slice';

export function* getUser() {
  let response : AxiosResponse;
  try {
    const { id } = yield select((state) => state.auth.user);
    response = yield call(api.get, `api/v1/user/${id}/profile`);
    const user = response.data as UserProfile;
    yield put(actions.onGetUserSuccess(user));
  } catch (err) {
    console.error('Fail getting user', err);
    yield put(actions.onGetUserFailure());
    yield put(errorsActions.appendErrors(err?.response?.data?.errors));
  }
}

export function* updateProfile() {
  let response : AxiosResponse;
  try {
    const { id } = yield select((state) => state.auth.user);
    const {
      avatarImage, birthDate, name, password, phone,
    } = yield select((state) => state.userProfile.profileForm);

    yield call(api.put, `api/v1/user/${id}/profile`, {
      avatarImage: avatarImage.value, birthDate: birthDate.value, name: name.value, password: password.value, phone: phone.value,
    });
    yield put(actions.onUpdateUserSuccess());
  } catch (err) {
    console.error('Fail getting user', err);
    yield put(actions.onUpdateUserFailure());
    yield put(errorsActions.appendErrors(err?.response?.data?.errors));
  }
}

export default all([takeLatest(actions.getUserRequest.type, getUser), takeLatest(actions.updateUserRequest.type, updateProfile)]);
