import { isPast, isFuture } from 'date-fns';
import { cpf, cnpj } from 'cpf-cnpj-validator';
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

export function validPhone(value: string | undefined) : string | undefined {
  const reg = /^\d+$/;
  const clearValue = value?.replaceAll('(', '').replaceAll('+', '').replaceAll(')', '').replaceAll(' ', '')
    .replaceAll('-', '')
    .replaceAll('_', '');
  if (clearValue?.length === 0 ?? true) {
    return undefined;
  }
  if (!reg.test(clearValue ?? '') || (clearValue?.length ?? 0) < 10) {
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

export function isCpf(value: string) : string | undefined {
  if (value?.length === 0 ?? true) {
    return undefined;
  }
  const clear = value.replaceAll('.', '').replaceAll('-', '').replaceAll('_', '');
  if (!cpf.isValid(clear)) {
    return 'deve ser um CPF válido';
  }
  return undefined;
}

export function isCnpj(value: string) : string | undefined {
  if (value?.length === 0 ?? true) {
    return undefined;
  }
  const clear = value.replaceAll('.', '').replaceAll('/', '').replaceAll('-', '').replaceAll('_', '');
  if (!cnpj.isValid(clear)) {
    return 'deve ser um CNPJ válido';
  }
  return undefined;
}

export function isCpfOrCnpj(value: string) : string | undefined {
  const clear = value?.replaceAll('.', '')?.replaceAll('-', '').replaceAll('/', '').replaceAll('_', '');
  if ((clear === undefined) || (clear?.length === 0 ?? true)) {
    return undefined;
  }
  if (clear.length < 12) {
    if (!cpf.isValid(clear)) {
      return 'deve ser um documento válido';
    }
    return undefined;
  }
  if (!cnpj.isValid(clear)) {
    return 'deve ser um documento válido';
  }
  return undefined;
}

export function isEmail(value: string) : string | undefined {
  if (value?.length === 0 ?? true) {
    return undefined;
  }
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(value)) {
    return 'deve ser um e-mail válido';
  }
  return undefined;
}
