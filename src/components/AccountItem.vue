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
        :passively-activated="true"
        placeholder="Метки..."
    />

    <n-select
        v-model:value="form.recordType.data"
        :options="recordTypesList"
        @change="(newType: RecordType) => changeRecordType(newType)"
        :passively-activated="true"
        :status="form.recordType.status"
        placeholder="Тип записи..."
    />

    <template v-if="account.recordType === RecordType.LDAP">
      <n-input
          v-model:value="form.login.data"
          @blur="validateAndSave"
          :status="form.login.status"
          :passively-activated="true"
          placeholder="Логин..."
      />
    </template>

    <template v-else>
      <div class="account__double">
        <n-input
            v-model:value="form.login.data"
            @blur="validateAndSave"
            :status="form.login.status"
            :passively-activated="true"
            placeholder="Логин..."
        />

        <n-input
            type="password"
            show-password-on="click"
            v-model:value="form.password.data"
            error-message="Passwords do not match"
            @blur="validateAndSave"
            :status="form.password.status"
            :passively-activated="true"
            placeholder="Пароль..."
        />
      </div>
    </template>

    <n-button ghost :bordered="false" @click="removeAccountHandler">
      <TrashIcon/>
    </n-button>

  </div>
</template>

<script setup lang="ts">

import type {Account, AccountFormData} from "@/types/Account.ts";
import {RecordType} from "@/types/RecordType.ts";
import type {LabelItem} from "@/types/Label.ts";
import {computed, reactive, ref} from "vue";
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

const customDisplayLabel = (label: LabelItem[] | null | undefined): string => {
  if (label)
    return label
        .map(item => item.text)
        .join('; ');

  return "";
}

const form = reactive<AccountFormData>({
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
    label: RecordType.LOCAL,
    value: RecordType.LOCAL,
  },
  {
    label: RecordType.LDAP,
    value: RecordType.LDAP,
  }
];

const removeAccountHandler = () => {
  store.removeAccount(idx);
}

const changeRecordType = (newType: RecordType): void => {
  form.recordType.data = newType;
  validateAndSave();
}

const hasErrors = computed(() => {
  const errors = ref([]);
  for (const field in form) {
    const value = form[field];
    if(value.status === ValidationStatus.ERROR) {
      errors.value.push(field);
    }
  }

  return errors.value.length;
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
    recordType: null,
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
        if(form.recordType.data && form.recordType.data === RecordType.LDAP) {
          data.password = null;
        }
        if(form.recordType.data) {}
          data.recordType = form.recordType.data as RecordType;
        form.recordType.status = recordTypeValidator(form.recordType.data) ? ValidationStatus.SUCCESS : ValidationStatus.ERROR;
        break;

      case "login":
        form.login.status = loginValidator(form.login.data) ? ValidationStatus.SUCCESS : ValidationStatus.ERROR;
        data.login = form.login.data;
        break;

      case "password":
        if(form.recordType.data === RecordType.LDAP) {
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