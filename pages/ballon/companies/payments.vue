<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="HISTORY_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("payment_history") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-1">
        <PrintDialog type="company_payments" extra="" />
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
        label="company_name"
        type="text"
        :icon="USER_ICON"
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
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success'"
      :columns="columns"
      :rows="data"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="company_dept_payment_id"
      api_route="company_depts"
    >
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <PrintDialog
            type="company_payments"
            :extra="`payment_id=${row.company_dept_payment_id}`"
          />

          <Delete
            type="company_depts"
            :id="row.company_dept_payment_id"
            @refresh="fetchPage(currentPage)"
          >
            <div
              class="bg-destructive text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon name="hugeicons:delete-02" class="text-xl" />
              <span> {{ $t("delete") }}</span>
            </div>
          </Delete>

          <NuxtLink
            :to="`/warehouse/imports/manage?id=${row.import_invoice_id}`"
          >
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

const selectedCompany = ref(null);

const filterData = ref({
  invoice_number: "",
  company_id: useRoute().query.company ?? "",
  from: "",
  to: "",
});

const filters = [
  {
    valueField: "invoice_number",
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
  { key: "import_invoice_id", label: t("invoice_number"), sortable: true },
  { key: "company_name", label: t("company_name"), sortable: true },
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
    `company_depts/payments?page=${page}&company=${filterData.value.company_id}&id=${filterData.value.invoice_number}&from=${filterData.value.from}&to=${filterData.value.to}`
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
