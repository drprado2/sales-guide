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
  TreinamentList,
} from './types';

const baseUrl = 'api/v1/treinaments/executed';

export function* getList() {
  let response : AxiosResponse;
  try {
    const { paginateFilter, filter } = yield select((state) => state.treinaments);
    response = yield call(api.get, `${baseUrl}`, { params: { ...paginateFilter, ...filter } });
    const castResp = response.data as PaginatedResponse<TreinamentList>;
    castResp.data = castResp.data.map((d) => ({
      ...d, executionDate: format(new Date(d.executionDate), 'dd/MM/yyyy'), minPercentageToPass: `${d.minPercentageToPass} %`, percentageReached: `${d.percentageReached} %`,
    }));
    yield put(actions.onGetListSuccess(castResp));
  } catch (err) {
    console.error('Fail getting paginated treinaments', err);
    yield put(actions.onGetListFailure());
    yield put(errorsActions.appendErrors(err?.response?.data?.errors));
  }
}

export default all([
  takeLatest(actions.getList.type, getList),
  takeLatest(actions.setPaginateFilter.type, getList)]);
