<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="REPAYMENT_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("depts") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-1">
        <PrintDialog type="company_deptors" extra="" lang="ku" />
      </div>
    </div>

    <!-- Filter -->
    <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
      <Input
        :value="filterData"
        value-field="search"
        type="text"
        icon="hugeicons:search-01"
        placeholder="search"
        @on-change="fetchCurrentPage"
        @refresh="fetchCurrentPage"
      />
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success'"
      :columns="columns"
      :rows="data"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="company_id"
      api_route="clients"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <NuxtLink :to="`/warehouse/company_depts/${row.company_id}`">
            <div
              class="bg-dollar text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon :name="DOLLAR_ICON" class="text-xl" />
              <span> {{ $t("owing_invoices") }}</span>
            </div>
          </NuxtLink>
        </div>
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
});

// Define columns
const columns = [
  { key: "company_id", label: "ID", sortable: true },
  { key: "company_name", label: t("name"), sortable: true },
  {
    key: "total_remaining",
    label: `${t("total_owing")} `,
    sortable: true,
  },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `companies?page=${page}&search=${filterData.value.search}&type=owing`
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
