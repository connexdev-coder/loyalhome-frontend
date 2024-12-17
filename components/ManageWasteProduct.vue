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

      <div class="h-[350px] overflow-y-scroll flex flex-col gap-2 py-2">
        <div class="flex flex-col gap-2">
          <!-- Product -->
          <label v-if="props.type != 'update'" for="" class="text-md">
            {{ $t("product") }}
          </label>
          <div v-if="props.type != 'update'" class="relative">
            <SearchComponent
              class="w-full h-full"
              path="products"
              @on-select="onProductSelected"
              :selected-value="
                selectedProduct != null ? selectedProduct.name : ''
              "
              name-field="name"
              :disabled="selectedProduct != null"
            />
            <div
              v-if="selectedProduct != null"
              @click="
                () => {
                  selectedProduct = null;
                }
              "
              class="cursor-pointer absolute right-0 top-0 w-6 bottom-0 text-red-500 p-1 rounded-sm flex items-center justify-center"
            >
              <img src="/assets/icons/close.svg" class="" alt="" />
            </div>
          </div>

          <!-- Export Info -->
          <div
            v-if="selectedProduct != null"
            class="flex flex-col items-stretch gap-1"
          >
            <!-- Quantity -->
            <label for="">{{ $t("quantity") }}</label>
            <div class="flex flex-row items-center gap-1">
              <button
                v-if="selectedProduct.has_box"
                @click="
                  () => {
                    boxExport = !boxExport;
                    props.manageData.quantity = 0;
                  }
                "
                class="bg-ten text-white px-2 py-2 text-md rounded-sm"
              >
                {{
                  boxExport
                    ? selectedProduct.unit_box
                    : selectedProduct.unit_name
                }}
              </button>
              <input
                type="number"
                oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                @input="handleInput"
                min="0"
                max="1"
                v-model="props.manageData.quantity"
                class="px-2 py-2 border-[1px] rounded-sm flex-1"
              />
            </div>

            <div class="flex flex-row items-center gap-2 opacity-50 text-md">
              <span v-if="selectedProduct.has_box">
                {{ selectedProduct.unit_box }}
                {{
                  selectedProduct.has_box
                    ? selectedProduct.current_quantity /
                      selectedProduct.inside_box
                    : ""
                }}

                -
              </span>

              <span>
                {{ selectedProduct.unit_name }}
                {{
                  selectedProduct.has_box
                    ? (selectedProduct.current_quantity /
                        selectedProduct.inside_box) *
                      selectedProduct.inside_box
                    : selectedProduct.current_quantity
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h1 class="text-red-500">{{ warning }}</h1>

      <button
        @click="onManageDriver"
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
import type { wasteType } from "~/types/tableTypes";

const boxExport = ref(false);

const selectedProduct = ref<any>(null);
function onProductSelected(newItem: any) {
  selectedProduct.value = newItem;
  if (selectedProduct.value == null) return;
}

function handleInput(event: any) {
  event.target.value = event.target.value.replace(/[^0-9]/g, "");
  props.manageData.quantity = event.target.value;

  if (selectedProduct.value == null) return;

  let max = null;

  // without box
  if (selectedProduct.value.has_box == false) {
    max =
      selectedProduct.value.import_quantity -
      selectedProduct.value.export_quantity;
  }

  // with box
  // with quantity
  if (selectedProduct.value.has_box == true && boxExport.value == false) {
    max =
      ((selectedProduct.value.import_quantity -
        selectedProduct.value.export_quantity) /
        selectedProduct.value.inside_box) *
      selectedProduct.value.inside_box;
  }

  // with box
  // with quantity
  if (selectedProduct.value.has_box == true && boxExport.value == true) {
    max =
      (selectedProduct.value.import_quantity -
        selectedProduct.value.export_quantity) /
      selectedProduct.value.inside_box;
  }

  if (max == null) return;

  if (props.manageData.quantity > max) {
    props.manageData.quantity = max;
  } else if (props.manageData.quantity < 0) {
    props.manageData.quantity = 0;
  }
}

const { t } = useI18n();

const warning = ref("");
const dataForm = ref<any>("");

const props = defineProps<{
  type: string;
  manageData: wasteType;
  id: any;
}>();

const emit = defineEmits(["refresh", "categorySelected"]);

function onNewSearchOption(field: string, option: any) {
  props.manageData[field] = option;
}

function validateFields() {
  let requiredFields = " ";

  if (selectedProduct.value == null && props.type == "add")
    requiredFields += " " + "product";
  if (props.manageData.quantity < 0) requiredFields += " " + "quantity";

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
        ? await useActionPost("wasted", {
            ...props.manageData,
            product_id: selectedProduct.value.product_id,
            quantity:
              selectedProduct.value.has_box && boxExport.value
                ? props.manageData.quantity * selectedProduct.value.inside_box
                : props.manageData.quantity,
          })
        : await useActionPut(`wasted/${props.id}`, {
            quantity:
              selectedProduct.value.has_box && boxExport.value
                ? props.manageData.quantity * selectedProduct.value.inside_box
                : props.manageData.quantity,
          });

    if (response.status == 200) {
      emit("refresh", { data: response, type: props.type });
      dialogContentVisible.value = false;
    } else {
      warning.value = t("tryagain");
    }
  } catch (thiserror) {
    warning.value = warning.value = t("tryagain");
  }
}

const dialogContentVisible = ref(false);

const { data: productData, status: productStatus } = await useGet("products");

function checkAndSetProduct() {
  if (props.manageData.product_id != 0 && productStatus.value == "success") {
    const unit = productData.value.data.find(
      (item: any) => item.product_id === props.manageData.product_id
    );

    if (unit) {
      selectedProduct.value = unit;
    }
  }
}

watch(
  () => dialogContentVisible.value,
  (newVal) => {
    if (newVal) {
      checkAndSetProduct();
      if (props.type == "add") {
        boxExport.value = false;
      }
    } else {
      props.manageData.quantity = 0;
    }
  }
);
</script>
