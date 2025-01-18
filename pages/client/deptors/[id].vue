<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="hugeicons:user-group" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("dept_invoices") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-1">
        <PrintDialog type="client_depts" :extra="`id=${params.id}`" lang="ku" />
        <NuxtLink
          v-if="client"
          :to="`/client/payments?client=${client.client_id}`"
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

    <div class="flex flex-col items-start gap-1 text-lg" v-if="client">
      <div class="flex flex-row items-center gap-1">
        <span class="rounded-sm"> {{ $t("client_name") }}:</span>
        <span>{{ client.client_name }}</span>
      </div>

      <div class="flex flex-row items-center gap-1">
        <span class="rounded-sm"> {{ $t("total_owing") }}:</span>
        <span>{{ Number(client.total_remaining) }}{{ MAIN_CURRENCY }}</span>
      </div>
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success' && data && data.length > 0"
      :columns="data[0].clientperson == '' ? mdfColumns : columns"
      :rows="data"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="client_id"
      api_route="clients"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageClientDeptPayment
            title="repay"
            :manage-data="{
              client_id: row.client_id,
              sale_type: row.sale_type,
              sale_id: row.sale_id,
              currency_type: 'dollar',
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
          </ManageClientDeptPayment>

          <NuxtLink
            :to="
              row.sale_type == 'mdf'
                ? `/sales/mdf/manage?id=${row.sale_id}`
                : `/sales/ballon/manage?id=${row.sale_id}`
            "
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
  { key: "clientperson", label: t("person_name"), sortable: true },
  { key: "sale_id", label: t("invoice_number"), sortable: true },
  // { key: "sale_type", label: t("factory"), sortable: true },
  // { key: "total_owing", label: t("total_owing"), sortable: true },
  // { key: "total_paid", label: t("total_paid"), sortable: true },
  { key: "total_remaining", label: t("total_owing"), sortable: true },
  { key: "total_meter", label: t("total_meter"), sortable: true },
  { key: "sale_status", label: t("sale_status"), sortable: true },
  { key: "note", label: t("note"), sortable: true },
  { key: "actions", label: t("actions") },
];
const mdfColumns = [
  { key: "sale_id", label: t("invoice_number"), sortable: true },
  // { key: "sale_type", label: t("factory"), sortable: true },
  // { key: "total_owing", label: t("total_owing"), sortable: true },
  // { key: "total_paid", label: t("total_paid"), sortable: true },
  { key: "total_remaining", label: t("total_owing"), sortable: true },
  { key: "sale_status", label: t("sale_status"), sortable: true },
  { key: "note", label: t("note"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const client = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `client_depts/invoices?page=${page}&type=owing&id=${params.id}`
  );
  data.value = dataData.value.data;
  status.value = dataStatus.value;
  client.value = dataData.value.client[0];
  totalPages.value = dataData.value.total_pages;
  currentPage.value = page;
}

// Fetch initial page
fetchPage(currentPage.value);

function fetchCurrentPage() {
  fetchPage(currentPage.value);
}
</script>
