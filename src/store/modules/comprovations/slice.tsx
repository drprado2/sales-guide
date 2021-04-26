import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ComprovationList,
  ComprovationState,
} from './types';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

const initialState: ComprovationState = {
  loadingGetList: false,
  paginated: {
    data: [],
    total: 0,
  },
  paginateFilter: {
    current: 0,
    total: 10,
  },
  filter: {
    date: undefined,
    sellerName: undefined,
    productNames: undefined,
    description: undefined,
    clientName: undefined,
  },
};

const slice = createSlice({
  name: 'comprovation',
  initialState,
  reducers: {
    getList(state, action: PayloadAction) {
      state.loadingGetList = true;
    },
    onGetListSuccess(
      state,
      action: PayloadAction<PaginatedResponse<ComprovationList>>,
    ) {
      state.paginated = action.payload;
      state.loadingGetList = false;
    },
    onGetListFailure(state, action: PayloadAction) {
      state.loadingGetList = false;
      state.paginated = initialState.paginated;
    },
    setPaginateFilter(state, action: PayloadAction<PaginateFilter>) {
      state.loadingGetList = true;
      state.paginateFilter = { total: action.payload.total, current: action.payload.current / action.payload.total };
    },
    setFilter(state, action: PayloadAction<{propName: string, value: any}>) {
      state.filter[action.payload.propName] = action.payload.value;
    },
  },
});

export const {
  getList,
  onGetListFailure,
  onGetListSuccess,
  setPaginateFilter,
  setFilter,
} = slice.actions;

export default slice.reducer;
