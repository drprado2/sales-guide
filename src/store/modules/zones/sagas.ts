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
  CreateZoneForm, UpdateZoneForm, Zone, ZoneList, ZoneOption,
} from './types';

const baseUrl = 'api/v1/zones';

export function* getList() {
  let response : AxiosResponse;
  try {
    const { paginateFilter, filter } = yield select((state) => state.zones);
    response = yield call(api.get, `${baseUrl}`, { params: { ...paginateFilter, ...filter } });
    const castResp = response.data as PaginatedResponse<ZoneList>;
    console.log('vejaa', castResp);
    castResp.data = castResp.data.map((d) => ({ ...d, createdAt: format(new Date(d.createdAt), 'dd/MM/yyyy'), updatedAt: format(new Date(d.updatedAt), 'dd/MM/yyyy') }));
    console.log('vejaa 2', castResp);
    yield put(actions.onGetListSuccess(castResp));
  } catch (err) {
    console.error('Fail getting paginated zones', err);
    yield put(actions.onGetListFailure());
    const { errors } = err.response.data;
    yield put(errorsActions.appendErrors(errors && errors.length > 0 ? errors : [{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]));
  }
}

export function* getOptions() {
  let response : AxiosResponse;
  try {
    response = yield call(api.get, `${baseUrl}/options`);
    const castResp = response.data as Array<ZoneOption>;
    yield put(actions.onGetOptionsSuccess(castResp));
  } catch (err) {
    console.error('Fail getting options zones', err);
    yield put(actions.onGetOptionsFailure());
    const { errors } = err.response.data;
    yield put(errorsActions.appendErrors(errors && errors.length > 0 ? errors : [{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]));
  }
}

export function* getById(action: PayloadAction<string>) {
  let response : AxiosResponse;
  try {
    response = yield call(api.get, `${baseUrl}/${action.payload}`);
    const castResp = response.data as Zone;
    yield put(actions.onGetByIdSuccess(castResp));
  } catch (err) {
    console.error('Fail getting zone by id', err);
    yield put(actions.onGetByIdFailure());
    const { errors } = err.response.data;
    yield put(errorsActions.appendErrors(errors && errors.length > 0 ? errors : [{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]));
  }
}

export function* create() {
  let response : AxiosResponse;
  try {
    const {
      createForm,
    } = yield select((state) => state.zones);

    const form = createForm as CreateZoneForm;
    const req = {
      name: form.name.value,
      description: form.description.value,
    };

    yield call(api.post, `${baseUrl}`, req);
    yield put(actions.onCreateSuccess());
  } catch (err) {
    console.error('Fail creating zone', err);
    yield put(actions.onCreateFailure());
    const { errors } = err.response.data;
    yield put(errorsActions.appendErrors(errors && errors.length > 0 ? errors : [{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]));
  }
}

export function* update() {
  let response : AxiosResponse;
  try {
    const {
      updateForm,
    } = yield select((state) => state.zones);

    const form = updateForm as UpdateZoneForm;
    const req = {
      name: form.name.value,
      description: form.description.value,
    };

    yield call(api.put, `${baseUrl}/${form.id.value}`, req);
    yield put(actions.onUpdateSuccess());
  } catch (err) {
    console.error('Fail updating zone', err.response.data);
    yield put(actions.onUpdateFailure());
    const { errors } = err.response.data;
    yield put(errorsActions.appendErrors(errors && errors.length > 0 ? errors : [{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]));
  }
}

export function* deleteRegistry(action: PayloadAction<{id: string, callBack: {(): void}}>) {
  let response : AxiosResponse;
  try {
    const {
      createForm,
    } = yield select((state) => state.zones);

    yield call(api.delete, `${baseUrl}/${action.payload.id}`);
    yield put(actions.onDeleteSuccess(action.payload.id));
  } catch (err) {
    console.error('Fail deleting zone', err.response.data);
    yield put(actions.onDeleteFailure());
    const { errors } = err.response.data;
    yield put(errorsActions.appendErrors(errors && errors.length > 0 ? errors : [{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]));
  }
}

export default all([
  takeLatest(actions.getList.type, getList),
  takeLatest(actions.setPaginateFilter.type, getList),
  takeLatest(actions.onDeleteSuccess.type, getList),
  takeLatest(actions.getOptions.type, getOptions),
  takeLatest(actions.getById.type, getById),
  takeLatest(actions.updateRequest.type, update),
  takeLatest(actions.createRequest.type, create),
  takeLatest(actions.deleteRequest.type, deleteRegistry)]);
