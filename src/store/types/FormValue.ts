export interface FormValue<TValue> {
  errors: Array<string | undefined>;
  value: TValue;
  validations: {(value: TValue): string | undefined}[];
}
