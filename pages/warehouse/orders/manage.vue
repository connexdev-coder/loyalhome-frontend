<template>
  <div class="flex flex-col gap-3 relative h-full pb-56">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="lets-icons:import-fill" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase hidden md:block">
          {{ !query_id ? $t("add_order") : $t("order_invoices") }}
        </h1>
      </div>

      <div class="flex flex-wrap md:flex-row justify-end items-center gap-2">
        <PrintDialog type="order" :extra="`id=${query_id}`" lang="ku" />
        <PrintDialog type="order" :extra="`id=${query_id}`" lang="ar" />

        <button @click="manageInvoice">
          <div class="bg-update text-white button_shape">
            <Icon name="hugeicons:floppy-disk" class="text-xl" />
            <span> {{ $t("save") }}</span>
          </div>
        </button>

        <ManageOrderProduct
          v-if="query_id"
          title="add_product"
          :manage-data="manageProductData"
          type="add"
          :id="0"
          @refresh="fetchCurrentPage"
          :invoice_id="query_id"
        >
          <div
            class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
          >
            <Icon name="hugeicons:add-01" class="text-xl" />
            <span> {{ $t("add_product") }}</span>
          </div>
        </ManageOrderProduct>
      </div>
    </div>

    <!-- Info -->
    <div
      class="grid grid-cols-1 sm:grid-grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 border-2 p-3 rounded-md"
      :class="isUpdate ? 'border-ten' : ''"
    >
      <Input
        v-if="status == 'success' && data.length > 0"
        :value="data[0]"
        :disabled="true"
        value-field="order_invoice_id"
        type="text"
        icon="hugeicons:invoice-01"
        label="invoice_number"
        placeholder="invoice_number"
      />

      <Input
        :value="manageData"
        value-field="ordered_by"
        type="text"
        :icon="CLIENT_ICON"
        label="ordered_by"
        placeholder="ordered_by"
      />

      <ComboBox
        label="factory"
        type="text"
        :icon="FACTORY_ICON"
        placeholder="factory"
        api_route="configs/factories"
        api_route_query="search"
        :result_fields="['factory_name']"
        :selectedValue="selectedFactory"
        @on-change="
          (data:any) => {
            selectedFactory = data;
            manageData.factory_id = data.factory_id;
          }
        "
        @clear="
          () => {
            selectedFactory = null;
            manageData.factory_id = '';
          }
        "
        :disabled="query_id ? true : false"
      />
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success' && data.length > 0"
      :columns="columns"
      :rows="data[0].invoice_products"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="order_invoice_product_id"
      api_route="order_inv"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageOrderProduct
            title="update"
            :manage-data="row"
            type="update"
            :id="row.order_invoice_product_id"
            @refresh="fetchCurrentPage"
            :invoice_id="query_id"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageOrderProduct>
          <Delete
            type="import_product"
            :id="row.order_invoice_product_id"
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

    <!-- Note & Price -->
    <div
      v-if="data && status == 'success' && data.length > 0"
      class="bg-sixty absolute bottom-2 left-0 right-0 p-2 border-2 flex flex-col gap-1"
    >
      <Input
        :value="manageData"
        :disabled="isUpdate"
        value-field="note"
        type="text"
        label="note"
        icon="hugeicons:note-04"
        placeholder="note"
      />

      <div class="flex flex-row gap-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGet } from "~/hooks/fetch";
import { Table } from "@/components/rcp";
import Input from "~/components/rcp/Input.vue";
import { useActionPost, useActionPut } from "~/hooks/actionFetch";
import { useToast } from "~/components/ui/toast";
import OfflineSelect from "~/components/rcp/OfflineSelect.vue";
import ComboBox from "~/components/rcp/ComboBox.vue";
import ManageOrderProduct from "~/components/management/ManageOrderProduct.vue";

const selectedFactory = ref<any>(null);

const { toast } = useToast();

const route = useRoute();
const query = route.query as { id: any };
const query_id = ref(query.id);

const isUpdate = ref(false);

const { t } = useI18n();

const manageData = ref({
  factory_id: "",
  ordered_by: "",
  note: "",
});

const manageProductData = ref({
  product_id: "",
  quantity: "",
  note: "",
});

// Define columns
const columns = [
  { key: "product_name", label: t("product_name"), sortable: true },
  { key: "quantity", label: t("quantity"), sortable: true },
  { key: "unit", label: t("unit"), sortable: true },
  { key: "note", label: t("note"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  let path = `order_inv/invoice/${query_id.value}`;

  const { data: dataData, status: dataStatus }: any = await useGet(path);
  data.value = dataData.value.data;
  status.value = dataStatus.value;
  totalPages.value = dataData.value.total_pages;
  currentPage.value = page;
}

// Fetch initial page
if (query_id.value) {
  await fetchPage(currentPage.value);
  setManageData();
}

async function fetchCurrentPage() {
  await fetchPage(currentPage.value);
  setManageData();
}

function setManageData() {
  if (status.value == "success" && data.value.length > 0) {
    manageData.value.factory_id = data.value[0].factory_id;
    manageData.value.note = data.value[0].note;
  }
}

function validateFields() {
  const missingFields = [].filter((field) => !manageData.value[field]?.length);
  if (!selectedFactory.value) missingFields.push("factory_id");
  return missingFields;
}

async function manageInvoice() {
  const missingFields = validateFields();
  if (missingFields.length > 0) {
    toast({
      title: `Missing fields: ${missingFields.join(", ")}`,
      variant: "destructive",
    });
    return;
  }

  const response = query_id.value
    ? await useActionPut(`order_inv/${query_id.value}`, {
        ...manageData.value,
      })
    : await useActionPost(`order_inv`, {
        ...manageData.value,
      });

  if (response.status == 200) {
    if (!query_id.value) {
      query_id.value = response.data[0].order_invoice_id;
    }

    fetchCurrentPage();
    toast({
      title: t("success"),
      variant: "default",
    });

    if (!query_id.value) {
      useRouter().push(`/warehouse/orders/manage?id=${query_id.value}`);
    }

    isUpdate.value = false;
    return;
  }
  toast({
    title: t("tryagain"),
    variant: "destructive",
  });
}

function checkAndSetDefaults() {
  if (status.value == "success" && data.value.length > 0) {
    manageData.value.ordered_by = data.value[0].ordered_by;
    selectedFactory.value = {
      factory_id: data.value[0].factory_id,
      factory_name: data.value[0].factory_name,
    };
  }
}

checkAndSetDefaults();
</script>
