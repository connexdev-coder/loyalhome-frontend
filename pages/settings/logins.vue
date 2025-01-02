<template>
  <div class="flex flex-col gap-3 pb-10">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="HISTORY_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("logins") }}</h1>
      </div>
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success'"
      :columns="columns"
      :rows="data"
      :currentPage="currentPage"
      :totalPages="totalPages"
      primary_key="manager_login_id"
      api_route="configs/logins"
      @page-change="fetchPage"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1"></div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGet } from "~/hooks/fetch";
import { Table } from "@/components/rcp";

const { t } = useI18n();

const filterData = ref({
  search: "",
  from: "",
  to: "",
});

// Define columns
const columns = [
  { key: "name", label: t("name"), sortable: true },
  { key: "note", label: t("note") },
  { key: "created_at", label: t("created_at") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `configs/logins?page=${page}&search=${filterData.value.search}&from=${filterData.value.from}&to=${filterData.value.to}`
  );
  data.value = dataData.value.data;
  status.value = dataStatus.value;
  totalPages.value = dataData.value.total_pages;
  currentPage.value = page;
}

// Fetch initial page
fetchPage(currentPage.value);

function fetchCurrentPage() {
  fetchPage(currentPage.value);
}
</script>
