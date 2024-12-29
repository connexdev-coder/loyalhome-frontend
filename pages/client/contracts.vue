<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="CONTRACT_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("contracts") }}</h1>
      </div>

      <ManageClientContract
        title="add_contract"
        :manage-data="{}"
        type="add"
        :id="0"
        @refresh="fetchCurrentPage"
      >
        <div
          class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
        >
          <Icon name="hugeicons:add-01" class="text-xl" />
          <span> {{ $t("add_contract") }}</span>
        </div>
      </ManageClientContract>
    </div>

    <!-- Filter -->
    <div
      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
    >
      <Input
        v-for="input in inputs"
        :label="input.valueField"
        :value="filterData"
        :value-field="input.valueField"
        :type="input.type"
        :icon="input.icon"
        :placeholder="input.valueField"
        @on-change="fetchCurrentPage"
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
      primary_key="client_contract_id"
      api_route="client_contracts"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageClientContract
            title="update"
            :manage-data="row"
            type="update"
            :id="row.client_contract_id"
            @refresh="fetchCurrentPage"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageClientContract>
          <Delete
            type="client_contracts"
            :id="row.client_contract_id"
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
  client_id: "",
  from: "",
  to: "",
});

const selectedClient = ref(null);

// Define columnsc
const columns = [
  { key: "client_contract_id", label: "ID", sortable: true },
  { key: "client_name", label: t("client_name"), sortable: true },
  { key: "contract_name", label: t("contract_name"), sortable: true },
  { key: "contract_number", label: t("contract_number"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `client_contracts?page=${page}&client_id=${filterData.value.client_id}&search=${filterData.value.search}&from=${filterData.value.from}&to=${filterData.value.to}`
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

const inputs = [
  {
    valueField: "search",
    type: "text",
    icon: SEARCH_ICON,
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
</script>
