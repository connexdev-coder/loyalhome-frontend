<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="SPENDING_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("spendings") }}</h1>
      </div>

      <ManageSpending
        title="add_spending"
        :manage-data="{
          currency_type: 'dollar',
        }"
        type="add"
        :id="0"
        @refresh="fetchCurrentPage"
      >
        <div
          class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
        >
          <Icon name="hugeicons:add-01" class="text-xl" />
          <span> {{ $t("add_spending") }}</span>
        </div>
      </ManageSpending>
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
        label="spending_type"
        placeholder="spending_type"
        icon="hugeicons:arrow-data-transfer-diagonal"
        :options="['', 'bnchina', 'kar']"
        :selected-value="filterData"
        field="spending_type"
        @on-change="fetchCurrentPage"
      />

      <AutoComplete
        label="spend_to"
        type="text"
        :icon="SPENDING_ICON"
        placeholder="spend_to"
        api_route="configs/spending?type=spend_to&"
        api_route_query="search"
        :result_fields="['spend_to']"
        :selectedValue="filterData"
        @on-change="
          (data:any) => {
            filterData.spend_to = data.spend_to;
            fetchCurrentPage();
          }
        "
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
      primary_key="spending_id"
      api_route="spendings"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageSpending
            title="update"
            :manage-data="row"
            type="update"
            :id="row.spending_id"
            @refresh="fetchCurrentPage"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageSpending>
          <Delete
            type="spendings"
            :id="row.spending_id"
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
  spend_to: "",
  spending_type: "",
  from: "",
  to: "",
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
  { key: "spending_id", label: "ID", sortable: true },
  { key: "spend_to", label: t("spend_to"), sortable: true },
  { key: "spend_by", label: t("spend_by"), sortable: true },
  { key: "spending_type", label: t("spending_type"), sortable: true },
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
    `spendings?page=${page}&search=${filterData.value.search}&spending_type=${filterData.value.spending_type}&spend_to=${filterData.value.spend_to}&from=${filterData.value.from}&to=${filterData.value.to}`
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
