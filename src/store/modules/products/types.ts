import { FormValue } from '../../types/FormValue';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { PaginateFilter } from '../../types/PaginateFilter';

export interface TreinamentQuestionOption {
  id: string;
  isCorrect: boolean;
  content: string;
}

export interface TreinamentQuestion {
  id: string;
  enunciated: string;
  secondsLimit: number;
  options: Array<TreinamentQuestionOption>;
}

export function validateTreinamentQuestions(questions: Array<TreinamentQuestion>) : string | undefined {
  if (questions?.length === 0 ?? true) {
    return 'Deve ter ao menos 1 pergunta';
  }
  let response = '';
  questions.forEach((q, i) => {
    let localResp = '';
    if (q.enunciated?.length === 0 ?? true) {
      localResp += ' um enunciado, ';
    }
    if (q.secondsLimit <= 0) {
      localResp += ' um límite de tempo maior que 0, ';
    }
    if (q.options?.length <= 0 ?? true) {
      localResp += ' alguma opção de resposta, ';
    }
    if (q.options.some((o) => o.content?.length <= 0 ?? true)) {
      localResp += ' todas as opções com conteúdo, ';
    }
    if (q.options.reduce((accu, current) => (current.isCorrect ? accu + 1 : accu), 0) !== 1) {
      localResp += ' 1 opção certa, ';
    }
    if (localResp.length > 0) {
      response += `, a pergunta ${i + 1} deve ter${localResp.substr(0, localResp.length - 2)}`;
    }
  });
  if (response.length > 0) {
    return response.substring(2);
  }
  return undefined;
}

export interface Treinament {
  id: string;
  productId: string;
  productName: string;
  minPercentageToPass: number;
  questions: Array<TreinamentQuestion>;
  createdAt: Date,
  updatedAt: Date
}

export interface CreateTreinamentForm {
  minPercentageToPass: FormValue<number>;
  questions: FormValue<Array<TreinamentQuestion>>;
  [index: string]: FormValue<any>,
}

export interface UpdateTreinamentForm {
  id: FormValue<string>;
  minPercentageToPass: FormValue<number>;
  questions: FormValue<Array<TreinamentQuestion>>;
  [index: string]: FormValue<any>,
}

export interface CreateProductForm {
  name: FormValue<string>;
  description: FormValue<string>;
  mainImage: FormValue<string>;
  images: FormValue<Array<string>>;
  categoryId: FormValue<string>;
  [index: string]: FormValue<any>,
}

export interface UpdateProductForm {
  id: FormValue<string>;
  name: FormValue<string>;
  description: FormValue<string>;
  mainImage: FormValue<string>;
  images: FormValue<Array<string>>;
  imagesBlob: FormValue<Array<File>>;
  categoryId: FormValue<string>;
  [index: string]: FormValue<any>,
}

export interface Product {
  id: string,
  name: string,
  description: string,
  companyId: string,
  companyName: string,
  categoryId: string,
  categoryName: string,
  mainImage: string,
  images: Array<string>,
  totalTreinamentDones: number,
  totalProvesSent: number,
  createdAt: Date,
  updatedAt: Date
}

export interface ProductList {
  id: string,
  name: string,
  mainImage: string,
  description: string,
  createdAt: string,
  updatedAt: string
}

export interface ProductOption {
  label: string,
  value: string,
}

export interface ProductFilter {
  name: string | undefined,
  description: string | undefined,
  createdAt: Date | undefined,
  updatedAt: Date | undefined
}

export interface ProductState {
  readonly loadingSaveForm: boolean;
  readonly loadingGetList: boolean;
  readonly loadingGetById: boolean;
  readonly loadingDelete: boolean;
  readonly loadingOptions: boolean;
  readonly viewData: Product;
  readonly createForm: CreateProductForm;
  readonly updateForm: UpdateProductForm;
  readonly createTreinamentForm: CreateTreinamentForm;
  readonly updateTreinamentForm: UpdateTreinamentForm;
  readonly paginated: PaginatedResponse<ProductList>;
  readonly options: Array<ProductOption>;
  readonly paginateFilter: PaginateFilter;
  readonly filter: ProductFilter;
  readonly callBackCreate?: {(): void};
  readonly callBackUpdate?: {(): void};
  readonly callBackDelete?: {(): void};
}
