import { FormValue } from '../../types/FormValue';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

export interface CreateSellerForm {
  name: FormValue<string>;
  email: FormValue<string>;
  zoneId: FormValue<string>;
  document: FormValue<string>;
  phone: FormValue<string | undefined>,
  birthDate: FormValue<Date | undefined>,
  enable: FormValue<boolean>,
  avatarImage: FormValue<string>,
  [index: string]: FormValue<any>,
}

export interface UpdateSellerForm {
  id: FormValue<string>;
  name: FormValue<string>;
  zoneId: FormValue<string>;
  document: FormValue<string>;
  phone: FormValue<string | undefined>,
  birthDate: FormValue<Date | undefined>,
  enable: FormValue<boolean>,
  avatarImage: FormValue<string>,
  [index: string]: FormValue<any>,
}

export interface Seller {
  id: string,
  companyId: string,
  companyName: string,
  name: string,
  email: string,
  zoneId: string,
  zoneName: string,
  document: string,
  phone: string | undefined,
  birthDate: string | undefined,
  enable: boolean,
  avatarImage: string,
  totalProvesSent: number,
  totalTreinamentDones : number,
  lastAccess: string | undefined,
  createdAt: string,
  updatedAt: string
}

export interface SellerList {
  id: string,
  name: string,
  email: string,
  document: string,
  avatarImage: string,
  enable: boolean,
  lastAccess: string | undefined
}

export interface SellerFilter {
  name: string | undefined,
  email: string | undefined,
  document: string | undefined,
  enable: boolean | undefined,
  lastAccess: string | undefined,
  [index: string]: any,
}

export interface SellerState {
  readonly loadingSaveForm: boolean;
  readonly loadingGetList: boolean;
  readonly loadingGetById: boolean;
  readonly loadingDelete: boolean;
  readonly viewData: Seller;
  readonly createForm: CreateSellerForm;
  readonly updateForm: UpdateSellerForm;
  readonly paginated: PaginatedResponse<SellerList>;
  readonly paginateFilter: PaginateFilter;
  readonly filter: SellerFilter;
  readonly callBackCreate?: {(): void};
  readonly callBackUpdate?: {(): void};
  readonly callBackDelete?: {(): void};
}
