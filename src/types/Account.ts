import type {LabelItem} from "@/types/Label.ts";
import type {RecordType} from "@/types/RecordType.ts";

export type Account = {
  label?: LabelItem[] | null,
  recordType: RecordType | null,
  login: string | null,
  password: string | null,
}

export type AccountForm = {
  label?: string | null,
  recordType?: RecordType | null,
  login?: string | null,
  password?: string | null,
}