<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center gap-1 justify-between">
      <div class="flex flex-row items-center">
        <Icon name="hugeicons:dashboard-square-01" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("jard") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-2">
        <PrintDialog
          type="jard"
          :extra="`search=${filterData.search}`"
          lang="ku"
        />
        <PrintDialog
          type="jard"
          :extra="`search=${filterData.search}`"
          lang="ar"
        />
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
      primary_key="product_id"
      api_route="products"
    >
      <!-- Custom slot for 'actions' column -->
      <template
        v-for="key in [
          'imported_quantity',
          'wasted_quantity',
          'inventory_quantity',
        ]"
        :key="key"
        v-slot:[`cell-${key}`]="{ row }"
      >
        <div class="flex flex-row items-center gap-2">
          <span>{{ row.unit_name }}</span>
          <span>{{ row[key] }}</span>
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGet } from "~/hooks/fetch";
import { Table, Input } from "@/components/rcp";

const { t } = useI18n();

const filterData = ref({
  search: "",
});

// Define columns
const columns = [
  { key: "product_id", label: "ID", sortable: true },
  { key: "name", label: t("name"), sortable: true },
  { key: "tag", label: t("tag"), sortable: true },
  { key: "unit_name", label: t("unit_name"), sortable: true },
  { key: "imported_quantity", label: t("imported_quantity"), sortable: true },
  { key: "wasted_quantity", label: t("wasted_quantity"), sortable: true },
  { key: "ballon_quantity", label: t("ballon_quantity"), sortable: true },
  { key: "mdf_quantity", label: t("mdf_quantity"), sortable: true },
  { key: "inventory_quantity", label: t("inventory_quantity"), sortable: true },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `products?page=${page}&search=${filterData.value.search}`
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
