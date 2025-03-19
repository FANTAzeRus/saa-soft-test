import {defineStore} from 'pinia'
import {ref} from "vue";
import type {Account} from "@/types/Account.ts";
import {RecordType} from "@/types/RecordType.ts";

const LOCAL_STORAGE_KEY: string = "accounts";

const saveToLocalStorage = (data: Account[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

const resotoreFromLocalStorage = (): Account[] => {
  const dataFromLocalStorage:string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
  if(dataFromLocalStorage) {
    return JSON.parse(dataFromLocalStorage);
  }

  return [];
}

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>(resotoreFromLocalStorage());

  const addNewAccount = () => {
    accounts.value.push({
      label: null,
      recordType: null,
      login: null,
      password: null,
    });

    saveToLocalStorage(accounts.value);
  }

  const updateAccount = (idx: number, parts: Object) => {
    accounts.value[idx] = {
      ...accounts.value[idx],
      ...parts
    }

    saveToLocalStorage(accounts.value);
  }

  const removeAccount = (idx: number) => {
    accounts.value.splice(idx, 1);
    saveToLocalStorage(accounts.value);
  }


  return {
    accounts,
    addNewAccount,
    updateAccount,
    removeAccount
  }
})
