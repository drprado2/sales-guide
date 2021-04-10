import { FormValue } from '../../types/FormValue';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

export interface CreateProductCategoryForm {
  name: FormValue<string>;
  description: FormValue<string>;
  icon: FormValue<string>;
  [index: string]: FormValue<any>,
}

export interface UpdateProductCategoryForm {
  id: FormValue<string>;
  name: FormValue<string>;
  description: FormValue<string>;
  icon: FormValue<string>;
  [index: string]: FormValue<any>,
}

export interface ProductCategory {
  id: string,
  name: string,
  description: string,
  companyId: string,
  companyName: string,
  icon: string,
  totalProducts: number,
  createdAt: Date,
  updatedAt: Date
}

export interface ProductCategoryList {
  id: string,
  name: string,
  icon: string,
  description: string,
  createdAt: string,
  updatedAt: string
}

export interface ProductCategoryOption {
  label: string,
  value: string,
}

export interface ProductCategoryFilter {
  name: string | undefined,
  description: string | undefined,
  createdAt: Date | undefined,
  updatedAt: Date | undefined
}

export interface ProductCategoryState {
  readonly loadingSaveForm: boolean;
  readonly loadingGetList: boolean;
  readonly loadingGetById: boolean;
  readonly loadingDelete: boolean;
  readonly loadingOptions: boolean;
  readonly viewData: ProductCategory;
  readonly createForm: CreateProductCategoryForm;
  readonly updateForm: UpdateProductCategoryForm;
  readonly paginated: PaginatedResponse<ProductCategoryList>;
  readonly options: Array<ProductCategoryOption>;
  readonly paginateFilter: PaginateFilter;
  readonly filter: ProductCategoryFilter;
  readonly callBackCreate?: {(): void};
  readonly callBackUpdate?: {(): void};
  readonly callBackDelete?: {(): void};
}
