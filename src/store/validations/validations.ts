import { isPast, isFuture } from 'date-fns';
import { FormValue } from '../types/FormValue';

export function isValid(object: {[index: string]:FormValue<any>}) : boolean {
  for (const objectKey in object) {
    if (object[objectKey].errors.length > 0) {
      return false;
    }
  }
  return true;
}

export function required(value: string) : string | undefined {
  if (value?.length === 0 ?? true) {
    return 'valor obrigatório';
  }
  return undefined;
}

export function notContainsNumbers(value: string) : string | undefined {
  const reg = /[0-9]+/;
  if (value?.length === 0 ?? true) {
    return undefined;
  }
  if (reg.test(value)) {
    return 'não pode conter números';
  }
  return undefined;
}

export function containsNumbers(value: string) : string | undefined {
  const reg = /[0-9]+/;
  if (value?.length === 0 ?? true) {
    return undefined;
  }
  if (!reg.test(value)) {
    return 'deve conter números';
  }
  return undefined;
}

export function containsCapitalLetters(value: string) : string | undefined {
  const reg = /[A-Z]+/;
  if (value?.length === 0 ?? true) {
    return undefined;
  }
  if (!reg.test(value)) {
    return 'deve conter letras maiúsculas';
  }
  return undefined;
}

export function containsLowerCaseLetters(value: string) : string | undefined {
  const reg = /[a-z]+/;
  if (value?.length === 0 ?? true) {
    return undefined;
  }
  if (!reg.test(value)) {
    return 'deve conter letras minúsculas';
  }
  return undefined;
}

export function onlyNumbers(value: string) : string | undefined {
  const reg = /^\d+$/;
  if (value?.length === 0 ?? true) {
    return undefined;
  }
  if (!reg.test(value)) {
    return 'deve conter apenas números';
  }
  return undefined;
}

export function minLenght(len: number) : {(value: string): string | undefined} {
  return (value: string) => {
    if (value?.length < len ?? true) {
      return `deve conter no mínimo ${len} caracteres`;
    }
    return undefined;
  };
}

export function maxLenght(len: number) : {(value: string): string | undefined} {
  return (value: string) => {
    if (value?.length < len ?? true) {
      return `deve conter no máximo ${len} caracteres`;
    }
    return undefined;
  };
}

export function validPhone(value: string) : string | undefined {
  const reg = /^\d+$/;
  const clearValue = value?.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')
    .replace('_', '');
  if (clearValue?.length === 0 ?? true) {
    return undefined;
  }
  if (!reg.test(clearValue) || clearValue.length < 10) {
    return 'deve ser um telefone válido';
  }
  return undefined;
}

export function pastDate(value: Date | undefined) : string | undefined {
  if (!value) {
    return undefined;
  }
  if (isFuture(value)) {
    return 'deve ser uma data passada';
  }
  return undefined;
}

export function futureDate(value: Date | undefined) : string | undefined {
  if (!value) {
    return undefined;
  }
  if (isPast(value)) {
    return 'deve ser uma data futura';
  }
  return undefined;
}
