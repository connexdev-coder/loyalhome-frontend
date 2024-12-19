<template>
  <div class="flex flex-col gap-3 relative h-full pb-20">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="lets-icons:import-fill" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">
          {{ !query_id ? $t("add_import") : $t("import_invoice") }}
        </h1>
      </div>

      <button @click="manageInvoice">
        <div class="bg-update text-white button_shape">
          <Icon name="hugeicons:floppy-disk" class="text-xl" />
          <span> {{ $t("save") }}</span>
        </div>
      </button>
    </div>

    <!-- Info -->
    <div
      class="grid grid-cols-1 sm:grid-grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 border-2 p-3 rounded-md"
    >
      <Input
        v-if="status == 'success' && data.length > 0"
        :value="data[0]"
        :disabled="true"
        value-field="import_invoice_id"
        type="text"
        icon="hugeicons:invoice-01"
        label="invoice_number"
        placeholder="invoice_number"
      />

      <Input
        :value="manageData"
        :disabled="isUpdate"
        value-field="invoice_number"
        type="text"
        icon="hugeicons:file-import"
        label="manual_invoice_number"
        placeholder="manual_invoice_number"
      />

      <OfflineSelect
        label="transaction_type"
        placeholder="transaction_type"
        icon="hugeicons:arrow-data-transfer-diagonal"
        :options="['cash', 'owing']"
        :selected-value="manageData"
        field="transaction_type"
      />

      <ComboBox
        label="factory"
        type="text"
        icon="hugeicons:factory-02"
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
        :disabled="selectedFactory ? true : false"
      />

      <ComboBox
        label="company_name"
        type="text"
        icon="hugeicons:factory-02"
        placeholder="company_name"
        api_route="companies"
        api_route_query="search"
        :result_fields="['company_name']"
        :selectedValue="selectedCompany"
        @on-change="
          (data:any) => {
            selectedCompany = data;
            manageData.company_id = data.company_id;
          }
        "
        @clear="
          () => {
            selectedCompany = null;
            manageData.company_id = '';
          }
        "
        :disabled="selectedCompany ? true : false"
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
      primary_key="import_invoice_id"
      api_route="import_inv"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageImportInvoiceProduct
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
          </ManageImportInvoiceProduct>
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

    <!-- Note & Price -->
    <div
      v-if="status == 'success' && data.length > 0"
      class="absolute bottom-0 left-0 right-0 p-2 flex flex-row items-center gap-2 border-t-2"
    >
      <Input
        :value="manageData"
        :disabled="isUpdate"
        value-field="note"
        type="text"
        icon="hugeicons:note-04"
        label="note"
        placeholder="note"
      />

      <Input
        :value="manageData"
        :disabled="isUpdate"
        value-field="extra_price"
        type="text"
        icon="hugeicons:note-04"
        label="extra_price"
        placeholder="extra_price"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGet } from "~/hooks/fetch";
import { Table } from "@/components/rcp";
import ManageImportInvoiceProduct from "~/components/ManageImportInvoiceProduct.vue";
import Input from "~/components/rcp/Input.vue";
import { useActionPost, useActionPut } from "~/hooks/actionFetch";
import { useToast } from "~/components/ui/toast";
import OfflineSelect from "~/components/rcp/OfflineSelect.vue";
import ComboBox from "~/components/rcp/ComboBox.vue";

const selectedFactory = ref<any>(null);
const selectedCompany = ref<any>(null);

const { toast } = useToast();

const isUpdate = ref(false);

const route = useRoute();
const query = route.query as { id: any };
const query_id = ref(query.id);

const { t } = useI18n();

const manageData = ref({
  invoice_number: "",
  transaction_type: "",
  company_id: "",
  factory_id: "",
  extra_price: "0",
  note: "",
});

// Define columns
const columns = [
  { key: "product_name", label: t("product_name"), sortable: true },
  { key: "quantity", label: t("quantity"), sortable: true },
  {
    key: "get_price",
    label: `${t("get_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  {
    key: "total_get_price",
    label: `${t("total_get_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  { key: "unit", label: t("unit"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  let path = `import_inv/invoice/${query_id.value}`;

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
    manageData.value.company_id = data.value[0].company_id;
    manageData.value.factory_id = data.value[0].factory_id;
    manageData.value.extra_price = data.value[0].extra_price;
    manageData.value.invoice_number = data.value[0].invoice_number;
    manageData.value.note = data.value[0].note;
    manageData.value.transaction_type = data.value[0].transaction_type;
  }
}

function validateFields() {
  const missingFields = ["invoice_number", "transaction_type"].filter(
    (field) => !manageData.value[field]?.length
  );

  if (!selectedCompany.value) missingFields.push("company_id");
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
    ? await useActionPut(`import_inv/${query_id.value}`, {
        ...manageData.value,
      })
    : await useActionPost(`import_inv`, {
        ...manageData.value,
      });

  if (response.status == 200) {
    if (!query_id.value) {
      query_id.value = response.data[0].import_invoice_id;
    }

    fetchCurrentPage();
    toast({
      title: t("success"),
      variant: "default",
    });

    useRouter().push(`/warehouse/imports/manage?id=${query_id.value}`);

    return;
  }
  toast({
    title: t("tryagain"),
    variant: "destructive",
  });
}

function checkAndSetUnit() {
  if (status.value == "success" && data.value.length > 0) {
    selectedFactory.value = {
      factory_id: data.value[0].factory_id,
      factory_name: data.value[0].factory_name,
    };
  }
  if (status.value == "success" && data.value.length > 0) {
    selectedCompany.value = {
      company_id: data.value[0].company_id,
      company_name: data.value[0].company_name,
    };
  }
}

checkAndSetUnit();
</script>
