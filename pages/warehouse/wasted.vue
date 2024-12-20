<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="WASTED_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("wasted_products") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-2">
        <button>
          <div class="bg-inventory text-white button_shape">
            <Icon :name="PRINT_ICON" class="text-xl" />
            <span> {{ $t("print") }}</span>
          </div>
        </button>

        <ManageWastedProduct
          title="add_wasted_product"
          :manage-data="manageData"
          type="add"
          :id="0"
          @refresh="fetchCurrentPage"
        >
          <div
            class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
          >
            <Icon name="hugeicons:add-01" class="text-xl" />
            <span> {{ $t("add_wasted_product") }}</span>
          </div>
        </ManageWastedProduct>
      </div>
    </div>

    <!-- Filter -->
    <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2 gap-2">
      <ComboBox
        label="product_name"
        type="text"
        :icon="PRODUCT_ICON"
        placeholder="product_name"
        api_route="products"
        api_route_query="search"
        :result_fields="['product_name']"
        :selectedValue="selectedProduct"
        @on-change="
          (data) => {
            selectedProduct = data;
            filterData.product_id = data.product_id;
            fetchCurrentPage();
          }
        "
        @clear="
          () => {
            selectedProduct = null;
            filterData.product_id = '';
            fetchCurrentPage();
          }
        "
        :disabled="selectedProduct ? true : false"
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
      primary_key="import_invoice_id"
      api_route="waste_product"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageWastedProduct
            title="update"
            :manage-data="row"
            type="update"
            :id="row.wasted_product_id"
            @refresh="fetchCurrentPage"
          >
            <div
              class="bg-update text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon :name="UPDATE_ICON" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageWastedProduct>
          <Delete
            type="waste_product"
            :id="row.import_invoice_id"
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
import ComboBox from "~/components/rcp/ComboBox.vue";
import ManageWastedProduct from "~/components/management/ManageWastedProduct.vue";

const selectedProduct = ref(null);

const { t } = useI18n();

const filterData = ref<any>({
  product_id: "",
  from: "",
  to: "",
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

const manageData = ref({
  get_price: "",
  quantity: "",
  note: "",
});

// Define columns
const columns = [
  { key: "wasted_product_id", label: t("id"), sortable: true },
  {
    key: "product_name",
    label: t("product_name"),
    sortable: true,
  },
  {
    key: "get_price",
    label: `${t("get_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },

  { key: "quantity", label: t("quantity"), sortable: true },
  { key: "created_at", label: t("created_at"), sortable: true },
  { key: "note", label: t("note"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    product_id: filterData.value.product_id || "",
    from: filterData.value.from || "",
    to: filterData.value.to || "",
  });

  const { data: dataData, status: dataStatus }: any = await useGet(
    `waste_product?${queryParams.toString()}`
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
