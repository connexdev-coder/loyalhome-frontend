<template>
  <div class="relative flex flex-col gap-3 h-full w-full">
    <!-- Title -->
    <div
      class="flex flex-row items-center justify-between bg-mdf text-white px-2 py-1 rounded-md"
    >
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="INVOICE_ICON" class="text-4xl" />
        <h1 class="text-xl uppercase hidden md:block">
          {{ !query_id ? $t("add_mdf_sale") : $t("mdf_sale") }}
        </h1>
      </div>

      <div class="flex flex-wrap md:flex-row justify-end items-center gap-2">
        <button v-if="query_id">
          <div class="bg-inventory text-white button_shape">
            <Icon :name="PRINT_ICON" class="text-xl" />
            <span> {{ $t("print") }}</span>
          </div>
        </button>

        <button @click="manageInvoice">
          <div class="bg-update text-white button_shape">
            <Icon name="hugeicons:floppy-disk" class="text-xl" />
            <span> {{ $t("save") }}</span>
          </div>
        </button>

        <ManageMdfItem
          v-if="query_id"
          title="add_item"
          :manage-data="manageItemData"
          type="add"
          :id="0"
          @refresh="fetchCurrentPage"
          :invoice_id="query_id"
        >
          <div
            class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
          >
            <Icon name="hugeicons:add-01" class="text-xl" />
            <span> {{ $t("add_item") }}</span>
          </div>
        </ManageMdfItem>
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
        value-field="mdf_sale_id"
        type="text"
        icon="hugeicons:invoice-01"
        label="invoice_number"
        placeholder="invoice_number"
      />

      <OfflineSelect
        label="transaction_type"
        placeholder="transaction_type"
        icon="hugeicons:arrow-data-transfer-diagonal"
        :options="['cash', 'owing']"
        :selected-value="manageData"
        field="transaction_type"
        :disabled="query_id ? true : false"
      />

      <ComboBox
        label="client_name"
        type="text"
        :icon="CLIENT_ICON"
        placeholder="client_name"
        api_route="clients"
        api_route_query="search"
        :result_fields="['client_name']"
        :selectedValue="selectedClient"
        @on-change="
          (data:any) => {
            selectedClient = data;
            manageData.client_id = data.client_id;

          }
        "
        @clear="
          () => {
            selectedClient = null;
            manageData.client_id = '';
          }
        "
        :disabled="selectedClient ? true : false"
      />
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success' && data.length > 0"
      :columns="columns"
      :rows="data[0].sale_items"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="mdf_sale_product_id"
      api_route="mdf_sale_product"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-quantity="{ row }">
        <div class="flex flex-row items-center gap-2">
          <span>{{ row.quantity }}</span>
          <span>{{ row.unit_name }}</span>
        </div>
      </template>

      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageMdfItem
            title="update"
            :manage-data="row"
            type="update"
            :id="row.mdf_sale_item_id"
            @refresh="fetchCurrentPage"
            :invoice_id="query_id"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageMdfItem>
          <Delete
            type="mdf_sale_items"
            :id="row.mdf_sale_item_id"
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

    <div class="h-32"></div>

    <!-- Note & Price -->
    <div
      v-if="status == 'success' && data.length > 0"
      class="bg-sixty absolute bottom-2 left-0 right-0 p-2 border-2 flex flex-col gap-1"
    >
      <div class="grid grid-cols-6 items-center gap-1 overflow-x-scroll">
        <Input
          :value="data[0]"
          :disabled="true"
          value-field="total_sell_price"
          type="number"
          :icon="DOLLAR_ICON"
          label="total_sell_price"
          placeholder="total_sell_price"
        />
        <Input
          :value="data[0]"
          :disabled="true"
          value-field="total_sell_price_discount"
          type="number"
          :icon="DOLLAR_ICON"
          label="total_sell_price_discount"
          placeholder="total_sell_price_discount"
        />

        <Input
          :value="data[0]"
          :disabled="true"
          value-field="total_paid"
          type="number"
          :icon="DOLLAR_ICON"
          label="total_paid"
          placeholder="total_paid"
        />

        <Input
          :value="data[0]"
          :disabled="true"
          value-field="total_remaining"
          type="number"
          :icon="DOLLAR_ICON"
          label="total_remaining"
          placeholder="total_remaining"
        />

        <Input
          :value="manageData"
          :disabled="isUpdate"
          value-field="note"
          type="text"
          label="note"
          icon="hugeicons:note-04"
          placeholder="note"
        />
      </div>

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
import ManageMdfItem from "~/components/management/ManageMdfItem.vue";

const selectedClient = ref<any>(null);

const { toast } = useToast();

const route = useRoute();
const query = route.query as { id: any };
const query_id = ref(query.id);

const isUpdate = ref(false);

const { t } = useI18n();

const manageData = ref({
  transaction_type: "",
  sale_status: "",
  client_id: "",
  note: "",
});

const manageItemData = ref({
  item_name: "",
  extra_price: 0,
  quantity: 0,
  discount: 0,
  note: "",
});

// Define columns
const columns = [
  { key: "mdf_sale_item_id", label: t("id"), sortable: true },
  { key: "item_name", label: t("item_name"), sortable: true },
  {
    key: "extra_price",
    label: `${t("extra_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  {
    key: "total_product_price",
    label: `${t("total_product_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  {
    key: "total_sell_price",
    label: `${t("total_sell_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  {
    key: "total_sell_price_discount",
    label: `${t("total_sell_price_discount")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  {
    key: "discount",
    label: `${t("discount")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  { key: "quantity", label: t("quantity"), sortable: true },
  { key: "note", label: t("note"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  let path = `mdf_sales/invoice/${query_id.value}`;

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
    manageData.value.client_id = data.value[0].client_id;
    manageData.value.note = data.value[0].note;
    manageData.value.transaction_type = data.value[0].transaction_type;
    manageData.value.sale_status = data.value[0].sale_status;
  }
}

function validateFields() {
  const missingFields = ["transaction_type"].filter(
    (field) => !manageData.value[field]?.length
  );

  if (!selectedClient.value) missingFields.push("client_id");

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
    ? await useActionPut(`mdf_sales/${query_id.value}`, {
        ...manageData.value,
      })
    : await useActionPost(`mdf_sales`, {
        ...manageData.value,
      });

  if (response.status == 200) {
    if (!query_id.value) {
      query_id.value = response.data[0].mdf_sale_id;
    }

    fetchCurrentPage();
    toast({
      title: t("success"),
      variant: "default",
    });

    if (query_id.value) {
      useRouter().push(`/sales/mdf/manage?id=${query_id.value}`);
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
    selectedClient.value = {
      client_id: data.value[0].client_id,
      client_name: data.value[0].client_name,
    };
  }
}

checkAndSetDefaults();
</script>
