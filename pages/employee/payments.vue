<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="HISTORY_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("payment_history") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-2" v-if="data">
        <PrintDialog type="employee_payments" extra="" />
        <ManageEmployeePayment
          title="payment"
          :manage-data="{
            currency_type: 'dollar',
          }"
          type="add"
          :id="0"
          @refresh="fetchCurrentPage"
        >
          <div
            class="bg-employee text-white px-2 py-1 rounded-sm flex items-center gap-0"
          >
            <Icon :name="DOLLAR_ICON" class="text-xl" />
            <span> {{ $t("pay") }}</span>
          </div>
        </ManageEmployeePayment>
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

      <ComboBox
        label="employee_name"
        type="text"
        :icon="USER_ICON"
        placeholder="employee_name"
        api_route="employees"
        api_route_query="search"
        :result_fields="['employee_name']"
        :selectedValue="selectedemployee"
        @on-change="
            (data:any) => {
              selectedemployee = data;
              filterData.employee_id = data.employee_id;
              fetchCurrentPage();
            }
        "
        @clear="
          () => {
            selectedemployee = null;
            filterData.employee_id = '';
            fetchCurrentPage();
          }
        "
        :disabled="selectedemployee ? true : false"
      />
    </div>

    <div v-if="data" class="text-xl">
      <span>{{ $t("total_paid") }}: {{ Number(total).toLocaleString() }}</span>
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success'"
      :columns="columns"
      :rows="data"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="employee_salary_payment_id"
      api_route="employee_payments"
    >
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <PrintDialog
            type="employee_payments"
            :extra="`id=${row.employee_salary_payment_id}`"
          />
          <ManageEmployeePayment
            title="payment"
            :manage-data="row"
            type="update"
            :id="row.employee_salary_payment_id"
            @refresh="fetchCurrentPage"
          >
            <div
              class="bg-dollar text-white px-2 py-1 rounded-sm flex items-center gap-0"
            >
              <Icon :name="UPDATE_ICON" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageEmployeePayment>
          <Delete
            type="employee_payments"
            :id="row.employee_salary_payment_id"
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

const { t } = useI18n();

const selectedemployee = ref(null);

const filterData = ref({
  search: "",
  employee_id: useRoute().query.employee ?? "",
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
  {
    key: "employee_salary_payment_id",
    label: t("invoice_number"),
    sortable: true,
  },
  { key: "employee_name", label: t("employee_name"), sortable: true },
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
  {
    key: "working_date",
    label: t("working_date"),
    sortable: true,
  },
  {
    key: "punish_amount",
    label: t("punish_amount"),
    sortable: true,
  },
  {
    key: "tip_amount",
    label: t("tip_amount"),
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
const total = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `employee_payments?page=${page}&employee_id=${filterData.value.employee_id}&from=${filterData.value.from}&to=${filterData.value.to}&search=${filterData.value.search}`
  );

  data.value = dataData.value.data;
  status.value = dataStatus.value;
  totalPages.value = dataData.value.total_pages;
  total.value = dataData.value.total;
  currentPage.value = page;
}

// Fetch initial page
fetchPage(currentPage.value);

function fetchCurrentPage() {
  fetchPage(currentPage.value);
}
</script>
