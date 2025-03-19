import {RecordType} from "@/types/RecordType.ts";

export function labelValidator(value:string):boolean {
  return !value ? true : value.length <= 50;
}

export function recordTypeValidator(value:string | RecordType | null): boolean {
  return value !== undefined && value !== null;
}

export function loginValidator(value:string | null): boolean {
  return !!value && value.length <= 100;
}

export function passwordValidator(value:string | null): boolean {
  return !!value && value.length <= 100;
}