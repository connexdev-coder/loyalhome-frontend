<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="lets-icons:import-fill" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("imports") }}</h1>
      </div>

      <NuxtLink to="/warehouse/imports/manage">
        <div
          class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
        >
          <Icon name="hugeicons:add-01" class="text-xl" />
          <span> {{ $t("add_import") }}</span>
        </div>
      </NuxtLink>
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
      primary_key="import_invoice_id"
      api_route="import_inv"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <NuxtLink
            :to="`/warehouse/imports/manage?id=${row.import_invoice_id}`"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </NuxtLink>
          <Delete
            type="import_inv"
            :id="row.import_invoice_id"
            @refresh="fetchPage(currentPage)"
          >
            <div
              class="bg-destructive text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon name="hugeicons:delete-02" class="text-xl" />
              <span> {{ $t("delete") }}</span>
            </div>
          </Delete>
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
  { key: "import_invoice_id", label: t("invoice_number"), sortable: true },
  { key: "invoice_number", label: t("manual_invoice_number"), sortable: true },
  { key: "transaction_type", label: t("transaction_type"), sortable: true },
  {
    key: "total_get_price",
    label: `${t("total_get_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  {
    key: "extra_price",
    label: `${t("extra_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },

  { key: "company_name", label: t("company_name"), sortable: true },
  { key: "created_at", label: t("created_at"), sortable: true },
  { key: "updated_at", label: t("updated_at"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `import_inv?page=${page}&search=${filterData.value.search}`
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
