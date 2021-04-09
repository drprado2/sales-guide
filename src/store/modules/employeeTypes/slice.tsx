import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  EmployeeType,
  EmployeeTypeList, EmployeeTypeOption,
  EmployeeTypeState,
} from './types';
import {
  containsCapitalLetters,
  containsLowerCaseLetters,
  containsNumbers,
  minLenght, pastDate,
  required, validPhone,
} from '../../validations/validations';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

const initialState: EmployeeTypeState = {
  loadingDelete: false,
  loadingGetById: false,
  loadingGetList: false,
  loadingSaveForm: false,
  loadingOptions: false,
  options: [],
  createForm: {
    name: { value: '', validations: [required], errors: [] },
    description: { value: '', validations: [required], errors: [] },
  },
  updateForm: {
    id: { value: '', validations: [], errors: [] },
    name: { value: '', validations: [required], errors: [] },
    description: { value: '', validations: [required], errors: [] },
  },
  viewData: {
    companyId: '',
    companyName: '',
    createdAt: new Date(),
    description: '',
    id: '',
    name: '',
    totalSellers: 0,
    updatedAt: new Date(),
  },
  paginated: {
    data: [],
    total: 0,
  },
  paginateFilter: {
    current: 0,
    total: 10,
  },
  filter: {
    createdAt: undefined,
    description: undefined,
    name: undefined,
    updatedAt: undefined,
  },
};

const slice = createSlice({
  name: 'employeeType',
  initialState,
  reducers: {
    getList(state, action: PayloadAction) {
      state.loadingGetList = true;
    },
    onGetListSuccess(
      state,
      action: PayloadAction<PaginatedResponse<EmployeeTypeList>>,
    ) {
      state.paginated = action.payload;
      state.loadingGetList = false;
    },
    onGetListFailure(state, action: PayloadAction) {
      state.loadingGetList = false;
      state.paginated = initialState.paginated;
    },
    getOptions(state, action: PayloadAction) {
      state.loadingOptions = true;
    },
    onGetOptionsSuccess(
      state,
      action: PayloadAction<Array<EmployeeTypeOption>>,
    ) {
      state.options = action.payload;
      state.loadingOptions = false;
    },
    onGetOptionsFailure(state, action: PayloadAction) {
      state.loadingOptions = false;
      state.options = initialState.options;
    },
    getById(state, action: PayloadAction<string>) {
      state.loadingGetById = true;
    },
    onGetByIdSuccess(
      state,
      action: PayloadAction<EmployeeType>,
    ) {
      state.viewData = action.payload;
      state.loadingGetById = false;
      state.updateForm.id.value = action.payload.id;
      state.updateForm.description.value = action.payload.description;
      state.updateForm.name.value = action.payload.name;
    },
    onGetByIdFailure(state, action: PayloadAction) {
      state.loadingGetById = false;
      state.viewData = initialState.viewData;
    },
    resetCreateForm(state, action: PayloadAction) {
      state.createForm = initialState.createForm;
    },
    resetUpdateForm(state, action: PayloadAction) {
      state.updateForm = initialState.updateForm;
    },
    resetViewData(state, action: PayloadAction) {
      state.viewData = initialState.viewData;
    },
    setCreateFormField(state, action: PayloadAction<{fieldName: string, value: any}>) {
      const { fieldName, value } = action.payload;
      const f = state.createForm[fieldName];
      f.value = value;
      f.errors = [];
      f.validations.forEach((v) => {
        const error = v(value);
        if (error) {
          f.errors.push(error);
        }
      });
    },
    setUpdateFormField(state, action: PayloadAction<{fieldName: string, value: any}>) {
      const { fieldName, value } = action.payload;
      const f = state.updateForm[fieldName];
      f.value = value;
      f.errors = [];
      f.validations.forEach((v) => {
        const error = v(value);
        if (error) {
          f.errors.push(error);
        }
      });
    },
    validateCreateForm(state) {
      for (const formKey in state.createForm) {
        state.createForm[formKey].errors = [];
        state.createForm[formKey].validations.forEach((v) => {
          const error = v(state.createForm[formKey].value);
          if (error) {
            state.createForm[formKey].errors.push(error);
          }
        });
      }
    },
    createRequest(state, action: PayloadAction<{(): void}>) {
      state.loadingSaveForm = true;
      state.callBackCreate = action.payload;
    },
    onCreateSuccess(state, action: PayloadAction) {
      state.loadingSaveForm = false;
      state.callBackCreate?.call({});
    },
    onCreateFailure(state, action: PayloadAction) {
      state.loadingSaveForm = false;
    },
    updateRequest(state, action: PayloadAction<{(): void}>) {
      state.loadingSaveForm = true;
      state.callBackUpdate = action.payload;
    },
    onUpdateSuccess(state, action: PayloadAction) {
      state.loadingSaveForm = false;
      state.callBackUpdate?.call({});
    },
    onUpdateFailure(state, action: PayloadAction) {
      state.loadingSaveForm = false;
    },
    deleteRequest(state, action: PayloadAction<{id: string, callBack?: {(): void}}>) {
      state.loadingDelete = true;
      state.callBackDelete = action.payload.callBack;
    },
    onDeleteSuccess(state, action: PayloadAction<string>) {
      state.loadingDelete = false;
      state.callBackDelete?.call({});
    },
    onDeleteFailure(state, action: PayloadAction) {
      state.loadingDelete = false;
    },
    setPaginateFilter(state, action: PayloadAction<PaginateFilter>) {
      state.loadingGetList = true;
      state.paginateFilter = { total: action.payload.total, current: action.payload.current / action.payload.total };
    },
  },
});

export const {
  createRequest,
  deleteRequest,
  getById,
  getList,
  onCreateFailure,
  onCreateSuccess,
  onDeleteFailure,
  onDeleteSuccess,
  onGetByIdFailure,
  onGetByIdSuccess,
  onGetListFailure,
  onGetListSuccess,
  onUpdateFailure,
  onUpdateSuccess,
  resetCreateForm,
  resetUpdateForm,
  setCreateFormField,
  setUpdateFormField,
  updateRequest,
  setPaginateFilter,
  resetViewData,
  validateCreateForm,
  getOptions,
  onGetOptionsFailure,
  onGetOptionsSuccess,
} = slice.actions;

export default slice.reducer;
