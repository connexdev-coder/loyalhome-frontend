<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent class="max-w-[80vw]">
      <DialogHeader>
        <DialogTitle>
          <div class="flex flex-row items-center justify-between mr-10">
            <div class="font-bold flex flex-row items-center gap-1">
              <Icon :name="PRODUCT_ICON" class="text-4xl text-ten" />
              <h1 class="text-xl uppercase hidden md:block">
                {{ $t("products") }}
              </h1>
            </div>

            <ManageMdfProduct
              title="add_product"
              :manage-data="manageData"
              type="add"
              :id="0"
              @refresh="fetchCurrentPage"
              :invoice_id="props.id"
            >
              <div
                class="bg-ten text-overTen px-2 py-1 rounded-sm flex items-center gap-1 h-10"
              >
                <Icon name="hugeicons:add-01" class="text-xl" />
                <span> {{ $t("add_product") }}</span>
              </div>
            </ManageMdfProduct>
          </div>
        </DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <div class="h-[80vh] overflow-y-scroll">
        <!-- Data -->
        <Table
          v-if="data"
          :columns="columns"
          :rows="data"
          :currentPage="currentPage"
          :totalPages="totalPages"
          @page-change="fetchCurrentPage"
          primary_key="mdf_sale_product_item_id"
          api_route="mdf_item_producs"
        >
          <!-- Custom slot for 'actions' column -->
          <template #cell-actions="{ row }">
            <div class="flex flex-row items-center justify-start gap-1">
              <ManageMdfProduct
                title="update"
                :manage-data="row"
                type="update"
                :id="row.mdf_sale_product_item_id"
                @refresh="fetchCurrentPage"
                :invoice_id="props.id"
              >
                <div class="bg-update text-white button_shape">
                  <Icon name="hugeicons:pencil-edit-01" class="text-xl" />
                  <span> {{ $t("update") }}</span>
                </div>
              </ManageMdfProduct>
              <Delete
                type="mdf_item_producs"
                :id="row.mdf_sale_product_item_id"
                @refresh="fetchCurrentPage"
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
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGet } from "~/hooks/fetch";
import { Table } from "@/components/rcp";
import ManageMdfProduct from "~/components/management/ManageMdfProduct.vue";

const emit = defineEmits(["refresh"]);

const props = defineProps<{
  id: any;
}>();

const { t } = useI18n();

const manageData = ref({
  get_price: 0,
  sell_price: 0,
  quantity: 1,
  note: "",
});

// Define columns
const columns = [
  { key: "product_name", label: t("product_name"), sortable: true },
  {
    key: "get_price",
    label: `${t("get_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  {
    key: "sell_price",
    label: `${t("sell_price")} (${MAIN_CURRENCY})`,
    sortable: true,
  },
  { key: "quantity_unit", label: t("quantity"), sortable: true },
  { key: "note", label: t("note"), sortable: true },
  { key: "actions", label: t("actions") },
];

// Backend pagination
const currentPage = ref(1);
const totalPages = ref(1);
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage(page: number) {
  let path = `mdf_item_producs/${props.id}`;

  const { data: dataData, status: dataStatus }: any = await useGet(path);
  data.value = dataData.value.data;
  status.value = dataStatus.value;
  totalPages.value = dataData.value.total_pages;
  currentPage.value = page;
}

async function fetchCurrentPage() {
  await fetchPage(currentPage.value);
  emit("refresh");
}

const dialogContentVisible = ref(false);

watch(
  () => dialogContentVisible.value,
  (newVal) => {
    if (newVal) {
      fetchCurrentPage();
    }
  }
);
</script>
