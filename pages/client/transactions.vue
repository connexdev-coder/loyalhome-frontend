<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="hugeicons:user-group" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("client_transactions") }}</h1>
      </div>

      <ManageClientTransaction
        title="add_transaction"
        :manage-data="manageData"
        type="add"
        :id="0"
        @refresh="fetchCurrentPage"
      >
        <div
          class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
        >
          <Icon name="hugeicons:add-01" class="text-xl" />
          <span> {{ $t("add_transaction") }}</span>
        </div>
      </ManageClientTransaction>
    </div>

    <!-- Filter -->
    <div
      class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 items-center gap-2"
    >
      <OfflineSelect
        label="transaction_type"
        placeholder="transaction_type"
        icon="hugeicons:arrow-data-transfer-diagonal"
        :options="['deposit', 'withdraw']"
        :selected-value="filterData"
        field="transaction_type"
        @on-change="fetchCurrentPage"
      />

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
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success'"
      :columns="columns"
      :rows="data"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="client_transaction_id"
      api_route="client_trx"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageClientTransaction
            title="update"
            :manage-data="row"
            type="update"
            :id="row.client_transaction_id"
            @refresh="fetchCurrentPage"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageClientTransaction>
          <Delete
            type="client_trx"
            :id="row.client_transaction_id"
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

const selectedClient = ref(null);

const filterData = ref({
  search: "",
  client_id: "",
  transaction_type: "",
  from: "",
  to: "",
});

const manageData = ref({
  transaction_type: "",
  currency_type: "",
  amount: "",
  dollar_to_dinar_id: "",
  note: "",
});

const filters = [
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
  { key: "client_transaction_id", label: "ID", sortable: true },
  { key: "client_name", label: t("client_name"), sortable: true },
  { key: "transaction_type", label: t("transaction_type"), sortable: true },
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
    `client_trx?page=${page}&client_id=${filterData.value.client_id}&transaction_type=${filterData.value.transaction_type}&from=${filterData.value.from}&to=${filterData.value.to}`
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
