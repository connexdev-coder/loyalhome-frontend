<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="hugeicons:dashboard-square-01" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("ballon_products") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-1">
        <ManageProduct
          v-for="factory in factoryData"
          title="add_product"
          :manage-data="{ factory_id: factory.factory_id, ...manageData }"
          type="add"
          :id="0"
          @refresh="fetchCurrentPage"
        >
          <div
            v-if="factory.factory_name == 'ballon'"
            class="text-white px-2 py-1 rounded-sm flex items-center gap-1"
            :class="
              factory.factory_name == 'ballon' ? 'bg-ballon' : 'bg-ballon'
            "
          >
            <Icon name="hugeicons:add-01" class="text-xl" />
            <span> {{ $t("add_product") }} {{ $t(factory.factory_name) }}</span>
          </div>
        </ManageProduct>
      </div>
    </div>

    <!-- Filter -->
    <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2">
      <Input
        :value="filterData"
        value-field="search"
        type="text"
        icon="hugeicons:search-01"
        placeholder="search"
        @on-change="fetchCurrentPage"
        @refresh="fetchCurrentPage"
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
      primary_key="product_id"
      api_route="products"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageProduct
            title="update"
            :manage-data="row"
            type="update"
            :id="row.product_id"
            @refresh="fetchCurrentPage"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageProduct>
          <Delete
            type="products"
            :id="row.product_id"
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
import ManageProduct from "~/components/management/ManageProduct.vue";

const { t } = useI18n();

const filterData = ref({
  search: "",
  factory_name: "",
});

const manageData = ref({
  name: "",
  tag: "",
  get_price: "",
  sell_price: "",
  unit_id: "",
});

// Define columns
const columns = [
  { key: "product_id", label: "ID", sortable: true },
  { key: "name", label: t("name"), sortable: true },
  { key: "tag", label: t("tag"), sortable: true },
  {
    key: "get_price",
    label: `${t("get_price")} `,
    sortable: true,
  },
  {
    key: "sell_price",
    label: `${t("sell_price")} `,
    sortable: true,
  },
  { key: "unit_name", label: t("unit_name"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `products?page=${page}&search=${filterData.value.search}&factory=ballon`
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
