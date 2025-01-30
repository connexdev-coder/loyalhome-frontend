<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div
      class="flex flex-row items-center justify-between bg-ballon text-white px-2 py-1 rounded-md"
    >
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="BALLON_ICON" class="text-4xl" />
        <h1 class="text-xl uppercase">{{ $t("ballon_sale") }}</h1>
      </div>

      <NuxtLink to="/ballon/sales/manage">
        <div
          class="bg-white text-ballon px-2 py-1 rounded-sm flex items-center gap-1"
        >
          <Icon name="hugeicons:add-01" class="text-xl" />
          <span> {{ $t("add_ballon_sale") }}</span>
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
        label="client_name"
        type="text"
        :icon="CLIENT_ICON"
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
      primary_key="ballon_sale_id"
      api_route="ballon_sales"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <NuxtLink :to="`/ballon/sales/manage?id=${row.ballon_sale_id}`">
            <div class="bg-update text-white button_shape">
              <Icon :name="EYE_ICON" class="text-xl" />
              <span> {{ $t("see_invoice") }}</span>
            </div>
          </NuxtLink>
          <Delete
            type="ballon_sales"
            :id="row.ballon_sale_id"
            @refresh="fetchPage(currentPage)"
          >
            <div
              class="bg-destructive text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon name="hugeicons:delete-02" class="text-xl" />
              <span> {{ $t("delete") }}</span>
            </div>
          </Delete>

          <select
            class="px-2 py-1 bg-transparent"
            v-model="row.sale_status"
            name="sale_status"
            id=""
            @change="
              async (e: any) => {
                await useActionPut(`ballon_sales/${row.ballon_sale_id}`, {
                  sale_status: e.target.value,
                });
              }
            "
          >
            <option value="pending">{{ $t("pending") }}</option>
            <option value="working">{{ $t("working") }}</option>
            <option value="finished">{{ $t("finished") }}</option>
          </select>
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
import { useActionPut } from "~/hooks/actionFetch";

const selectedClient = ref(null);

const { t } = useI18n();

const filterData = ref({
  search: "",
  from: "",
  to: "",
  transaction_type: "",
  client_id: "",
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
  { key: "ballon_sale_id", label: t("invoice_number"), sortable: true },
  { key: "client_name", label: t("client_name"), sortable: true },
  { key: "person_name", label: t("person_name"), sortable: true },
  { key: "transaction_type", label: t("transaction_type"), sortable: true },

  {
    key: "total_price",
    label: `${t("total_price")}`,
    sortable: true,
  },
  {
    key: "total_meter",
    label: `${t("total_meter")}`,
    sortable: true,
  },

  { key: "created_at", label: t("created_at"), sortable: true },
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
    client_id: filterData.value.client_id || "",
  });

  const { data: dataData, status: dataStatus }: any = await useGet(
    `ballon_sales?${queryParams.toString()}`
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
