import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ErrorsState } from './types';
import { ErrorType } from '../../types/Error';

const initialState: ErrorsState = {
  errors: [],
};

const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    printError(state, action: PayloadAction<ErrorType[]>) {
      Swal.fire({
        title: action.payload[0].title,
        text: action.payload.reduce((prev, cur) => `${prev}${prev ? ', ' : ''}${cur.message}`, ''),
        icon: 'error',
      });
    },
    clearErrors(state, action: PayloadAction) {
      state.errors = [];
    },
    appendErrors(state, action: PayloadAction<ErrorType[]>) {
      if (!action.payload || action.payload.length === 0) {
        state.errors = state.errors.concat([{ title: 'Erro inesperado', code: '00', message: 'Ocorreu um erro inesperado, por favor tente novamente mais tarde' }]);
      } else {
        state.errors = state.errors.concat(action.payload);
      }
    },
  },
});

export const {
  printError,
  appendErrors,
  clearErrors,
} = errorsSlice.actions;

export default errorsSlice.reducer;
