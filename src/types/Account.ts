import type {LabelItem} from "@/types/Label.ts";
import type {RecordType} from "@/types/RecordType.ts";
import {ValidationStatus} from "@/types/ValidationStatus.ts";

export type Account = {
  label?: LabelItem[] | null,
  recordType: RecordType | null,
  login: string | null,
  password: string | null,
}

export interface FormField {
  data: string | RecordType | null;
  status: ValidationStatus;
  validator?: (value: string | RecordType) => boolean;
}

export type fieldName = 'label' | 'recordType' | 'login' | 'password';

export type AccountFormData = Record<fieldName, FormField>;