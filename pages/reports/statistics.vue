<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon :name="STATISTICS_ICON" class="text-4xl text-ten" />
      <h1 class="text-xl uppercase">{{ $t("statistics") }}</h1>
    </div>

    {{ data }}
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGet } from "~/hooks/fetch";

const filterData = ref({
  search: "",
});

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
