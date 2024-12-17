<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger>
      <div class="bg-ten text-white px-3 py-2 rounded-sm w-full text-md">
        <slot />
      </div>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <h1 class="text-center font-bold"><slot /></h1>
        </DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <div class="h-[350px] overflow-y-scroll">
        <form
          ref="dataForm"
          @submit.prevent="onManageDriver"
          class="flex flex-col gap-1"
        >
          <label for="">{{ $t("name") }}</label>
          <input
            type="text"
            v-model="manageData.name"
            class="px-2 py-2 border-[1px] rounded-sm"
          />

          <label for="">{{ $t("category") }}</label>
          <SearchSuggestion
            class="w-full h-full"
            path="settings/category"
            @on-select="onCategorySelected"
            :selected-value="props.manageData.category"
            name-field="category"
            :disabled="false"
          />

          <label for="" class="text-md">{{ $t("unit") }}</label>
          <div class="relative">
            <SearchComponent
              class="w-full h-full"
              path="settings/units"
              @on-select="onUnitSelected"
              :selected-value="
                selectedUnit != null
                  ? `${selectedUnit.unit_name} - ${selectedUnit.unit_box}`
                  : ''
              "
              name-field="unit"
              :disabled="selectedUnit != null"
            />
            <div
              v-if="selectedUnit != null"
              @click="
                () => {
                  selectedUnit = null;
                }
              "
              class="cursor-pointer absolute right-0 top-0 bottom-0 text-red-500 px-1 py-2 rounded-sm h-10 w-10 flex items-center justify-center"
            >
              X
            </div>
          </div>
        </form>
      </div>

      <h1 class="text-red-500">{{ warning }}</h1>

      <button
        @click="submitForm"
        class="bg-ten text-white rounded-sm py-2 px-3 w-full"
      >
        <slot />
      </button>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useActionPost, useActionPut } from "~/hooks/actionFetch";
import { useGet } from "~/hooks/fetch";
import type { productType } from "~/types/tableTypes";

const selectedUnit = ref<any>(null);
function onUnitSelected(newItem: any) {
  selectedUnit.value = newItem;
  if (selectedUnit.value == null) return;
}

function onCategorySelected(newItem: any) {
  if (typeof newItem == "string") props.manageData.category = newItem;
  else props.manageData.category = newItem.category;
}

const { t } = useI18n();

const warning = ref("");
const dataForm = ref<any>("");

const props = defineProps<{
  type: string;
  manageData: productType;
  id: any;
}>();

function submitForm() {
  dataForm.value.dispatchEvent(new Event("submit"));
}

const emit = defineEmits(["refresh", "categorySelected"]);

function validateFields() {
  let requiredFields = " ";
  if (props.manageData.name.length == 0) requiredFields += " " + "Name";
  if (props.manageData.category.length == 0) requiredFields += " " + "Category";
  if (selectedUnit.value == null) requiredFields += " " + "Unit";

  if (requiredFields == " ") return true;
  warning.value = requiredFields;
  return false;
}

async function onManageDriver() {
  warning.value = "";
  const isValid = validateFields();

  if (!isValid) return;

  try {
    const response =
      props.type == "add"
        ? await useActionPost("products", {
            ...props.manageData,
            unit_id: selectedUnit.value.unit_id,
          })
        : await useActionPut(`products/${props.id}`, {
            name: props.manageData.name,
            category: props.manageData.category,
            unit_id: selectedUnit.value.unit_id,
          });

    if (response.status == 200) {
      emit("refresh", { data: response, type: props.type });
      dialogContentVisible.value = false;
    } else {
      warning.value = t("tryagain");
    }
  } catch (error) {
    warning.value = warning.value = t("tryagain");
  }
}

const dialogContentVisible = ref(false);

const { data: unitData, status: unitStatus } = await useGet("settings/units");

function checkAndSetUnit() {
  if (props.manageData.unit_id != 0 && unitStatus.value == "success") {
    const unit = unitData.value.data.find(
      (item: any) => item.unit_id === props.manageData.unit_id
    );

    if (unit) {
      selectedUnit.value = unit;
      props.manageData.unit_id = selectedUnit.value.unit_id;
    }
  }
}

watch(
  () => dialogContentVisible.value,
  (newVal) => {
    if (newVal) {
      checkAndSetUnit();
    }
  }
);
</script>
