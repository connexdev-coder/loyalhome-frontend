<template>
  <div class="flex flex-col gap-3 pb-3">
    <!-- Title -->
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon :name="DASHBOARD_ICON" class="text-2xl text-ten" />
      <h1 class="text-xl uppercase">{{ $t("dashboard") }}</h1>
      <span class="text-ten">({{ $t("this_month") }})</span>
    </div>

    <div
      v-if="data && status == 'success'"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
    >
      <div
        v-for="span in ['ballon_owing']"
        class="bg-ballon text-white p-3 rounded-sm aspect-video"
      >
        <div class="flex flex-row items-center gap-1">
          <Icon :name="BALLON_ICON" class="text-lg" />
          <h1 class="line-clamp-1 text-lg">{{ $t(span) }}</h1>
        </div>
        <span class="text-2xl">
          {{
            span == "ballon_owing"
              ? Number(data[0][span]) - Number(data[0].ballon_client_payment)
              : span == "ballon_cash"
              ? Number(data[0].ballon_cash) + Number(data[0].ballon_owing)
              : data[0][span]
          }}$
        </span>
      </div>

      <div
        v-for="span in ['mdf_owing']"
        class="bg-mdf text-white p-3 rounded-sm aspect-video"
      >
        <div class="flex flex-row items-center gap-1">
          <Icon :name="MDF_ICON" class="text-lg" />
          <h1 class="line-clamp-1 text-lg">{{ $t(span) }}</h1>
        </div>
        <span class="text-2xl">
          {{
            span == "mdf_owing"
              ? Number(data[0][span]) - Number(data[0].mdf_client_payment)
              : span == "mdf_cash"
              ? Number(data[0].mdf_cash) + Number(data[0].mdf_owing)
              : data[0][span]
          }}$
        </span>
      </div>

      <div
        v-for="span in ['import_owing']"
        class="bg-inventory text-white p-3 rounded-sm aspect-video"
      >
        <div class="flex flex-row items-center gap-1">
          <Icon :name="IMPORT_ICON" class="text-lg" />
          <h1 class="line-clamp-1 text-lg">{{ $t(span) }}</h1>
        </div>
        <span class="text-2xl">
          {{
            span == "import_owing"
              ? Number(data[0][span]) - Number(data[0].company_payment)
              : span == "import_cash"
              ? Number(data[0].import_cash) + Number(data[0].import_owing)
              : data[0][span]
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
