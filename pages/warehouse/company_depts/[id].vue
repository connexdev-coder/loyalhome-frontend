<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="COMPANY_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("dept_invoices") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-1">
        <PrintDialog
          type="company_depts"
          :extra="`id=${params.id}`"
          lang="ku"
        />

        <NuxtLink
          v-if="company"
          :to="`/warehouse/payments?company=${company.company_id}`"
        >
          <div
            class="bg-dollar text-white px-2 py-1 rounded-sm flex items-center gap-1"
          >
            <Icon :name="DOLLAR_ICON" class="text-xl" />
            <span> {{ $t("payment_history") }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div class="flex flex-col items-start gap-1 text-lg" v-if="company">
      <div class="flex flex-row items-center gap-1">
        <span class="rounded-sm"> {{ $t("company_name") }}:</span>
        <span>{{ company.company_name }}</span>
      </div>

      <div class="flex flex-row items-center gap-1">
        <span class="rounded-sm"> {{ $t("total_owing") }}:</span>
        <span>{{ Number(company.total_remaining) }}{{ MAIN_CURRENCY }}</span>
      </div>
    </div>

    <!-- Data -->
    <Table
      v-if="data"
      :columns="columns"
      :rows="data"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="company_id"
      api_route="companies"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageCompanyDeptPayment
            title="repay"
            :manage-data="{
              company_id: row.company_id,
              currency_type: 'dollar',
              import_invoice_id: row.import_invoice_id,
              // dollar_to_dinar
              // amount
              // note
            }"
            :max="row.total_remaining"
            type="add"
            :id="0"
            @refresh="fetchCurrentPage"
          >
            <div
              class="bg-client text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon :name="REPAYMENT_ICON" class="text-xl" />
              <span> {{ $t("repay") }}</span>
            </div>
          </ManageCompanyDeptPayment>

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
import { Table, Input } from "@/components/rcp";

const route = useRoute();
const params = route.params as { id: any };

const { t } = useI18n();

// Define columns
const columns = [
  { key: "import_invoice_id", label: t("invoice_number"), sortable: true },
  { key: "total_owing", label: t("total_owing"), sortable: true },
  { key: "total_paid", label: t("total_paid"), sortable: true },
  { key: "total_remaining", label: t("total_remaining"), sortable: true },
  { key: "note", label: t("note"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const company = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `company_depts/invoices?page=${page}&type=owing&id=${params.id}`
  );
  data.value = dataData.value.data;
  status.value = dataStatus.value;
  company.value = dataData.value.company[0];
  totalPages.value = dataData.value.total_pages;
  currentPage.value = page;
}

// Fetch initial page
fetchPage(currentPage.value);

function fetchCurrentPage() {
  fetchPage(currentPage.value);
}
</script>
