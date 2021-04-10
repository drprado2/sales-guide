import {
  takeLatest, call, put, all, takeEvery, select,
} from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import * as actions from './slice';
import api from '../../../services/api';
import { Company } from './types';
import * as errorsActions from '../errors/slice';

export function* getUser() {
  let response : AxiosResponse;
  try {
    const { companyId } = yield select((state) => state.auth.user);
    response = yield call(api.get, `api/v1/company/${companyId}`);
    const company = response.data as Company;
    yield put(actions.onGetCompanySuccess(company));
  } catch (err) {
    console.error('Fail getting company', err);
    yield put(actions.onGetCompanyFailure());
    yield put(errorsActions.appendErrors(err?.response?.data?.errors));
  }
}

export function* updateCompany() {
  let response : AxiosResponse;
  try {
    const { companyId } = yield select((state) => state.auth.user);
    const {
      name, logo, primaryColor, secondaryColor, primaryFontColor, secondaryFontColor,
    } = yield select((state) => state.company.editCompanyForm);

    yield call(api.put, `api/v1/company/${companyId}`, {
      name: name.value, logo: logo.value, primaryColor: primaryColor.value, primaryFontColor: primaryFontColor.value, secondaryColor: secondaryColor.value, secondaryFontColor: secondaryFontColor.value,
    });
    yield put(actions.onUpdateCompanySuccess());
  } catch (err) {
    console.error('Fail updating company', err);
    yield put(actions.onUpdateCompanyFailure());
    yield put(errorsActions.appendErrors(err?.response?.data?.errors));
  }
}

export default all([takeLatest(actions.getCompanyRequest.type, getUser), takeLatest(actions.updateCompanyRequest.type, updateCompany)]);
