<template>
  <div class="flex flex-col items-start gap-2 py-2">
    <div class="flex flex-row items-center justify-between w-full">
      <div class="font-bold flex flex-row items-center gap-1">
        <img src="/assets/icons/history.svg" class="w-6" alt="" srcset="" />
        <h1>{{ $t("qasa_transaction") }}</h1>
      </div>

      <PrintDialog
        type="box_transaction"
        :extra="`search=${dataFilter.search}&is_deposit=${dataFilter.is_deposit}&from=${dataFilter.from}&to=${dataFilter.to}`"
      />
    </div>

    <div class="flex flex-wrap items-center gap-x-3">
      <!-- Search -->
      <div class="flex flex-col items-start text-md">
        <label for="" class="">{{ $t("search") }}</label>
        <input
          class="py-2 px-2 border-[1px] rounded-sm"
          type="text"
          v-model="dataFilter.search"
        />
      </div>

      <!-- From -->
      <div class="flex flex-col items-start text-md">
        <label for="" class="">{{ $t("from") }}</label>
        <input
          class="py-2 px-2 border-[1px] rounded-sm"
          type="date"
          v-model="dataFilter.from"
        />
      </div>
      <!-- To -->
      <div class="flex flex-col items-start text-md">
        <label for="" class="">{{ $t("to") }}</label>
        <input
          class="py-2 px-2 border-[1px] rounded-sm"
          type="date"
          v-model="dataFilter.to"
        />
      </div>

      <!-- Is Cash -->
      <div class="flex flex-col items-start text-md">
        <label for="" class="">{{ $t("transaction_type") }}</label>
        <select
          v-model="dataFilter.is_deposit"
          class="px-2 py-2 border-[1px] rounded-sm"
        >
          <option :value="true">{{ $t("deposit") }}</option>
          <option :value="false">{{ $t("withdraw") }}</option>
        </select>
      </div>

      <div class="flex flex-col items-start text-md">
        <label for="" class="text-sixty">{{ $t("search") }}</label>
        <button
          @click="
            () => {
              fetchCompanies();
            }
          "
          class="px-3 py-2 text-white rounded-sm bg-ten"
        >
          {{ $t("search") }}
        </button>
      </div>
    </div>

    <DeleteAll
      v-show="checkedDatas.length > 0"
      path="box_invoices"
      :ids="checkedDatas"
      @refresh="fetchCompanies"
    >
      {{ $t("delete") }}
    </DeleteAll>

    <Table v-if="status == 'success'" class="">
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="column in columns"
            :key="column.column_key"
            class="text-center bg-ten text-white cell_overflow border-[1px]"
          >
            <div v-if="column.column_key == 'select'">
              <input
                type="checkbox"
                @change="
                  (event) => {
                    if (event.target.checked) {
                      checkedDatas = data.data.map(
                        (client) => client.box_invoice_id
                      );
                    } else {
                      checkedDatas = [];
                    }
                  }
                "
              />
            </div>

            <div
              v-else-if="column.column_name != null"
              class="flex flex-row items-center justify-center gap-1"
            >
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
          v-for="(row, rowIndex) in data.data"
          :key="rowIndex"
          :class="row.is_deposit ? 'bg-green-50' : 'bg-red-50'"
        >
          <TableCell
            v-for="column in columns"
            :key="column.column_key"
            class="text-center cell_overflow border-[1px] py-2"
            :class="
              checkedDatas.includes(row.box_invoice_id)
                ? 'bg-ten bg-opacity-15'
                : ''
            "
          >
            <div v-if="column.column_key == 'select'">
              <input
                type="checkbox"
                :id="row.box_invoice_id"
                :value="row.box_invoice_id"
                v-model="checkedDatas"
              />
            </div>

            <div v-else-if="column.column_key == 'is_deposit'">
              {{ row.is_deposit ? $t("deposit") : $t("withdraw") }}
            </div>

            <!-- Download invoice_img -->
            <button
              v-else-if="column.column_key == 'invoice_img'"
              v-show="row.invoice_img != ''"
              class="bg-ten bg-opacity-25 px-4 py-2 rounded-full flex flex-row items-center gap-2"
              @click="downloadFile(row.invoice_img)"
            >
              <span> {{ row.invoice_img }}</span>
              <img
                src="/assets/icons/external.svg"
                class="w-5"
                alt=""
                srcset=""
              />
            </button>

            <div
              v-else-if="column.column_key == 'actions'"
              class="flex flex-row items-center justify-center gap-2 py-2"
            >
              <div v-for="action in column.acitons" class="">
                <Delete
                  v-if="action.action_key == 'delete'"
                  :id="row.box_invoice_id"
                  :type="action.path"
                  @refresh="onRefresh"
                >
                  {{ $t("delete") }}
                </Delete>

                <ManageQasaTransaction
                  v-if="action.action_key == 'update'"
                  :manage-data="row"
                  type="udpate"
                  :id="row.box_invoice_id"
                  @refresh="onRefresh"
                >
                  <span> {{ $t("update") }} </span>
                </ManageQasaTransaction>
              </div>
            </div>
            <div v-else>
              {{ getRowColumnValue(column.column_key, row[column.column_key]) }}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { useGet } from "~/hooks/fetch";
import type { actionType, companyPaymentType } from "~/types/tableTypes";

definePageMeta({
  requiredAuthorities: ["finance"],
});

const selectedCompany = ref<any>(null);
function onCompanySelected(newItem: any) {
  selectedCompany.value = newItem;
  if (selectedCompany.value == null) return;
  dataFilter.value.company_id = selectedCompany.value.company_id;
}

const { t } = useI18n();

const columns = [
  { column_key: "select", column_name: "", sort: false, acitons: [] },
  {
    column_key: "box_invoice_id",
    column_name: "ID",
    sort: true,
    acitons: [],
  },
  {
    column_key: "getter",
    column_name: t("getter"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "setter",
    column_name: t("setter"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "amount",
    column_name: t("money_amount"),
    sort: false,
    acitons: [],
  },
  {
    column_key: "invoice_img",
    column_name: t("invoice_img"),
    sort: false,
    acitons: [],
  },
  {
    column_key: "is_deposit",
    column_name: t("transaction_type"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "created_at",
    column_name: t("created_at"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "actions",
    column_name: t("actions"),
    sort: false,
    acitons: [
      { action_key: "update", path: "" },
      { action_key: "delete", path: "box_invoices" },
    ] as actionType[],
  },
];

function getRowColumnValue(key: any, value: any) {
  return value;
}

const checkedDatas = ref([]);

const dataFilter = ref({
  from: "",
  to: "",
  search: "",
  is_deposit: "",
});

const data = ref(null);
const status = ref(null);

async function fetchCompanies() {
  checkedDatas.value = [];
  const { data: clientData, status: clientStatus }: any = await useGet(
    `box_invoices?` +
      `from=${dataFilter.value.from}` +
      `&to=${dataFilter.value.to}` +
      `&search=${dataFilter.value.search}` +
      `&is_deposit=${dataFilter.value.is_deposit}`
  );
  data.value = clientData.value;
  status.value = clientStatus.value;
}

fetchCompanies();

async function onRefresh(emitData: any) {
  fetchCompanies();
}

const sortType = ref<"desc" | "asc">("desc");

async function downloadFile(filename: string) {
  const { data: downloadData, status: downloadStatus } = await useGet(
    `files/${filename}`
  );

  if (downloadStatus.value != "success") return;
  const pdfBlob: any = downloadData.value;

  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(pdfBlob);

  downloadLink.click();
}

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
