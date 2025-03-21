<template>
  <div class="account__line">
    <n-input
        type="textarea"
        :autosize="{
          minRows: 1
        }"
        v-model:value="form.label.data"
        @blur="validateAndSave"
        :status="form.label.status"
        :autofocus="true"
        placeholder="Значение..."
    />

    <n-select
        v-model:value="form.recordType.data"
        :options="recordTypesList"
        @change="(newType: AccountType) => changeRecordType(newType)"
        :autofocus="false"
        :status="form.recordType.status"
        placeholder="Значение..."
    />

    <template v-if="account.recordType === AccountType.LDAP">
      <n-input
          v-model:value="form.login.data"
          @blur="validateAndSave"
          :status="form.login.status"
          :autofocus="false"
          placeholder="Значение..."
      />
    </template>

    <template v-else>
      <div class="account__double">
        <n-input
            v-model:value="form.login.data"
            @blur="validateAndSave"
            :status="form.login.status"
            :autofocus="false"
            placeholder="Значение..."
        />

        <n-input
            type="password"
            show-password-on="click"
            v-model:value="form.password.data"
            error-message="Passwords do not match"
            @blur="validateAndSave"
            :status="form.password.status"
            :autofocus="false"
            placeholder="Значение..."
        />
      </div>
    </template>

    <n-button ghost :bordered="false" @click="removeAccountHandler">
      <TrashIcon/>
    </n-button>

  </div>
</template>

<script setup lang="ts">

import type {Account, AccountForm} from "@/types/Account.ts";
import {AccountType} from "@/types/AccountType.ts";
import type {LabelItem} from "@/types/Label.ts";
import {computed, reactive} from "vue";
import {NButton, NInput, NSelect} from "naive-ui";
import TrashIcon from "@/components/TrashIcon.vue";
import {useAccountStore} from "@/stores/account.ts";
import {ValidationStatus} from "@/types/ValidationStatus.ts";
import {labelValidator, loginValidator, passwordValidator, recordTypeValidator} from "@/utils/validators.ts";

interface Props {
  account: Account;
  idx: number;
}

const {account, idx} = defineProps<Props>();
const store = useAccountStore();

const customDisplayLabel = (label: LabelItem[] | null): string => {
  if (label)
    return label
        .map(item => item.text)
        .join('; ');

  return "";
}

const form = reactive<AccountForm>({
  label: {
    data: customDisplayLabel(account.label),
    status: ValidationStatus.SUCCESS,
    validator: labelValidator
  },
  recordType: {
    data: account.recordType,
    status: ValidationStatus.SUCCESS,
    validator: recordTypeValidator
  },
  login: {
    data: account.login,
    status: ValidationStatus.SUCCESS,
    validator: loginValidator
  },
  password: {
    data: account.password,
    status: ValidationStatus.SUCCESS,
    validator: passwordValidator
  },
});

const recordTypesList = [
  {
    label: AccountType.LOCAL,
    value: AccountType.LOCAL,
  },
  {
    label: AccountType.LDAP,
    value: AccountType.LDAP,
  }
];

const removeAccountHandler = () => {
  store.removeAccount(idx);
}

const changeRecordType = (newType: AccountType): void => {
  form.recordType.data = newType;
  validateAndSave();
}

const hasErrors = computed(() => {
  return Object.keys(form).any((fieldName: FieldName) => {
    const field = form[fieldName];
    return field.status === ValidationStatus.ERROR;
  });
});

const stringToLabels = (str: string): LabelItem[] => {
  return str
      .split(';')
      .map(item => ({text: item.trim()}));
}

const labelsToString = (labels: LabelItem[]):string => {
  return labels.map(item => item.text).join('; ')
}


const validateAndSave = () => {
  const data: Account = {
    label: null,
    recordType: AccountType.LOCAL,
    login: null,
    password: null,
 };

  Object.keys(form).forEach((field) => {
    switch (field) {
      case "label":
        if (form.label.data) {
          data.label = stringToLabels(form.label.data);
          form.label.status = labelValidator(form.label.data) ? ValidationStatus.SUCCESS : ValidationStatus.ERROR;
          form.label.data = labelsToString(data.label);
        }
        break;

      case "recordType":
        if(form.recordType.data && form.recordType.data === AccountType.LDAP) {
          data.password = null;
        }
        if(form.recordType.data) {}
          data.recordType = form.recordType.data as AccountType;
        form.recordType.status = recordTypeValidator(form.recordType.data) ? ValidationStatus.SUCCESS : ValidationStatus.ERROR;
        break;

      case "login":
        form.login.status = loginValidator(form.login.data) ? ValidationStatus.SUCCESS : ValidationStatus.ERROR;
        data.login = form.login.data;
        break;

      case "password":
        if(form.recordType.data === AccountType.LDAP) {
          form.password.status = ValidationStatus.SUCCESS;
          form.password.data = null;
        } else {
          form.password.status = passwordValidator(form.password.data) ? ValidationStatus.SUCCESS : ValidationStatus.ERROR;
          data.password = form.password.data;
        }
        break;
    }

  });

  store.updateAccount(idx, data);

  if (!hasErrors.value) {
    store.saveToLocalStorage();
  }

}

</script>