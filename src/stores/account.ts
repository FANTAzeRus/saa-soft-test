import {defineStore} from 'pinia'
import {ref} from "vue";
import type {Account} from "@/types/Account.ts";

const LOCAL_STORAGE_KEY: string = "accounts";

const restoreFromLocalStorage = (): Account[] => {
  const dataFromLocalStorage:string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
  if(dataFromLocalStorage) {
    return JSON.parse(dataFromLocalStorage);
  }

  return [];
}

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>(restoreFromLocalStorage());

  const addNewAccount = () => {
    accounts.value.push({
      label: null,
      recordType: null,
      login: null,
      password: null,
    });
  }

  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(accounts.value));
  }

  const updateAccount = (idx: number, parts: Object) => {
    accounts.value[idx] = {
      ...accounts.value[idx],
      ...parts
    }
  }

  const removeAccount = (idx: number) => {
    accounts.value.splice(idx, 1);
    saveToLocalStorage();
  }


  return {
    accounts,
    addNewAccount,
    updateAccount,
    removeAccount,
    saveToLocalStorage,
  }
})
