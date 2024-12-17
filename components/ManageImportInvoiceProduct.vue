<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger>
      <div class="bg-ten text-sixty text-md px-3 py-2 rounded-sm w-full">
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

      <div class="h-[300px] overflow-y-scroll">
        <form
          ref="dataForm"
          @submit.prevent="onManageClient"
          class="flex flex-col gap-1"
        >
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

          <div v-if="selectedProduct != null" class="flex flex-col gap-1">
            <label v-if="selectedProduct.has_box" for="">
              {{ selectedProduct.unit_box }}
            </label>
            <input
              v-if="selectedProduct.has_box"
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              type="text"
              v-model="props.manageData.box_quantity"
              class="px-2 py-2 border-[1px] rounded-sm"
            />

            <label for=""> {{ selectedProduct.unit_name }}</label>
            <input
              :disabled="
                selectedProduct.inside_box != 0 &&
                selectedProduct.has_box == true
              "
              :class="
                selectedProduct.inside_box != 0 &&
                selectedProduct.has_box == true
                  ? 'opacity-50'
                  : ''
              "
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              type="text"
              v-model="props.manageData.quantity"
              class="px-2 py-2 border-[1px] rounded-sm"
            />

            <label v-if="selectedProduct.has_box" for="">
              {{ $t("price") }} {{ selectedProduct.unit_box }}
            </label>
            <input
              v-if="selectedProduct.has_box"
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              type="text"
              v-model="props.manageData.price_box"
              class="px-2 py-2 border-[1px] rounded-sm"
              @change="
                () => {
                  props.manageData.price =
                    props.manageData.price_box / props.manageData.quantity;
                }
              "
            />

            <label for="">
              {{ $t("price") }} {{ selectedProduct.unit_name }}
            </label>
            <input
              v-if="!selectedProduct.has_box"
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              type="text"
              v-model="props.manageData.price"
              class="px-2 py-2 border-[1px] rounded-sm"
              :class="selectedProduct.has_box ? 'opacity-50' : ''"
            />
            <div
              v-if="selectedProduct.has_box"
              class="px-2 py-2 border-[1px] opacity-50 rounded-sm"
            >
              {{
                (
                  props.manageData.price_box / props.manageData.quantity
                ).toLocaleString()
              }}
            </div>
          </div>
        </form>
      </div>

      <h1 class="text-red-500">{{ warning }}</h1>

      <button
        @click="submitForm"
        class="bg-ten text-sixty rounded-sm py-2 px-3 w-full"
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
import type { importInvoiceProductType } from "~/types/tableTypes";

const selectedProduct = ref<any>(null);
function onProductSelected(newItem: any) {
  selectedProduct.value = newItem;
  if (selectedProduct.value == null) return;

  if (selectedProduct.value.has_box && selectedProduct.value.inside_box != 0) {
    props.manageData.quantity = selectedProduct.value.inside_box;
  }
}

const warning = ref("");
const dataForm = ref<any>("");

const props = defineProps<{
  type: string;
  manageData: importInvoiceProductType;
  id: any;
}>();

function submitForm() {
  dataForm.value.dispatchEvent(new Event("submit"));
}

const emit = defineEmits(["refresh"]);

function validateFields() {
  let requiredFields = " ";
  if (props.manageData.import_invoice_id < 1)
    requiredFields += " " + "invoice_number";
  if (props.manageData.price < 0) requiredFields += " " + "price";
  if (props.manageData.price_box < 0) requiredFields += " " + "box_price";
  if (props.manageData.quantity < 0) requiredFields += " " + "quantity";
  if (props.manageData.box_quantity < 0) requiredFields += " " + "box_quantity";
  if (props.manageData.product_id < 0) requiredFields += " " + "product";

  if (requiredFields == " ") return true;
  warning.value = requiredFields;
  return false;
}

async function onManageClient() {
  warning.value = "";

  const isValid = validateFields();

  if (!isValid) return;

  try {
    const response =
      props.type == "add"
        ? await useActionPost("import_invoices/product", {
            ...props.manageData,
            product_id: selectedProduct.value.product_id,
          })
        : await useActionPut(`import_invoices/product/${props.id}`, {
            quantity: props.manageData.quantity,
            box_quantity: props.manageData.box_quantity,
            price: props.manageData.price,
            price_box: props.manageData.price_box,
          });

    if (response.status == 200) {
      emit("refresh", { data: response, type: props.type });
      dialogContentVisible.value = false;
    } else {
      warning.value = "An error occurred, please try again";
    }
  } catch (error) {
    warning.value = "An error occurred, please try again";
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

      if (
        selectedProduct.value.has_box &&
        selectedProduct.value.inside_box != 0
      ) {
        props.manageData.quantity = selectedProduct.value.inside_box;
      }
    }
  }
}

watch(
  () => dialogContentVisible.value,
  (newVal) => {
    if (newVal) {
      checkAndSetProduct();
    } else {
      selectedProduct.value = null;
      props.manageData.price = 0;
      props.manageData.price_box = 0;
      props.manageData.quantity = 0;
      props.manageData.box_quantity = 0;
      props.manageData.product_id = 0;
    }
  }
);
</script>
