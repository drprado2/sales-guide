import {
  takeLatest, call, put, all, takeEvery, select,
} from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import * as actions from './slice';
import api from '../../../services/api';
import * as errorsActions from '../errors/slice';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import {
  ComprovationList,
} from './types';

const baseUrl = 'api/v1/comprovations';

export function* getList() {
  let response : AxiosResponse;
  try {
    const { paginateFilter, filter } = yield select((state) => state.comprovations);
    response = yield call(api.get, `${baseUrl}`, { params: { ...paginateFilter, ...filter } });
    const castResp = response.data as PaginatedResponse<ComprovationList>;
    console.log(castResp, response.data);
    castResp.data = castResp.data
      .map((d) => ({
        ...d, date: format(new Date(d.date), 'dd/MM/yyyy HH:mm:ss'),
      }));
    yield put(actions.onGetListSuccess(castResp));
  } catch (err) {
    console.error('Fail getting paginated comprovations', err);
    yield put(actions.onGetListFailure());
    yield put(errorsActions.appendErrors(err?.response?.data?.errors));
  }
}

export default all([
  takeLatest(actions.getList.type, getList),
  takeLatest(actions.setPaginateFilter.type, getList)]);
