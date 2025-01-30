<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="hugeicons:user-group" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("box_transactions") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-2">
        <PrintDialog
          type="box_trx"
          :extra="`from=${filterData.from}&to=${filterData.to}`"
          lang="ku"
        />

        <ManageBoxTransaction
          v-for="factory in factoryData"
          title="add_transaction"
          :manage-data="{
            currency_type: 'dollar',
            factory_id: factory.factory_id,
          }"
          type="add"
          :id="0"
          @refresh="fetchCurrentPage"
        >
          <div
            v-if="factory.factory_name == 'ballon'"
            class="text-white px-2 py-1 rounded-sm flex items-center gap-1"
            :class="factory.factory_name == 'ballon' ? 'bg-ballon' : 'bg-mdf'"
          >
            <Icon name="hugeicons:add-01" class="text-xl" />
            <span>
              {{ $t("add_transaction") }} {{ $t(factory.factory_name) }}</span
            >
          </div>
        </ManageBoxTransaction>
      </div>
    </div>

    <!-- Filter -->
    <div
      class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 items-center gap-2"
    >
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

      <OfflineSelect
        label="transaction_type"
        placeholder="transaction_type"
        icon="hugeicons:arrow-data-transfer-diagonal"
        :options="['', 'deposit', 'withdraw']"
        :selected-value="filterData"
        field="transaction_type"
        @on-change="fetchCurrentPage"
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
      primary_key="box_transaction_id"
      api_route="box_trx"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageBoxTransaction
            title="update"
            :manage-data="row"
            type="update"
            :id="row.box_transaction_id"
            @refresh="fetchCurrentPage"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageBoxTransaction>
          <Delete
            type="box_trx"
            :id="row.box_transaction_id"
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
  transaction_type: "",
  from: "",
  to: "",
  factory_name: "",
});

const filters = [
  {
    valueField: "search",
    type: "text",
    icon: SEARCH_ICON,
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
  { key: "box_transaction_id", label: "ID", sortable: true },
  { key: "paid_to", label: t("paid_to"), sortable: true },
  { key: "paid_by", label: t("paid_by"), sortable: true },
  { key: "transaction_type", label: t("transaction_type"), sortable: true },
  { key: "currency_type", label: t("paid_money_type"), sortable: true },
  { key: "factory_name", label: t("factory_name"), sortable: true },
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
    `box_trx?page=${page}&search=${filterData.value.search}&transaction_type=${filterData.value.transaction_type}&from=${filterData.value.from}&to=${filterData.value.to}&factory=ballon`
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

const factoryData = ref<any>(null);
const factoryStatus = ref<any>(null);
async function fetchFactories() {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `configs/factories`
  );
  factoryData.value = dataData.value.data;
  factoryStatus.value = dataStatus.value;
}
fetchFactories();
</script>
