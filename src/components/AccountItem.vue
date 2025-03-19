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
    />

    <n-select
        v-model:value="form.recordType.data"
        :options="recordTypesList"
        @change="(newType: RecordType) => changeRecordType(newType)"
    />

    <template v-if="account.recordType === RecordType.LDAP">
      <n-input
          v-model:value="form.login.data"
          @blur="validateAndSave"
          :status="form.login.status"
      />
    </template>

    <template v-else>
      <div class="account__double">
        <n-input
            v-model:value="form.login.data"
            @blur="validateAndSave"
            :status="form.login.status"
        />

        <n-input
            type="password"
            show-password-on="click"
            v-model:value="form.password.data"
            error-message="Passwords do not match"
            @blur="validateAndSave"
            :status="form.login.status"
        />
      </div>
    </template>

    <n-button ghost :bordered="false" @click="removeAccountHandler">
      <TrashIcon />
    </n-button>

  </div>
</template>

<script setup lang="ts">

import type {Account, AccountForm} from "@/types/Account.ts";
import {RecordType} from "@/types/RecordType.ts";
import type {LabelItem} from "@/types/Label.ts";
import {reactive} from "vue";
import {NButton, NInput, NSelect} from "naive-ui";
import TrashIcon from "@/components/TrashIcon.vue";
import {useAccountStore} from "@/stores/account.ts";
import {ValidationStatus} from "@/types/ValidationStatus.ts";

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

const form = reactive({
  label: {
    required: false,
    data: customDisplayLabel(account.label),
    status: ValidationStatus.SUCCESS
  },
  recordType: {
    required: true,
    data: account.recordType,
    status: ValidationStatus.SUCCESS
  },
  login: {
    required: true,
    data: account.login,
    status: ValidationStatus.SUCCESS
  },
  password: {
    required: true,
    data: account.password,
    status: ValidationStatus.SUCCESS
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

const validateAndSave = () => {
  const data: AccountForm = {};

  Object.keys(form).forEach((field) => {
      if(form[field].validator && typeof form[field].validator === 'function') {
        form[field].status = form[field].validator() ? ValidationStatus.SUCCESS : ValidationStatus.ERROR;
      }
      if(field === 'label') {
        data[field] = form[field].data.split(';').map(item => ({text: item.trim()}));
      } else {
        data[field] = form[field].data;
      }

      if(field === 'recordType' && form[field].data === RecordType.LDAP) {
        form['password'].data = null;
      }
  });


  store.updateAccount(idx, data);
}

</script>