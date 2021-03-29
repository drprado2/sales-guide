import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  UserProfile,
  UserProfileState,
} from './types';
import { ErrorType } from '../../types/Error';
import {
  containsCapitalLetters,
  containsLowerCaseLetters,
  containsNumbers,
  minLenght, pastDate,
  required, validPhone,
} from '../../validations/validations';

export const defaultPassword = '********';

const initialState: UserProfileState = {
  loadingGetProfile: false,
  loadingSaveForm: false,
  profileForm: {
    id: { value: '', validations: [], errors: [] },
    avatarImage: { value: '', validations: [required], errors: [] },
    birthDate: { value: undefined, validations: [pastDate], errors: [] },
    name: { value: '', validations: [required, minLenght(3)], errors: [] },
    password: { value: defaultPassword, validations: [required, minLenght(8), containsCapitalLetters, containsLowerCaseLetters, containsNumbers], errors: [] },
    phone: { value: '', validations: [validPhone], errors: [] },
  },
  user: {
    avatarImage: '',
    birthDate: undefined,
    companyId: '',
    companyName: '',
    createdAt: new Date(),
    email: '',
    id: '',
    lastAccess: new Date(),
    name: '',
    password: defaultPassword,
    phone: '',
    recordCreationCount: 0,
    recordDeletionCount: 0,
    recordEditingCount: 0,
    updatedAt: new Date(),
  },
};

const userProfileSlice = createSlice({
  name: 'user-profile',
  initialState,
  reducers: {
    getUserRequest(state, action: PayloadAction) {
      state.loadingGetProfile = true;
    },
    onGetUserSuccess(
      state,
      action: PayloadAction<UserProfile>,
    ) {
      const {
        name, phone, birthDate, avatarImage, id,
      } = action.payload;

      state.user = action.payload;
      state.profileForm.id.value = id;
      state.profileForm.name.value = name;
      state.profileForm.avatarImage.value = avatarImage;
      state.profileForm.birthDate.value = birthDate;
      state.profileForm.phone.value = phone;

      state.loadingGetProfile = false;
    },
    onGetUserFailure(state, action: PayloadAction) {
      state.loadingGetProfile = false;
      state.user = initialState.user;
      state.profileForm = initialState.profileForm;
    },
    resetUserProfileForm(state, action: PayloadAction) {
      state.profileForm = initialState.profileForm;
    },
    setFormField(state, action: PayloadAction<{fieldName: string, value: any}>) {
      const { fieldName, value } = action.payload;
      const f = state.profileForm[fieldName];
      f.value = value;
      f.errors = [];
      f.validations.forEach((v) => {
        const error = v(value);
        if (error) {
          f.errors.push(error);
        }
      });
    },
    updateUserRequest(state, action: PayloadAction<{(): void}>) {
      state.loadingSaveForm = true;
      state.callBackSaveProfile = action.payload;
    },
    onUpdateUserSuccess(state, action: PayloadAction) {
      state.loadingSaveForm = false;
      state.callBackSaveProfile?.call({});
    },
    onUpdateUserFailure(state, action: PayloadAction) {
      state.loadingSaveForm = false;
    },
  },
});

export const {
  getUserRequest,
  onGetUserFailure,
  onGetUserSuccess,
  onUpdateUserFailure,
  onUpdateUserSuccess,
  setFormField,
  updateUserRequest,
  resetUserProfileForm,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
