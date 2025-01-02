<template>
  <div class="flex flex-col gap-3 pb-3">
    <!-- Title -->
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon :name="BOX_ICON" class="text-4xl text-ten" />
      <h1 class="text-xl">{{ $t("box") }}</h1>
    </div>

    <!-- ALL -->
    <div class="flex flex-col items-start">
      <h1 class="text-2xl text-ten font-bold">
        {{ $t("box") }}
      </h1>
      <div class="bg-dollar text-white p-3 rounded-sm w-fit min-w-[200px]">
        <h1 class="line-clamp-1 text-lg">{{ $t("box") }}</h1>
        <span v-if="data" class="text-2xl">
          {{
            Number(
              //Plus
              //mdf
              Number(data[0].mdf_client_payment) +
                Number(data[0].mdf_cash) +
                Number(data[0].mdf_box_deposit) +
                //ballon
                Number(data[0].ballon_client_payment) +
                Number(data[0].ballon_cash) +
                Number(data[0].ballon_box_deposit) -
                //Minus
                //Withdraw
                Number(data[0].ballon_box_withdraw) +
                Number(data[0].mdf_box_withdraw) +
                //Sale Owing
                Number(data[0].ballon_owing) +
                Number(data[0].mdf_owing) +
                //spending
                Number(data[0].employee_salary_payment) +
                Number(data[0].wasted_product) +
                Number(data[0].company_payment) +
                Number(data[0].import_cash) +
                Number(data[0].kar_spending) +
                Number(data[0].bnchina_spending)
            ).toLocaleString()
          }}$
        </span>
      </div>
    </div>

    <!-- Owings -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <!-- Client Owings -->
      <div class="flex flex-col items-start">
        <h1 class="text-2xl text-ten font-bold">
          {{ $t("client_depts") }}
        </h1>
        <div class="bg-destructive text-white p-3 rounded-sm w-full">
          <h1 class="line-clamp-1 text-lg">{{ $t("owing") }}</h1>
          <span v-if="data" class="text-2xl">
            {{
              Number(
                Number(data[0].ballon_owing) + Number(data[0].mdf_owing)
              ).toLocaleString()
            }}$
          </span>
        </div>
      </div>

      <!-- Company Owings -->
      <div class="flex flex-col items-start">
        <h1 class="text-2xl text-ten font-bold">
          {{ $t("company_depts") }}
        </h1>
        <div class="bg-destructive text-white p-3 rounded-sm w-full">
          <h1 class="line-clamp-1 text-lg">{{ $t("owing") }}</h1>
          <span v-if="data" class="text-2xl">
            {{ Number(Number(data[0].import_owing)).toLocaleString() }}$
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGet } from "~/hooks/fetch";

// Backend pagination
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage() {
  const { data: dataData, status: dataStatus }: any = await useGet(`reports`);
  data.value = dataData.value.data;
  status.value = dataStatus.value;
}

// Fetch initial page
fetchPage();
</script>
