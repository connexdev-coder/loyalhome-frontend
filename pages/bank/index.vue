<template>
  <div class="flex flex-col items-stretch gap-4">
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <img src="/assets/icons/money.svg" class="w-6" alt="" srcset="" />
        <h1>{{ $t("bank") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-2">
        <NuxtLink
          to="/bank/qasa_transaction"
          class="flex flex-row items-center justify-center gap-2 bg-ten text-white px-2 py-2 text-md rounded-sm"
        >
          <img
            src="/assets/icons/history.svg"
            class="w-5 whiteFilter"
            alt=""
            srcset=""
          />
          <span> {{ $t("qasa_transaction") }} </span>
        </NuxtLink>
        <ManageQasaTransaction
          :manage-data="manageData"
          type="add"
          :id="0"
          @refresh="onRefresh"
        >
          <div class="flex flex-row items-center justify-center gap-2">
            <img
              src="/assets/icons/transaction.svg"
              class="w-5 whiteFilter"
              alt=""
              srcset=""
            />
            <span> {{ $t("money_transaction") }} </span>
          </div>
        </ManageQasaTransaction>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <!-- From -->
      <div class="flex flex-col items-start text-md">
        <label for="" class="">{{ $t("from") }}</label>
        <input
          class="py-2 px-2 border-[1px] rounded-sm"
          type="date"
          v-model="dataFilter.from"
        />
      </div>
      <!-- To -->
      <div class="flex flex-col items-start text-md">
        <label for="" class="">{{ $t("to") }}</label>
        <input
          class="py-2 px-2 border-[1px] rounded-sm"
          type="date"
          v-model="dataFilter.to"
        />
      </div>

      <div class="flex flex-col items-start text-md">
        <label for="" class="text-sixty">{{ $t("search") }}</label>
        <button
          @click="
            () => {
              fetchDatas();
            }
          "
          class="px-3 py-2 text-white rounded-sm bg-ten"
        >
          {{ $t("filter") }}
        </button>
      </div>
    </div>

    <div v-if="status == 'success'" class="flex flex-col items-start gap-2">
      <div class="flex flex-wrap gap-2 items-center">
        <!-- Qasa -->
        <div
          class="p-3 rounded-sm bg-orange-500 text-white flex flex-row items-center gap-2"
        >
          <img
            src="/assets/icons/money.svg"
            class="whiteFilter w-6"
            alt=""
            srcset=""
          />
          <h1>
            {{ $t("qasa_money") }} =
            {{
              (
                parseInt(data.data[0].bookings) +
                parseInt(data.data[0].box_deposit) +
                parseInt(data.data[0].employee_owings_paid) -
                parseInt(data.data[0].employee_owings) -
                parseInt(data.data[0].employee_salary) -
                parseInt(data.data[0].import) -
                parseInt(data.data[0].spendings) -
                parseInt(data.data[0].company_payment) -
                parseInt(data.data[0].box_withdraw)
              ).toLocaleString()
            }}
            IQD
          </h1>
        </div>

        <!-- Income -->
        <div
          class="p-3 rounded-sm bg-green-500 text-white flex flex-row items-center gap-2"
        >
          <img
            src="/assets/icons/income.svg"
            class="whiteFilter w-6"
            alt=""
            srcset=""
          />
          <h1>
            {{ $t("income_money") }} =
            {{ parseInt(data.data[0].bookings).toLocaleString() }}
            IQD
          </h1>
        </div>

        <!-- Spending -->
        <div
          class="p-3 rounded-sm bg-yellow-500 text-white flex flex-row items-center gap-2"
        >
          <img
            src="/assets/icons/spending.svg"
            class="whiteFilter w-6"
            alt=""
            srcset=""
          />
          <h1>
            {{ $t("spend_money") }} =
            {{
              (
                parseInt(data.data[0].employee_salary) +
                parseInt(data.data[0].import) +
                parseInt(data.data[0].spendings) +
                parseInt(data.data[0].company_payment)
              ).toLocaleString()
            }}
            IQD
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGet } from "~/hooks/fetch";
import type { qasaTransactionType } from "~/types/tableTypes";

const manageData = ref<qasaTransactionType>({
  amount: 0,
  invoice_img: "",
  is_deposit: true,
  setter: "",
  getter: "",
  note: "",
});

definePageMeta({
  requiredAuthorities: ["bank"],
});

const dataFilter = ref({
  from: "",
  to: "",
});

const data = ref<any>(null);
const status = ref<any>(null);

async function fetchDatas() {
  const { data: productData, status: productStatus }: any = await useGet(
    `statistics?` +
      `from=${dataFilter.value.from}` +
      `&to=${dataFilter.value.to}`
  );

  data.value = productData.value;
  status.value = productStatus.value;
}

fetchDatas();

function onRefresh(event: any) {
  fetchDatas();
}
</script>

<style scoped></style>
