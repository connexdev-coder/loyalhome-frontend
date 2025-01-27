<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="hugeicons:user-group" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("mdf_deptors") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-1">
        <PrintDialog type="client_deptors" extra="" lang="ku" />
      </div>
    </div>

    <!-- Filter -->
    <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
      <ComboBox
        label="client_name"
        type="text"
        :icon="PRICE_ICON"
        placeholder="client_name"
        api_route="clients"
        api_route_query="search"
        :result_fields="['client_name']"
        :selectedValue="selectedClient"
        @on-change="
            (data:any) => {
              selectedClient = data;
              filterData.client_id = data.client_id;
              fetchCurrentPage();
            }
        "
        @clear="
          () => {
            selectedClient = null;
            filterData.client_id = '';
            fetchCurrentPage();
          }
        "
        :disabled="selectedClient ? true : false"
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
      primary_key="client_id"
      api_route="clients"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <NuxtLink :to="`/client/deptors/${row.client_id}`">
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

const selectedClient = ref(null);
const filterData = ref({
  client_id: "",
});

// Define columns
const columns = [
  { key: "client_id", label: "ID", sortable: true },
  { key: "client_name", label: t("name"), sortable: true },
  { key: "phone", label: t("phone"), sortable: true },
  {
    key: "mdf_total_remaining",
    label: t("total_owing"),
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
    `clients?page=${page}&id=${filterData.value.client_id}&type=owing&factory=mdf`
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
