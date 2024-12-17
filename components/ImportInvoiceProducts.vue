<template>
  <div v-if="status == 'success'" class="flex flex-col items-start gap-2 py-2">
    <div class="flex flex-row items-center gap-1">
      <ManageImportInvoiceProduct
        :manage-data="manageData"
        type="add"
        :id="0"
        @refresh="onRefresh"
      >
        {{ $t("add_product") }}
      </ManageImportInvoiceProduct>
      <PrintDialog type="import_invoice" :extra="`id=${props.id}`" />
    </div>

    <DeleteAll
      v-show="checkedDatas.length > 0"
      path="import_invoices/product"
      :ids="checkedDatas"
      @refresh="fetchProducts"
    >
      {{ $t("delete") }}
    </DeleteAll>

    <Table class="">
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="column in columns"
            :key="column.column_key"
            class="text-center bg-ten text-white cell_overflow border-[1px]"
          >
            <div v-if="column.column_key == 'quantity'">
              {{ $t("quantity") }}
            </div>
            <div v-else-if="column.column_key == 'box_quantity'">
              {{ $t("box_quantity") }}
            </div>
            <div v-else-if="column.column_key == 'price'">
              {{ $t("unit_price") }}
            </div>
            <div v-else-if="column.column_key == 'price_box'">
              {{ $t("price_box") }}
            </div>
            <div v-else-if="column.column_key == 'select'">
              <input
                type="checkbox"
                @change="
                  (event) => {
                    if (event.target.checked) {
                      checkedDatas = data.data[0].invoice_products.map(
                        (client) => client.import_invoice_product_id
                      );
                    } else {
                      checkedDatas = [];
                    }
                  }
                "
              />
            </div>
            <div v-else class="flex flex-row items-center justify-center gap-1">
              <span> {{ column.column_name }}</span>
              <button
                v-show="column.sort"
                @click="sortByColumn(column.column_key)"
              >
                <img
                  src="/assets/icons/sort.svg"
                  class="w-6 hover:rotate-180 duration-300 transition-all"
                  alt=""
                  srcset=""
                />
              </button>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow
          v-for="(row, rowIndex) in data.data[0].invoice_products"
          :key="rowIndex"
          :class="
            checkedDatas.includes(row.import_invoice_product_id)
              ? 'bg-ten bg-opacity-15'
              : ''
          "
        >
          <TableCell
            v-for="column in columns"
            :key="column.column_key"
            class="text-center cell_overflow border-[1px] py-2"
          >
            <div v-if="column.column_key == 'select'">
              <input
                type="checkbox"
                :id="row.import_invoice_product_id"
                :value="row.import_invoice_product_id"
                v-model="checkedDatas"
              />
            </div>
            <div
              v-if="column.column_key == 'actions'"
              class="flex flex-row items-center justify-center gap-2 py-2"
            >
              <div v-for="action in column.acitons" class="">
                <Delete
                  v-if="action.action_key == 'delete'"
                  :id="row.import_invoice_product_id"
                  :type="action.path"
                  @refresh="onRefresh"
                >
                  {{ $t("delete") }}
                </Delete>

                <ManageImportInvoiceProduct
                  v-if="action.action_key == 'update'"
                  :manage-data="row"
                  type="update"
                  :id="row.import_invoice_product_id"
                  @refresh="onRefresh"
                >
                  {{ $t("update") }}
                </ManageImportInvoiceProduct>
              </div>
            </div>

            <div
              v-else-if="
                column.column_key == 'quantity' ||
                column.column_key == 'box_quantity'
              "
              style="direction: rtl"
            >
              {{ row[column.column_key] }} {{ row[column.column_name] }}
            </div>

            <div v-else>
              {{ getRowColumnValue(column.column_key, row[column.column_key]) }}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div
      class="fixed bottom-0 left-0 right-0 h-16 bg-sixty border-t-2 text-black flex flex-row items-stretch"
    >
      <!-- Invoice info -->
      <div class="flex flex-col items-stretch justify-start flex-1 px-2 py-2">
        <span class="">
          {{ $t("invoice_number") }}: {{ data.data[0].import_invoice_id }}
        </span>
        <span class="">
          {{ $t("custom_invoice_number") }}: {{ data.data[0].invoice_number }}
        </span>
      </div>

      <!-- Invoice Numbers -->
      <div class="flex flex-col items-stretch justify-start flex-1 px-2 py-2">
        <span class="">
          {{ $t("price_total") }}:
          {{ parseInt(data.data[0].total).toLocaleString() }} IQD
        </span>
        <span class="">
          {{ $t("invoice_type") }}:
          {{ data.data[0].is_cash ? $t("cash") : $t("owing") }}
        </span>
      </div>

      <!-- Invoice Owing -->
      <div
        v-if="props.company != null || props.company != ''"
        class="flex flex-col items-stretch justify-start flex-1 px-2 py-2"
      >
        <span class="">
          {{ $t("owing") }}: {{ props.company.owing_amount }} IQD
        </span>
      </div>

      <!-- Actions -->
      <div
        class="flex flex-row items-center gap-2 py-2 h-full flex-1 px-4 py-2"
      >
        <!-- Save -->
        <button
          @click="emit('close')"
          class="flex flex-row items-center gap-1 bg-blue-700 text-white px-2 py-2 rounded-sm"
        >
          <img
            src="/assets/icons/save.svg"
            class="w-7 h-7 whiteFilter"
            alt=""
            srcset=""
          />
          <span>{{ $t("save") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGet } from "~/hooks/fetch";
import type { actionType, importInvoiceProductType } from "~/types/tableTypes";

const emit = defineEmits(["close"]);

const props = defineProps<{
  id: any;
  company: any;
}>();

const { t } = useI18n();

const manageData = ref<importInvoiceProductType>({
  product_id: 0,
  import_invoice_id: props.id,
  quantity: 0,
  box_quantity: 0,
  price: 0,
  price_box: 0,
});

const checkedDatas = ref([]);

const columns = [
  { column_key: "select", column_name: "", sort: false, acitons: [] },
  {
    column_key: "import_invoice_product_id",
    column_name: "ID",
    sort: true,
    acitons: [],
  },
  {
    column_key: "product_name",
    column_name: t("product_name"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "quantity",
    column_name: "unit",
    sort: true,
    acitons: [],
  },
  {
    column_key: "box_quantity",
    column_name: "box_unit",
    sort: true,
    acitons: [],
  },
  {
    column_key: "price",
    column_name: "unit_price",
    sort: true,
    acitons: [],
  },
  {
    column_key: "price_box",
    column_name: "price_box",
    sort: true,
    acitons: [],
  },
  {
    column_key: "actions",
    column_name: t("actions"),
    sort: false,
    acitons: [
      { action_key: "update", path: "" },
      { action_key: "delete", path: "import_invoices/product" },
    ] as actionType[],
  },
];

function getRowColumnValue(key: any, value: any) {
  return value;
}

const data = ref(null);
const status = ref(null);

async function fetchProducts() {
  checkedDatas.value = [];
  const { data: productData, status: productStatus }: any = await useGet(
    `import_invoices?id=${props.id}`
  );

  data.value = productData.value;
  status.value = productStatus.value;
}

fetchProducts();

async function onRefresh(emitData: any) {
  fetchProducts();
}

const sortType = ref<"desc" | "asc">("desc");

function sortByColumn(column: string) {
  if (sortType.value == "asc") {
    sortType.value = "desc";
  } else {
    sortType.value = "asc";
  }
  if (data.value == null) return;
  let arr = data.value.data ?? [];
  return arr.sort((a: any, b: any) => {
    let comparison = 0;

    // Check if the value is a number or a string
    const valA = isNaN(a[column]) ? a[column] : parseFloat(a[column]);
    const valB = isNaN(b[column]) ? b[column] : parseFloat(b[column]);

    // Compare the values
    if (valA > valB) {
      comparison = 1;
    } else if (valA < valB) {
      comparison = -1;
    }

    // Return comparison based on order
    return sortType.value === "desc" ? comparison * -1 : comparison;
  });
}
</script>

<style scoped>
/* Ensure table headers and cells handle overflow */

.cell_overflow {
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflow content */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
}
</style>
