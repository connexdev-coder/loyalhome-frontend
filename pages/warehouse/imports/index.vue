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
    <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2">
      <Input
        v-for="filter in filters"
        :label="filter.valueField"
        :value="filterData"
        :value-field="filter.valueField"
        :type="filter.type"
        :icon="filter.icon"
        :placeholder="filter.valueField"
        @on-change="filter.onChange"
      />

      <ComboBox
        label="company_name"
        type="text"
        :icon="COMPANY_ICON"
        placeholder="company_name"
        api_route="companies"
        api_route_query="search"
        :result_fields="['company_name']"
        :selectedValue="selectedCompany"
        @on-change="
          (data:any) => {
            selectedCompany = data;
            filterData.company_id = data.company_id;
            fetchCurrentPage();
          }
        "
        @clear="
          () => {
            selectedCompany = null;
            filterData.company_id = '';
            fetchCurrentPage();
          }
        "
        :disabled="selectedCompany ? true : false"
      />
      <ComboBox
        label="factory_name"
        type="text"
        :icon="FACTORY_ICON"
        placeholder="factory_name"
        api_route="configs/factories"
        api_route_query="search"
        :result_fields="['factory_name']"
        :selectedValue="selectedFactory"
        @on-change="
          (data:any) => {
            selectedFactory = data;
            filterData.factory_id = data.factory_id;
            fetchCurrentPage();
          }
        "
        @clear="
          () => {
            selectedFactory = null;
            filterData.factory_id = '';
            fetchCurrentPage();
          }
        "
        :disabled="selectedFactory ? true : false"
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
              <Icon :name="EYE_ICON" class="text-xl" />
              <span> {{ $t("see_invoice") }}</span>
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
import ComboBox from "~/components/rcp/ComboBox.vue";

const selectedCompany = ref(null);
const selectedFactory = ref(null);

const { t } = useI18n();

const filterData = ref({
  search: "",
  from: "",
  to: "",
  transaction_type: "",
  company_id: "",
  factory_id: "",
});

const filters = [
  {
    valueField: "search",
    type: "text",
    icon: SEARCH_ICON,
    onChange: () => {
      filterData.value.search == "" ? null : fetchCurrentPage();
    },
  },
  {
    valueField: "from",
    type: "date",
    icon: DATE_ICON,
    onChange: () => {
      filterData.value.to == "" ? null : fetchCurrentPage();
    },
  },
  {
    valueField: "to",
    type: "date",
    icon: DATE_ICON,
    onChange: () => {
      filterData.value.from == "" ? null : fetchCurrentPage();
    },
  },
];

// Define columns
const columns = [
  { key: "import_invoice_id", label: t("invoice_number"), sortable: true },
  { key: "invoice_number", label: t("manual_invoice_number"), sortable: true },
  { key: "transaction_type", label: t("transaction_type"), sortable: true },
  {
    key: "total_get_price",
    label: `${t("total_get_price")} `,
    sortable: true,
  },
  {
    key: "extra_price",
    label: `${t("extra_price")} `,
    sortable: true,
  },

  { key: "company_name", label: t("company_name"), sortable: true },
  { key: "factory_name", label: t("factory_name"), sortable: true },
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
  const queryParams = new URLSearchParams({
    page: page.toString(),
    search: filterData.value.search || "",
    from: filterData.value.from || "",
    to: filterData.value.to || "",
    transaction_type: filterData.value.transaction_type || "",
    company_id: filterData.value.company_id || "",
    factory_id: filterData.value.factory_id || "",
  });

  const { data: dataData, status: dataStatus }: any = await useGet(
    `import_inv?${queryParams.toString()}`
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
