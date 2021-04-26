import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

export interface ComprovationProduct {
  id: string;
  name: string;
  image: string;
}

export interface ComprovationList {
  id: string;
  products: Array<ComprovationProduct>;
  sellerId: string;
  sellerName: string;
  sellerImage: string;
  date: string;
  description: string;
  clientName: string;
  proveImages: Array<string>;
}

export interface ComprovationFilter {
  productNames: string | undefined;
  sellerName: string | undefined;
  date: Date | undefined;
  description: string | undefined;
  clientName: string | undefined;
  [index: string]: any,
}

export interface ComprovationState {
  readonly loadingGetList: boolean;
  readonly paginated: PaginatedResponse<ComprovationList>;
  readonly paginateFilter: PaginateFilter;
  readonly filter: ComprovationFilter;
}
