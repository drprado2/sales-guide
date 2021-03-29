import { FormValue } from '../../types/FormValue';

export interface UserProfileForm {
  id: FormValue<string>;
  name: FormValue<string>;
  phone: FormValue<string>;
  birthDate: FormValue<Date | undefined>,
  password: FormValue<string>,
  avatarImage: FormValue<string>,
  [index: string]: FormValue<any>,
}

export interface UserProfile {
  id: string,
  companyId: string,
  companyName: string,
  name: string,
  email: string,
  phone: string,
  birthDate: Date | undefined,
  recordCreationCount: number,
  recordEditingCount: number,
  recordDeletionCount: number,
  lastAccess: Date,
  password: string,
  avatarImage: string,
  createdAt: Date,
  updatedAt: Date
}

export interface UserProfileState {
  readonly loadingSaveForm: boolean;
  readonly loadingGetProfile: boolean;
  readonly profileForm: UserProfileForm;
  readonly user: UserProfile;
  readonly callBackSaveProfile?: {(): void};
}
