export interface ErrorType {
  readonly title: string;
  readonly message: string;
  readonly code: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ErrorsState {
  errors: ErrorType[];
}
