import {
  takeLatest, call, put, all, takeEvery, select,
} from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import jwt from 'jwt-decode';
import * as actions from './slice';
import * as errorsActions from '../errors/slice';
import api from '../../../services/api';
import { User } from './types';

// call quando formos chamar funções assíncronas ou outros generators
// put para fazer dispatch de action
// takeLatest => Caso você já tenha uma task desse tipo rodando ele cancela ela se uma nova for chamada, deixando apenas 1 rodar por vez e priorizando a última
// takeEvery => permite rodar paralelamente várias chamadas

export function* signIn() {
  let response : AxiosResponse;
  try {
    const { email, password } = yield select((state) => state.auth.loginForm);
    response = yield call(api.post, '/api/v1/signin', { email, password });
    const planToken = jwt<{userId: string, sub: string, name: string, iat: number}>(response.data.token);
    // @ts-ignore
    const userResp = yield call(api.get, `/api/v1/user/${planToken.userId}`);
    const user = userResp.data as User;
    yield put(actions.signInSuccess({ token: response.data.token, roles: ['VIEWER', 'SELLER'], user }));
  } catch (err) {
    yield put(actions.signInFailure());
    yield put(errorsActions.appendErrors(err?.response?.data?.errors));
  }
}

export default all([takeLatest(actions.signInRequest.type, signIn)]);
