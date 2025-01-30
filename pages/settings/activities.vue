<template>
  <div class="flex flex-col gap-3 pb-10">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="HISTORY_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("activities") }}</h1>
      </div>
    </div>

    <!-- Filter -->
    <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
      primary_key="manager_activity_id"
      api_route="configs/activities"
      @page-change="fetchPage"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ShowMore :data="row.new_value">
            <div
              class="bg-update text-white px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <Icon :name="EYE_ICON" class="text-xl" />
              <span> {{ $t("new_value") }}</span>
            </div>
          </ShowMore>
        </div>
      </template>
      <!-- Custom slot for 'actions' column -->
      <template #cell-column_name="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          {{ JSON.parse(row.new_value)[row.column_name] }}
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGet } from "~/hooks/fetch";
import { Table } from "@/components/rcp";

definePageMeta({
  layout: "default",
});

const filters = [
  {
    valueField: "search",
    type: "text",
    icon: SEARCH_ICON,
    onChange: () => {
      fetchCurrentPage();
    },
  },
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

const { t } = useI18n();

const filterData = ref({
  search: "",
  from: "",
  to: "",
});

// Define columns
const columns = [
  { key: "table_name", label: t("table") },
  { key: "column_name", label: t("row") },
  { key: "note", label: t("actions") },
  { key: "manager_name", label: t("manager_name") },
  { key: "created_at", label: t("created_at") },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `configs/activities?page=${page}&search=${filterData.value.search}&from=${filterData.value.from}&to=${filterData.value.to}`
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
