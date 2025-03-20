import type {LabelItem} from "@/types/Label.ts";
import type {AccountType} from "@/types/AccountType.ts";
import {ValidationStatus} from "@/types/ValidationStatus.ts";

export interface Account {
  label: LabelItem[] | null,
  recordType: AccountType | null,
  login: string | null,
  password: string | null,
}

export interface FormField<T> {
  data: T;
  status: ValidationStatus;
  validator?: (value: T) => boolean;
}

export type FieldName = 'label' | 'recordType' | 'login' | 'password';

export type AccountForm = {
  [key in FieldName]: FormField<any>
};