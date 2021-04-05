import { FormValue } from '../../types/FormValue';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

export interface CreateZoneForm {
  name: FormValue<string>;
  description: FormValue<string>;
  [index: string]: FormValue<any>,
}

export interface UpdateZoneForm {
  id: FormValue<string>;
  name: FormValue<string>;
  description: FormValue<string>;
  [index: string]: FormValue<any>,
}

export interface Zone {
  id: string,
  name: string,
  description: string,
  companyId: string,
  companyName: string,
  totalTreinamentDones : number,
  totalProvesSent: number,
  totalSellers: number,
  createdAt: Date,
  updatedAt: Date
}

export interface ZoneList {
  id: string,
  name: string,
  description: string,
  createdAt: string,
  updatedAt: string
}

export interface ZoneOption {
  label: string,
  value: string,
}

export interface ZoneFilter {
  name: string | undefined,
  description: string | undefined,
  createdAt: Date | undefined,
  updatedAt: Date | undefined
}

export interface ZoneState {
  readonly loadingSaveForm: boolean;
  readonly loadingGetList: boolean;
  readonly loadingGetById: boolean;
  readonly loadingDelete: boolean;
  readonly loadingOptions: boolean;
  readonly viewData: Zone;
  readonly createForm: CreateZoneForm;
  readonly updateForm: UpdateZoneForm;
  readonly paginated: PaginatedResponse<ZoneList>;
  readonly options: Array<ZoneOption>;
  readonly paginateFilter: PaginateFilter;
  readonly filter: ZoneFilter;
  readonly callBackCreate?: {(): void};
  readonly callBackUpdate?: {(): void};
  readonly callBackDelete?: {(): void};
}
