import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

export interface Option {
  id: string;
  isCorrect: boolean;
  content: string;
  optionSelected: boolean;
}

export interface Question {
  id: string;
  enunciated: string;
  secondsLimit: number;
  options: Array<Option>;
}

export interface TreinamentList {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  sellerImage: string;
  executionDate: string;
  minPercentageToPass: string;
  percentageReached: string;
  passed: boolean;
  questions: Array<Question>;
}

export interface TreinamentFilter {
  productName: string | undefined;
  sellerName: string | undefined;
  minPercentageToPass: number | undefined;
  percentageReached: number | undefined;
  executionDate: Date | undefined;
  passed: boolean | undefined;
  questionEnunciated: string | undefined;
  [index: string]: any,
}

export interface TreinamentState {
  readonly loadingGetList: boolean;
  readonly paginated: PaginatedResponse<TreinamentList>;
  readonly paginateFilter: PaginateFilter;
  readonly filter: TreinamentFilter;
}
