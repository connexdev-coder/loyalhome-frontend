<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="hugeicons:delivery-truck-02" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("companies") }}</h1>
      </div>

      <ManageCompany
        title="add_company"
        :manage-data="manageData"
        type="add"
        :id="0"
        @refresh="fetchCurrentPage"
      >
        <div
          class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
        >
          <Icon name="hugeicons:add-01" class="text-xl" />
          <span> {{ $t("add_company") }}</span>
        </div>
      </ManageCompany>
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
      primary_key="company_id"
      api_route="companies"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageCompany
            title="update"
            :manage-data="row"
            type="update"
            :id="row.company_id"
            @refresh="fetchCurrentPage"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageCompany>
          <Delete
            type="companies"
            :id="row.company_id"
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

const { t } = useI18n();

const filterData = ref({
  search: "",
});

const manageData = ref({
  name: "",
});

// Define columns
const columns = [
  { key: "name", label: t("name"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `companies?page=${page}&search=${filterData.value.search}`
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
