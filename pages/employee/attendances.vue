<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon :name="CALENDAR_ICON" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("employee_attendances") }}</h1>
      </div>

      <div class="flex flex-row items-center gap-2" v-if="data">
        <div class="flex flex-row items-center gap-1">
          <PrintDialog type="employee_offs" extra="" lang="ku" />
          <PrintDialog type="employee_offs" extra="" lang="ar" />
        </div>
        <ManageEmployeeAttendance
          title="add_off"
          :manage-data="{}"
          type="add"
          :id="0"
          @refresh="fetchCurrentPage"
        >
          <div
            class="bg-dollar text-white px-2 py-1 rounded-sm flex items-center gap-1"
          >
            <Icon :name="CALENDAR_ICON" class="text-xl" />
            <span> {{ $t("add_off") }}</span>
          </div>
        </ManageEmployeeAttendance>
      </div>
    </div>

    <!-- Filter -->
    <div
      class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 items-center gap-2"
    >
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

      <ComboBox
        label="employee_name"
        type="text"
        :icon="USER_ICON"
        placeholder="employee_name"
        api_route="employees"
        api_route_query="search"
        :result_fields="['employee_name']"
        :selectedValue="selectedemployee"
        @on-change="
            (data:any) => {
              selectedemployee = data;
              filterData.employee_id = data.employee_id;
              fetchCurrentPage();
            }
        "
        @clear="
          () => {
            selectedemployee = null;
            filterData.employee_id = '';
            fetchCurrentPage();
          }
        "
        :disabled="selectedemployee ? true : false"
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
      primary_key="employee_off_id"
      api_route="employee_offs"
    >
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageEmployeeAttendance
            title="update"
            :manage-data="row"
            type="update"
            :id="row.employee_off_id"
            @refresh="fetchCurrentPage"
          >
            <div
              class="bg-dollar text-white px-2 py-1 rounded-sm flex items-center gap-0"
            >
              <Icon :name="UPDATE_ICON" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageEmployeeAttendance>
          <Delete
            type="employee_offs"
            :id="row.employee_off_id"
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

const { t } = useI18n();

const selectedemployee = ref(null);

const filterData = ref({
  search: "",
  employee_id: useRoute().query.employee ?? "",
  from: "",
  to: "",
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

// Define columns
const columns = [
  {
    key: "employee_off_id",
    label: t("id"),
    sortable: true,
  },
  { key: "employee_name", label: t("employee_name"), sortable: true },
  { key: "from", label: t("from"), sortable: true },
  { key: "to", label: t("to"), sortable: true },
  { key: "note", label: t("note"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `employee_offs?page=${page}&employee_id=${filterData.value.employee_id}&from=${filterData.value.from}&to=${filterData.value.to}&search=${filterData.value.search}`
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
