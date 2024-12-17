<template>
  <div class="flex flex-col gap-3">
    <!-- Title -->
    <div class="flex flex-row items-center justify-between">
      <div class="font-bold flex flex-row items-center gap-1">
        <Icon name="hugeicons:user-settings-01" class="text-4xl text-ten" />
        <h1 class="text-xl uppercase">{{ $t("managers") }}</h1>
      </div>

      <ManageManager
        title="add_manager"
        :manage-data="manageData"
        type="add"
        :id="0"
        @refresh="fetchCurrentPage"
      >
        <div
          class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1"
        >
          <Icon name="hugeicons:add-01" class="text-xl" />
          <span> {{ $t("add_manager") }}</span>
        </div>
      </ManageManager>
    </div>

    <!-- Data -->
    <Table
      v-if="status == 'success'"
      :columns="columns"
      :rows="data"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="fetchPage"
      primary_key="manager_id"
      api_route="managers"
    >
      <!-- Custom slot for 'actions' column -->
      <template #cell-actions="{ row }">
        <div class="flex flex-row items-center justify-start gap-1">
          <ManageManager
            title="update"
            :manage-data="row"
            type="update"
            :id="row.manager_id"
            @refresh="fetchCurrentPage"
          >
            <div class="bg-update text-white button_shape">
              <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
              <span> {{ $t("update") }}</span>
            </div>
          </ManageManager>
          <ManageManagerAuthority title="authority" :id="row.manager_id">
            <div class="bg-orange-500 text-white button_shape">
              <Icon name="hugeicons:authorized" class="text-xl" />
              <span> {{ $t("authority") }}</span>
            </div>
          </ManageManagerAuthority>
          <Delete
            type="managers"
            :id="row.manager_id"
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
  name: "",
});

const manageData = ref({
  name: "",
});

// Define columns
const columns = [
  { key: "manager_id", label: "ID", sortable: true },
  { key: "name", label: t("name"), sortable: true },
  { key: "username", label: t("username"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `managers?page=${page}&search=${filterData.value.name}`
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
