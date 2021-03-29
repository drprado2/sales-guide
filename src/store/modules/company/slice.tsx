import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Company,
  CompanyState,
} from './types';
import {
  required,
} from '../../validations/validations';

const initialState: CompanyState = {
  loadingGetCompany: false,
  loadingSaveForm: false,
  editCompanyForm: {
    id: { value: '', validations: [], errors: [] },
    name: { value: '', validations: [required], errors: [] },
    logo: { value: 'https://rlv.zcache.com.br/bone_vermelho_uniforme_do_logotipo_relativo_a_promoc-r5b88e3fc7cfc445393b81d8a7274f017_eahvn_8byvr_307.jpg?rvtype=content', validations: [required], errors: [] },
    primaryColor: { value: '', validations: [required], errors: [] },
    secondaryColor: { value: '', validations: [required], errors: [] },
    primaryFontColor: { value: '', validations: [required], errors: [] },
    secondaryFontColor: { value: '', validations: [required], errors: [] },
  },
  company: {
    id: '',
    name: '',
    logo: 'https://rlv.zcache.com.br/bone_vermelho_uniforme_do_logotipo_relativo_a_promoc-r5b88e3fc7cfc445393b81d8a7274f017_eahvn_8byvr_307.jpg?rvtype=content',
    primaryColor: '#000066',
    primaryFontColor: '#ffffff',
    secondaryColor: '#cce4ff',
    secondaryFontColor: '#ffffff',
    totalColaborators: 0,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    getCompanyRequest(state, action: PayloadAction) {
      state.loadingGetCompany = true;
    },
    onGetCompanySuccess(
      state,
      action: PayloadAction<Company>,
    ) {
      const {
        name, logo, primaryColor, primaryFontColor, secondaryColor, secondaryFontColor, id,
      } = action.payload;

      state.company = action.payload;
      state.editCompanyForm.id.value = id;
      state.editCompanyForm.name.value = name;
      state.editCompanyForm.logo.value = logo;
      state.editCompanyForm.primaryColor.value = primaryColor;
      state.editCompanyForm.primaryFontColor.value = primaryFontColor;
      state.editCompanyForm.secondaryColor.value = secondaryColor;
      state.editCompanyForm.secondaryFontColor.value = secondaryFontColor;

      state.loadingGetCompany = false;
    },
    onGetCompanyFailure(state, action: PayloadAction) {
      state.loadingGetCompany = false;
      state.company = initialState.company;
      state.editCompanyForm = initialState.editCompanyForm;
    },
    resetEditCompanyForm(state, action: PayloadAction) {
      state.editCompanyForm = initialState.editCompanyForm;
    },
    setFormField(state, action: PayloadAction<{fieldName: string, value: any}>) {
      const { fieldName, value } = action.payload;
      const f = state.editCompanyForm[fieldName];
      f.value = value;
      f.errors = [];
      f.validations.forEach((v) => {
        const error = v(value);
        if (error) {
          f.errors.push(error);
        }
      });
    },
    updateCompanyRequest(state, action: PayloadAction<{(): void}>) {
      state.loadingSaveForm = true;
      state.callBackSaveEditCompany = action.payload;
    },
    onUpdateCompanySuccess(state, action: PayloadAction) {
      state.loadingSaveForm = false;
      state.callBackSaveEditCompany?.call({});
    },
    onUpdateCompanyFailure(state, action: PayloadAction) {
      state.loadingSaveForm = false;
    },
  },
});

export const {
  setFormField,
  onUpdateCompanyFailure,
  getCompanyRequest,
  onGetCompanyFailure,
  onGetCompanySuccess,
  onUpdateCompanySuccess,
  resetEditCompanyForm,
  updateCompanyRequest,
} = companySlice.actions;

export default companySlice.reducer;
