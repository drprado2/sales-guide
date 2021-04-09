import { FormValue } from '../../types/FormValue';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

export interface CreateEmployeeTypeForm {
  name: FormValue<string>;
  description: FormValue<string>;
  [index: string]: FormValue<any>,
}

export interface UpdateEmployeeTypeForm {
  id: FormValue<string>;
  name: FormValue<string>;
  description: FormValue<string>;
  [index: string]: FormValue<any>,
}

export interface EmployeeType {
  id: string,
  name: string,
  description: string,
  companyId: string,
  companyName: string,
  totalSellers: number,
  createdAt: Date,
  updatedAt: Date
}

export interface EmployeeTypeList {
  id: string,
  name: string,
  description: string,
  createdAt: string,
  updatedAt: string
}

export interface EmployeeTypeOption {
  label: string,
  value: string,
}

export interface EmployeeTypeFilter {
  name: string | undefined,
  description: string | undefined,
  createdAt: Date | undefined,
  updatedAt: Date | undefined
}

export interface EmployeeTypeState {
  readonly loadingSaveForm: boolean;
  readonly loadingGetList: boolean;
  readonly loadingGetById: boolean;
  readonly loadingDelete: boolean;
  readonly loadingOptions: boolean;
  readonly viewData: EmployeeType;
  readonly createForm: CreateEmployeeTypeForm;
  readonly updateForm: UpdateEmployeeTypeForm;
  readonly paginated: PaginatedResponse<EmployeeTypeList>;
  readonly options: Array<EmployeeTypeOption>;
  readonly paginateFilter: PaginateFilter;
  readonly filter: EmployeeTypeFilter;
  readonly callBackCreate?: {(): void};
  readonly callBackUpdate?: {(): void};
  readonly callBackDelete?: {(): void};
}
