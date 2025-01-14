<template>
  <div class="flex flex-col gap-3 pb-3">
    <!-- Title -->
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon :name="DASHBOARD_ICON" class="text-2xl text-ten" />
      <h1 class="text-xl uppercase">{{ $t("dashboard") }}</h1>
      <span class="text-ten">({{ $t("this_month") }})</span>
    </div>

    <!-- Sales And Imports -->
    <div
      v-if="data"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
    >
      <div class="bg-ballon text-white p-3 rounded-sm aspect-video">
        <div class="flex flex-row items-center gap-1">
          <Icon :name="BALLON_ICON" class="text-lg" />
          <h1 class="line-clamp-1 text-lg">{{ $t("ballon_sale") }}</h1>
        </div>
        <span class="text-2xl">
          {{
            (
              Number(data[0]["ballon_owing"]) + Number(data[0]["ballon_cash"])
            ).toLocaleString()
          }}$
        </span>
      </div>
      <div class="bg-ballon text-white p-3 rounded-sm aspect-video">
        <div class="flex flex-row items-center gap-1">
          <Icon :name="BALLON_ICON" class="text-lg" />
          <h1 class="line-clamp-1 text-lg">{{ $t("ballon_remaining") }}</h1>
        </div>
        <span class="text-2xl">
          {{
            (
              Number(data[0]["ballon_owing"]) +
              Number(data[0]["ballon_cash"]) -
              Number(data[0].ballon_client_payment)
            ).toLocaleString()
          }}$
        </span>
      </div>
      <div class="bg-ballon text-white p-3 rounded-sm aspect-video">
        <div class="flex flex-row items-center gap-1">
          <Icon :name="METER_ICON" class="text-lg" />
          <h1 class="line-clamp-1 text-lg">{{ $t("total_meter") }}</h1>
        </div>
        <span class="text-2xl">
          {{ Number(data[0]["ballon_meter"]) }}
        </span>
      </div>

      <div class="bg-mdf text-white p-3 rounded-sm aspect-video">
        <div class="flex flex-row items-center gap-1">
          <Icon :name="MDF_ICON" class="text-lg" />
          <h1 class="line-clamp-1 text-lg">{{ $t("mdf_sale") }}</h1>
        </div>
        <span class="text-2xl">
          {{
            (
              Number(data[0]["mdf_owing"]) + Number(data[0]["mdf_cash"])
            ).toLocaleString()
          }}$
        </span>
      </div>

      <div class="bg-mdf text-white p-3 rounded-sm aspect-video">
        <div class="flex flex-row items-center gap-1">
          <Icon :name="MDF_ICON" class="text-lg" />
          <h1 class="line-clamp-1 text-lg">{{ $t("mdf_remaining") }}</h1>
        </div>
        <span class="text-2xl">
          {{
            (
              Number(data[0]["mdf_owing"]) +
              Number(data[0]["mdf_cash"]) -
              Number(data[0].mdf_client_payment)
            ).toLocaleString()
          }}$
        </span>
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
