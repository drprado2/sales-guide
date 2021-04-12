import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Product,
  ProductList, ProductOption,
  ProductState, Treinament, validateTreinamentQuestions,
} from './types';
import {
  containsCapitalLetters,
  containsLowerCaseLetters,
  containsNumbers, greatherThanOrEqual,
  minLenght, notEmpty, pastDate,
  required, validPhone,
} from '../../validations/validations';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

const initialState: ProductState = {
  loadingDelete: false,
  loadingGetById: false,
  loadingGetList: false,
  loadingSaveForm: false,
  loadingOptions: false,
  options: [],
  createForm: {
    name: { value: '', validations: [required], errors: [] },
    description: { value: '', validations: [], errors: [] },
    mainImage: { value: '', validations: [required], errors: [] },
    images: { value: [], validations: [notEmpty], errors: [] },
    categoryId: { value: '', validations: [required], errors: [] },
  },
  createTreinamentForm: {
    minPercentageToPass: { value: 70, validations: [greatherThanOrEqual(0)], errors: [] },
    questions: { value: [], validations: [validateTreinamentQuestions], errors: [] },
  },
  updateForm: {
    id: { value: '', validations: [], errors: [] },
    name: { value: '', validations: [required], errors: [] },
    description: { value: '', validations: [], errors: [] },
    mainImage: { value: '', validations: [required], errors: [] },
    images: { value: [], validations: [notEmpty], errors: [] },
    imagesBlob: { value: [], validations: [], errors: [] },
    categoryId: { value: '', validations: [required], errors: [] },
  },
  updateTreinamentForm: {
    id: { value: '', validations: [], errors: [] },
    minPercentageToPass: { value: 70, validations: [greatherThanOrEqual(0)], errors: [] },
    questions: { value: [], validations: [validateTreinamentQuestions], errors: [] },
  },
  viewData: {
    companyId: '',
    companyName: '',
    createdAt: new Date(),
    description: '',
    id: '',
    name: '',
    mainImage: '',
    images: [],
    categoryId: '',
    categoryName: '',
    totalTreinamentDones: 0,
    totalProvesSent: 0,
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
  name: 'product',
  initialState,
  reducers: {
    getList(state, action: PayloadAction) {
      state.loadingGetList = true;
    },
    onGetListSuccess(
      state,
      action: PayloadAction<PaginatedResponse<ProductList>>,
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
      action: PayloadAction<Array<ProductOption>>,
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
      action: PayloadAction<{product: Product, treinament: Treinament}>,
    ) {
      const { product, treinament } = action.payload;
      state.viewData = product;
      state.loadingGetById = false;
      state.updateForm.id.value = product.id;
      state.updateForm.description.value = product.description;
      state.updateForm.name.value = product.name;
      state.updateForm.mainImage.value = product.mainImage;
      state.updateForm.images.value = product.images;
      state.updateForm.categoryId.value = product.categoryId;

      state.updateTreinamentForm.id.value = treinament.id;
      state.updateTreinamentForm.minPercentageToPass.value = treinament.minPercentageToPass;
      state.updateTreinamentForm.questions.value = treinament.questions;
    },
    onGetByIdFailure(state, action: PayloadAction) {
      state.loadingGetById = false;
      state.viewData = initialState.viewData;
    },
    resetCreateForm(state, action: PayloadAction) {
      state.createForm = initialState.createForm;
      state.createTreinamentForm = initialState.createTreinamentForm;
    },
    resetUpdateForm(state, action: PayloadAction) {
      state.updateForm = initialState.updateForm;
      state.updateTreinamentForm = initialState.updateTreinamentForm;
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
    setCreateTreinamentFormField(state, action: PayloadAction<{fieldName: string, value: any}>) {
      const { fieldName, value } = action.payload;
      const f = state.createTreinamentForm[fieldName];
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
    setUpdateTreinamentFormField(state, action: PayloadAction<{fieldName: string, value: any}>) {
      const { fieldName, value } = action.payload;
      const f = state.updateTreinamentForm[fieldName];
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
      for (const formKey in state.createTreinamentForm) {
        state.createTreinamentForm[formKey].errors = [];
        state.createTreinamentForm[formKey].validations.forEach((v) => {
          const error = v(state.createTreinamentForm[formKey].value);
          if (error) {
            state.createTreinamentForm[formKey].errors.push(error);
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
  setCreateTreinamentFormField,
  setUpdateTreinamentFormField,
} = slice.actions;

export default slice.reducer;
