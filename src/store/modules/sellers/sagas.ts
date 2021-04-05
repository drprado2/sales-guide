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
  CreateSellerForm, UpdateSellerForm, Seller, SellerList,
} from './types';
import { FormValue } from '../../types/FormValue';
import { isValid } from '../../validations/validations';

const baseUrl = 'api/v1/sellers';

export function* getList() {
  let response : AxiosResponse;
  try {
    const { paginateFilter, filter } = yield select((state) => state.sellers);
    response = yield call(api.get, `${baseUrl}`, { params: { ...paginateFilter, ...filter } });
    const castResp = response.data as PaginatedResponse<SellerList>;
    castResp.data = castResp.data.map((d) => ({ ...d, lastAccess: d.lastAccess ? format(new Date(d.lastAccess), 'dd/MM/yyyy') : undefined }));
    yield put(actions.onGetListSuccess(castResp));
  } catch (err) {
    console.error('Fail getting paginated sellers', err);
    yield put(actions.onGetListFailure());
    const { errors } = err.response.data;
    yield put(errorsActions.appendErrors(errors && errors.length > 0 ? errors : [{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]));
  }
}

export function* getById(action: PayloadAction<string>) {
  let response : AxiosResponse;
  try {
    response = yield call(api.get, `${baseUrl}/${action.payload}`);
    const castResp = response.data as Seller;
    yield put(actions.onGetByIdSuccess(castResp));
  } catch (err) {
    console.error('Fail getting seller by id', err);
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
    } = yield select((state) => state.sellers);

    const form = createForm as CreateSellerForm;
    const req = {
      email: form.email.value,
      name: form.name.value,
      avatarImage: form.avatarImage.value,
      zoneId: form.zoneId.value,
      document: form.document.value,
      phone: form.phone.value,
      birthDate: form.birthDate.value,
      enable: form.enable.value,
    };

    yield call(api.post, `${baseUrl}`, req);
    yield put(actions.onCreateSuccess());
  } catch (err) {
    console.error('Fail creating seller', err.response.data);
    yield put(actions.onCreateFailure());
    const { errors } = err.response.data;
    yield put(errorsActions.appendErrors(errors && errors.length > 0 ? errors : [{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]));
  }
}

export function* update() {
  let response : AxiosResponse;
  try {
    yield put(actions.validateUpdateForm());
    const {
      updateForm,
    } = yield select((state) => state.sellers);
    if (!isValid(updateForm)) {
      yield put(actions.onUpdateFailure());
      yield put(errorsActions.appendErrors([{ title: 'Formulário inválido', code: '00', message: 'Por favor corriga os valores do formulário' }]));
      return;
    }
    const form = updateForm as UpdateSellerForm;
    const req = {
      name: form.name.value,
      avatarImage: form.avatarImage.value,
      zoneId: form.zoneId.value,
      document: form.document.value,
      phone: form.phone.value,
      birthDate: form.birthDate.value,
      enable: form.enable.value,
    };

    yield call(api.put, `${baseUrl}/${form.id.value}`, req);
    yield put(actions.onUpdateSuccess());
  } catch (err) {
    console.error('Fail updating seller', err, err?.response?.data);
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
    } = yield select((state) => state.sellers);

    yield call(api.delete, `${baseUrl}/${action.payload.id}`);
    yield put(actions.onDeleteSuccess(action.payload.id));
  } catch (err) {
    console.error('Fail deleting seller', err.response.data);
    yield put(actions.onDeleteFailure());
    const { errors } = err.response.data;
    yield put(errorsActions.appendErrors(errors && errors.length > 0 ? errors : [{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]));
  }
}

export default all([
  takeLatest(actions.getList.type, getList),
  takeLatest(actions.setPaginateFilter.type, getList),
  takeLatest(actions.setFilter.type, getList),
  takeLatest(actions.onDeleteSuccess.type, getList),
  takeLatest(actions.getById.type, getById),
  takeLatest(actions.updateRequest.type, update),
  takeLatest(actions.createRequest.type, create),
  takeLatest(actions.deleteRequest.type, deleteRegistry)]);
