<template>
  <div class="overflow-x-auto flex flex-col gap-2">
    <!-- Actions if selected -->
    <div
      v-if="selectedRows.length > 0"
      class="flex flex-wrap items-center justify-end gap-5"
    >
      <DeleteAll
        :ids="selectedRows"
        @refresh="refreshData"
        :path="
          props.primary_key == 'import_invoice_product_id'
            ? 'import_product'
            : props.api_route
        "
      >
        <div
          class="bg-destructive text-white px-2 py-1 rounded-sm flex items-center gap-1"
        >
          <Icon name="hugeicons:delete-02" class="text-xl" />
          <span> {{ $t("delete") }}</span>
          <span>({{ selectedRows.length }})</span>
        </div>
      </DeleteAll>
    </div>

    <!-- Table -->
    <table class="w-full border-collapse border border-gray-200 text-start">
      <thead class="bg-ten text-overTen text-start">
        <tr>
          <!-- Select All Checkbox -->
          <th class="p-2 border border-gray-200 text-center w-10">
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
              class="cursor-pointer"
            />
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            class="p-2 border border-gray-200 cursor-pointer whitespace-nowrap"
            @click="sortByColumn(column)"
          >
            <div class="flex items-center justify-start gap-1">
              <span v-if="sortColumn === column.key" class="flex items-center">
                <Icon
                  name="hugeicons:sorting-03"
                  class="text-xl rotate-180"
                  v-if="sortOrder === 'asc'"
                />
                <Icon
                  name="hugeicons:sorting-03"
                  class="text-xl"
                  v-if="sortOrder === 'desc'"
                />
              </span>
              <span> {{ column.label }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in sortedRows"
          :key="rowIndex"
          class="hover:bg-thirty"
          :class="
            selectedRows.includes(row[props.primary_key])
              ? 'bg-thirty'
              : rowIndex % 2 == 0
              ? ''
              : 'bg-slate-100'
          "
        >
          <!-- Individual Row Checkbox -->
          <td class="p-2 border border-gray-300 w-10 text-center">
            <input
              type="checkbox"
              v-model="selectedRows"
              :value="row[props.primary_key]"
              class="cursor-pointer"
            />
          </td>
          <td
            v-for="(column, colIndex) in columns"
            :key="colIndex"
            class="p-2 border border-gray-300 whitespace-nowrap"
            :class="
              row[column.key] == 'dollar'
                ? 'bg-blue-100'
                : row[column.key] == 'dinar'
                ? 'bg-yellow-100'
                : row[column.key] == 'deposit'
                ? 'bg-orange-100'
                : row[column.key] == 'withdraw'
                ? 'bg-red-100'
                : row[column.key] == 'cash'
                ? 'bg-green-100'
                : row[column.key] == 'owing'
                ? 'bg-red-100'
                : column.key == 'dinar_price'
                ? 'bg-slate-200'
                : column.key == 'total_remaining'
                ? 'bg-red-100'
                : column.key == 'total_paid'
                ? 'bg-green-100'
                : ''
            "
          >
            <!-- Custom slot or default rendering -->
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :column="column"
              :value="row[column.key]"
            >
              {{
                Number(row[column.key]) &&
                !["phone", "extra_phone", "relative_phone"].includes(column.key)
                  ? Number(row[column.key]).toLocaleString()
                  : ["transaction_type", "currency_type"].includes(column.key)
                  ? $t(row[column.key])
                  : column.key == "sale_status"
                  ? $t(row[column.key])
                  : column.key == "sale_type"
                  ? $t(row[column.key])
                  : row[column.key]
              }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="flex items-center justify-end gap-2 mt-4">
      <button
        class="px-3 py-1 border rounded hover:bg-gray-200"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        {{ $t("previous") }}
      </button>
      <span> Page {{ currentPage }} of {{ totalPages }} </span>
      <button
        class="px-3 py-1 border rounded hover:bg-gray-200"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        {{ $t("next") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue";

// Define column type
type TableColumn = {
  key: string; // Field in the data
  label: string; // Column header
  sortable?: boolean; // Whether the column is sortable
};

// Props for the table
const props = defineProps({
  api_route: {
    type: String,
    required: true,
  },
  primary_key: {
    type: String,
    required: true,
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    required: true,
  },
  rows: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
});

// Emit events
const emit = defineEmits(["page-change"]);

// Sorting states
const sortColumn = ref<string | null>(null);
const sortOrder = ref<"asc" | "desc" | null>(null);

// Selected rows state
const selectedRows = ref<number[]>([]);

// Check if all rows are selected
const isAllSelected = computed(() => {
  return (
    props.rows.length > 0 && selectedRows.value.length === props.rows.length
  );
});

// Computed for sorted rows
const sortedRows = computed(() => {
  if (!sortColumn.value) return props.rows;

  return [...props.rows].sort((a, b) => {
    const valA = a[sortColumn.value as string];
    const valB = b[sortColumn.value as string];

    let comparison = 0;
    if (valA > valB) comparison = 1;
    else if (valA < valB) comparison = -1;

    return sortOrder.value === "desc" ? -comparison : comparison;
  });
});

// Methods
function sortByColumn(column: TableColumn) {
  if (!column.sortable) return;

  if (sortColumn.value === column.key) {
    // Reverse the order
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    // Set new column and order
    sortColumn.value = column.key;
    sortOrder.value = "asc";
  }
}

// Handle page change
function changePage(newPage: number) {
  if (newPage >= 1 && newPage <= props.totalPages) {
    emit("page-change", newPage);
  }
}

// Toggle Select All functionality
function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = props.rows.map((row) => row[props.primary_key]); // Assumes each row has a unique 'id'
  }
}

function refreshData() {
  changePage(props.currentPage);
  selectedRows.value = [];
}
</script>

<style scoped>
/* Styling for disabled pagination buttons */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
