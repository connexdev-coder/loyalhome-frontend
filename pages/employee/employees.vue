<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="clarity:employee-group-line" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("employees") }}</h1>
      </div>

      <ManageEmployee
        title="add_employee"
        :manage-data="manageData"
        type="add"
        :id="0"
        @refresh="fetchCurrentPage"
      >
        <div
          class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
        >
          <Icon name="hugeicons:add-01" class="text-xl" />
          <span> {{ $t("add_employee") }}</span>
        </div>
      </ManageEmployee>
    </div>

    <!-- Filter -->
    <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
      <Input
        :value="filterData"
        value-field="search"
        type="text"
        icon="hugeicons:search-01"
        placeholder="search"
        @on-change="fetchCurrentPage"
        @refresh="fetchCurrentPage"
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
      primary_key="employee_id"
      api_route="employees"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageEmployee
            title="update"
            :manage-data="row"
            type="update"
            :id="row.employee_id"
            @refresh="fetchCurrentPage"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageEmployee>
          <Delete
            type="employees"
            :id="row.employee_id"
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
import ManageEmployee from "~/components/management/ManageEmployee.vue";

const { t } = useI18n();

const filterData = ref({
  search: "",
});

const manageData = ref({
  name: "",
  phone: "",
  position: "",
  salary: "",
  salary_type: "",
  factory_type: "",
  currency_type: "",
});

// Define columns
const columns = [
  { key: "employee_id", label: "ID", sortable: true },
  { key: "name", label: t("name"), sortable: true },
  { key: "phone", label: t("phone"), sortable: true },
  {
    key: "position",
    label: t("position"),
    sortable: true,
  },
  { key: "salary", label: t("salary"), sortable: true },
  { key: "salary_type", label: t("salary_type"), sortable: true },
  { key: "currency_type", label: t("currency_type"), sortable: true },
  { key: "factory_type", label: t("factory"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `employees?page=${page}&search=${filterData.value.search}`
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
