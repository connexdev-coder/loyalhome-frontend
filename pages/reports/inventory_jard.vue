<template>
  <div class="flex flex-col items-start gap-2 py-2">
    <div class="flex flex-row justify-between w-full">
      <div class="font-bold flex flex-row items-center gap-1">
        <img src="/assets/icons/inventory.svg" class="w-6" alt="" srcset="" />
        <h1>{{ $t("inventory_jard") }}</h1>
      </div>

      <PrintDialog
        type="jard"
        :extra="`name=${productFilter.name}&category=${productFilter.category}`"
      />
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <!-- From -->
      <div class="flex flex-col items-start text-md">
        <label for="" class="">{{ $t("from") }}</label>
        <input
          class="py-2 px-2 border-[1px] rounded-sm"
          type="date"
          v-model="productFilter.from"
        />
      </div>
      <!-- To -->
      <div class="flex flex-col items-start text-md">
        <label for="" class="">{{ $t("to") }}</label>
        <input
          class="py-2 px-2 border-[1px] rounded-sm"
          type="date"
          v-model="productFilter.to"
        />
      </div>

      <div
        v-for="filterComponent in filterComponents"
        class="flex flex-col items-start gap-1"
      >
        <label for="" class="text-md">{{ filterComponent.title }}</label>
        <div class="relative">
          <SearchComponent
            class="w-full h-full"
            :path="filterComponent.path"
            :name-field="filterComponent.field"
            @on-select="filterComponent.onSelect"
            :value="productValue"
            :selected-value="
              filterComponent.reference.value != null
                ? filterComponent.reference.value[filterComponent.field]
                : ''
            "
            :disabled="filterComponent.reference.value != null"
          />
          <div
            v-if="filterComponent.reference.value != null"
            @click="
              () => {
                filterComponent.reference.value = null;
                productFilter[filterComponent.field] = '';
                fetchProducts();
              }
            "
            class="cursor-pointer absolute right-0 top-0 w-6 bottom-0 text-red-500 p-1 rounded-sm flex items-center justify-center"
          >
            <img src="/assets/icons/close.svg" class="" alt="" />
          </div>
        </div>
      </div>

      <div class="flex flex-col items-start text-md">
        <label for="" class="text-sixty">{{ $t("search") }}</label>
        <button
          @click="
            () => {
              fetchProducts();
            }
          "
          class="px-3 py-2 text-white rounded-sm bg-ten"
        >
          {{ $t("search") }}
        </button>
      </div>
    </div>

    <Table v-if="status == 'success'" class="">
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="column in columns"
            :key="column.column_key"
            class="text-center bg-ten text-white cell_overflow border-[1px]"
          >
            <div v-if="column.column_key == 'box_quantity'">
              {{ $t("box_quantity") }}
            </div>
            <div v-else-if="column.column_key == 'quantity'">
              {{ $t("quantity") }}
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
        <TableRow v-for="(row, rowIndex) in data.data" :key="rowIndex">
          <TableCell
            v-for="column in columns"
            :key="column.column_key"
            class="text-center cell_overflow border-[1px] py-2"
          >
            <div
              v-if="column.column_key == 'box_quantity'"
              style="direction: rtl"
            >
              {{
                row.has_box
                  ? row.current_quantity /
                    (row.inside_box == 0 ? 1 : row.inside_box)
                  : 0
              }}
              {{ row[column.column_name] }}
            </div>

            <div
              v-else-if="column.column_key == 'quantity'"
              style="direction: rtl"
            >
              {{ row.has_box ? row.inside_box : row.current_quantity }}
              {{ row[column.column_name] }}
            </div>

            <div
              v-else-if="column.column_key == 'total_quantity'"
              style="direction: rtl"
            >
              {{
                row.has_box
                  ? (row.current_quantity /
                      (row.inside_box == 0 ? 1 : row.inside_box)) *
                    row.inside_box
                  : row.current_quantity
              }}
              {{ row.unit_name }}
            </div>

            <!-- import -->
            <div
              v-else-if="column.column_key == 'import_quantity'"
              style="direction: rtl"
              class="bg-green-100"
            >
              {{
                row.has_box
                  ? (row.import_quantity /
                      (row.inside_box == 0 ? 1 : row.inside_box)) *
                    row.inside_box
                  : row.import_quantity
              }}
              {{ row.unit_name }}
            </div>

            <!-- export -->
            <div
              v-else-if="column.column_key == 'export_quantity'"
              style="direction: rtl"
              class="bg-yellow-100"
            >
              {{
                row.has_box
                  ? (row.export_quantity /
                      (row.inside_box == 0 ? 1 : row.inside_box)) *
                    row.inside_box
                  : row.export_quantity
              }}
              {{ row.unit_name }}
            </div>

            <!-- waste -->
            <div
              v-else-if="column.column_key == 'waste_quantity'"
              style="direction: rtl"
              class="bg-red-100"
            >
              {{
                row.has_box
                  ? (row.waste_quantity /
                      (row.inside_box == 0 ? 1 : row.inside_box)) *
                    row.inside_box
                  : row.waste_quantity
              }}
              {{ row.unit_name }}
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
import type { actionType, productType } from "~/types/tableTypes";

definePageMeta({
  requiredAuthorities: ["report"],
});

const { t } = useI18n();

// category
const selectedCategory = ref<any>(null);
function onCategorySelected(newItem: any) {
  selectedCategory.value = newItem;
  if (selectedCategory.value == null) return;
  productFilter.value.category = selectedCategory.value.category;
}
// category
const selectedName = ref<any>(null);
function onNameSelected(newItem: any) {
  selectedName.value = newItem;
  if (selectedName.value == null) return;
  productFilter.value.name = selectedName.value.name;
}

type filterType = {
  title: string;
  path: string;
  reference: Ref<any>;
  onSelect: Function;
  field: string;
};

const productValue = ref({
  category: "",
  name: "",
});

const filterComponents: filterType[] = [
  {
    title: t("name"),
    path: "settings/product-names",
    reference: selectedName,
    onSelect: onNameSelected,
    field: "name",
  },
  {
    title: t("category"),
    path: "settings/category",
    reference: selectedCategory,
    onSelect: onCategorySelected,
    field: "category",
  },
];

const productFilter = ref({
  from: "",
  to: "",
  name: "",
  category: "",
});

const manageData = ref<productType>({
  unit_id: 0,
  name: "",
  category: "",
});

function onNewCategory(newCategory: any) {
  manageData.value.category = newCategory;
}

const columns = [
  { column_key: "product_id", column_name: "ID", sort: true, acitons: [] },
  {
    column_key: "name",
    column_name: t("name"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "category",
    column_name: t("category"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "box_quantity",
    column_name: "unit_box",
    sort: true,
    acitons: [],
  },
  {
    column_key: "quantity",
    column_name: "unit_name",
    sort: true,
    acitons: [],
  },
  {
    column_key: "total_quantity",
    column_name: t("total_quantity"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "import_quantity",
    column_name: t("import_quantity"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "export_quantity",
    column_name: t("export_quantity"),
    sort: true,
    acitons: [],
  },
  {
    column_key: "waste_quantity",
    column_name: t("waste_quantity"),
    sort: true,
    acitons: [],
  },
];

function getRowColumnValue(key: any, value: any) {
  return value;
}

const data = ref(null);
const status = ref(null);

async function fetchProducts() {
  const { data: productData, status: productStatus }: any = await useGet(
    `products?` +
      `name=${productFilter.value.name}` +
      `&category=${productFilter.value.category}` +
      `&from=${productFilter.value.from}` +
      `&to=${productFilter.value.to}`
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
