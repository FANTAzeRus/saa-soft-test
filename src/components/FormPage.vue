<template>
  <section>
    <div class="container">
      <div class="account__title">
        Учетные записи

        <n-button @click="addNewAccountHandler">
          <PlusIcon />
        </n-button>
      </div>
    </div>

    <div class="container">
      <LabelInfo />
    </div>

    <div class="container" v-if="accounts.length">
      <AccountTitle />
      <AccountItem :account="account" v-for="(account, idx) in accounts" :idx="idx" :key="idx" />
    </div>
  </section>
</template>

<script setup lang="ts">

import {computed} from "vue";
import {useAccountStore} from "@/stores/account.js";
import AccountItem from "@/components/AccountItem.vue";
import PlusIcon from "@/components/PlusIcon.vue";
import {NButton} from "naive-ui";
import AccountTitle from "@/components/AccountTitle.vue";
import LabelInfo from "@/components/LabelInfo.vue";

const store = useAccountStore();

const accounts = computed(() => store.accounts)
const addNewAccountHandler = () => {
  store.addNewAccount();
}

</script>