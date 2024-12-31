<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="HISTORY_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("payment_history") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-1"></div>
    </div>

    <!-- Filter -->
    <div
      class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 items-center gap-2"
    >
      <OfflineSelect
        label="sale_type"
        placeholder="sale_type"
        :icon="TRANSACTION_ICON"
        :options="['', 'mdf', 'ballon']"
        :selected-value="filterData"
        field="sale_type"
        @on-change="fetchCurrentPage"
      />

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
        :icon="USER_ICON"
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
      primary_key="client_dept_payment_id"
      api_route="client_depts"
    >
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <PrintDialog
            type="payment_check"
            :extra="`id=${row.client_dept_payment_id}&client_id=${row.client_id}`"
            lang="ku"
          />
          <PrintDialog
            type="payment_check"
            :extra="`id=${row.client_dept_payment_id}&client_id=${row.client_id}`"
            lang="ku"
          />

          <Delete
            type="client_depts"
            :id="row.client_dept_payment_id"
            @refresh="fetchPage(currentPage)"
          >
            <div
              class="bg-destructive text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon name="hugeicons:delete-02" class="text-xl" />
              <span> {{ $t("delete") }}</span>
            </div>
          </Delete>

          <NuxtLink :to="`/sales/${row.sale_type}/manage?id=${row.sale_id}`">
            <div
              class="bg-inventory text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon :name="INFO_ICON" class="text-xl" />
              <span> {{ $t("see_invoice") }}</span>
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

const { t } = useI18n();

const selectedClient = ref(null);

const filterData = ref({
  sale_type: "",
  sale_id: "",
  client_id: useRoute().query.client ?? "",
  from: "",
  to: "",
});

const filters = [
  {
    valueField: "sale_id",
    type: "number",
    icon: INVOICE_ICON,
    onChange: () => {
      fetchCurrentPage();
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
  { key: "client_dept_payment_id", label: "ID", sortable: true },
  { key: "sale_id", label: t("invoice_number"), sortable: true },
  { key: "client_name", label: t("client_name"), sortable: true },
  { key: "sale_type", label: t("factory"), sortable: true },
  { key: "currency_type", label: t("paid_money_type"), sortable: true },
  {
    key: "dollar_amount",
    label: `${t("amount")} (${t("dollar")})`,
    sortable: true,
  },
  {
    key: "dinar_amount",
    label: `${t("amount")} (${t("dinar")})`,
    sortable: true,
  },
  {
    key: "dinar_price",
    label: "$ > IQD",
    sortable: true,
  },
  { key: "created_at", label: t("created_at"), sortable: true },
  { key: "note", label: t("note"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `client_depts/payments?page=${page}&client_id=${filterData.value.client_id}&sale_type=${filterData.value.sale_type}&id=${filterData.value.sale_id}&from=${filterData.value.from}&to=${filterData.value.to}`
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
