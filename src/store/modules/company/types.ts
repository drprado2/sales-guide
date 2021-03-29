import { FormValue } from '../../types/FormValue';

export interface EditCompanyForm {
  id: FormValue<string>;
  name: FormValue<string>;
  logo: FormValue<string>;
  primaryColor: FormValue<string>,
  secondaryColor: FormValue<string>,
  primaryFontColor: FormValue<string>,
  secondaryFontColor: FormValue<string>,
  [index: string]: FormValue<string>,
}

export interface Company {
  id: string,
  name: string,
  logo: string,
  totalColaborators: number,
  primaryColor: string,
  secondaryColor: string,
  primaryFontColor: string,
  secondaryFontColor: string,
  createdAt: Date,
  updatedAt: Date
}

export interface CompanyState {
  readonly loadingSaveForm: boolean;
  readonly loadingGetCompany: boolean;
  readonly editCompanyForm: EditCompanyForm;
  readonly company: Company;
  readonly callBackSaveEditCompany?: {(): void};
}
