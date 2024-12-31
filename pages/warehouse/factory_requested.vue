<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center gap-1 justify-between">
      <div class="flex flex-row items-center gap-1">
        <Icon :name="PENDING_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("factory_requested") }}</h1>
      </div>
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success'"
      :columns="columns"
      :rows="data"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="product_id"
      api_route="products"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <NuxtLink
            :to="
              row.factory_name == 'ballon'
                ? `/sales/ballon/manage?id=${row.invoice_number}`
                : `/sales/mdf/manage?id=${row.invoice_number}`
            "
          >
            <div class="bg-update text-white button_shape">
              <Icon :name="EYE_ICON" class="text-xl" />
              <span> {{ $t("see_invoice") }}</span>
            </div>
          </NuxtLink>

          <Approve
            :type="row.factory_name == 'ballon' ? 'ballon_sales' : 'mdf_sales'"
            :id="row.invoice_number"
            :body="{ sale_status: 'working' }"
            @refresh="fetchPage()"
          >
            <div
              class="bg-yellow-500 text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon :name="APPROVE_ICON" class="text-xl" />
              <span> {{ $t("give") }}</span>
            </div>
          </Approve>
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

// Define columns
const columns = [
  { key: "invoice_number", label: t("invoice_number"), sortable: true },
  { key: "factory_name", label: t("factory_name"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage() {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `products/requested`
  );
  data.value = dataData.value.data;
  status.value = dataStatus.value;
}
fetchPage();
</script>
