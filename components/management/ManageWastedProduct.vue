<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <h1 class="text-xl">{{ $t(props.title) }}</h1>
        </DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <div class="h-[300px] overflow-y-scroll">
        <form
          ref="dataForm"
          @submit.prevent="onManageClient"
          @keydown.enter.prevent="submitForm"
          class="flex flex-col gap-3"
        >
          <ComboBox
            label="product_name"
            type="text"
            :icon="PRODUCT_ICON"
            placeholder="product_name"
            api_route="products"
            api_route_query="search"
            :result_fields="['product_name']"
            :selectedValue="selectedProduct"
            @on-change="
              (data) => {
                selectedProduct = data;
                props.manageData.product_id = data.product_id;
                props.manageData.get_price = data.get_price;
              }
            "
            @clear="
              () => {
                selectedProduct = null;
                props.manageData.product_id = '';
              }
            "
            :disabled="selectedProduct ? true : false"
          />

          <div
            v-if="props.type == 'add' && selectedProduct"
            class="bg-inventory text-white px-2 py-1 rounded-sm"
          >
            <span>
              {{ $t("available_quantity") }}:
              {{ selectedProduct.inventory_quantity }}</span
            >
          </div>

          <Input
            v-for="input in inputs"
            :label="input.valueField"
            :value="props.manageData"
            :value-field="input.valueField"
            :type="input.type"
            :icon="input.icon"
            :placeholder="input.valueField"
            :max-value="
              input.valueField == 'quantity' && selectedProduct
                ? selectedProduct.inventory_quantity
                : undefined
            "
          />
        </form>
      </div>

      <button
        @click="submitForm"
        class="bg-ten text-white rounded-sm py-2 px-3 w-full"
      >
        {{ $t("submit") }}
      </button>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import { useActionPost, useActionPut } from "~/hooks/actionFetch";
import { useToast } from "../ui/toast";

const { t } = useI18n();
const { toast } = useToast();

const dataForm = ref<any>("");

const props = defineProps<{
  title: string;
  type: string;
  manageData: any;
  id: any;
}>();

const selectedProduct = ref<any>(null);

function validateFields() {
  const missingFields = ["get_price", "quantity"].filter(
    (field) => props.manageData[field] == null || props.manageData[field] === ""
  );
  if (!selectedProduct.value) missingFields.push("product_id");
  return missingFields;
}

function submitForm() {
  const missingFields = validateFields();
  if (missingFields.length > 0) {
    toast({
      title: `Missing fields: ${missingFields.join(", ")}`,
      variant: "destructive",
    });
    return;
  }
  dataForm.value.dispatchEvent(new Event("submit"));
}

const emit = defineEmits(["refresh"]);

async function onManageClient() {
  const response =
    props.type == "add"
      ? await useActionPost("waste_product", {
          ...props.manageData,
        })
      : await useActionPut(`waste_product/${props.id}`, {
          ...props.manageData,
        });

  if (response.status == 200) {
    emit("refresh");
    dialogContentVisible.value = false;
    return;
  }
  toast({
    title: t("tryagain"),
    variant: "destructive",
  });
}

const dialogContentVisible = ref(false);

const inputs = [
  {
    valueField: "get_price",
    type: "number",
    icon: PRICE_ICON,
  },
  {
    valueField: "quantity",
    type: "number",
    icon: "hugeicons:tags",
  },
  {
    valueField: "note",
    type: "text",
    icon: NOTE_ICON,
  },
];

function checkAndSetDefaults() {
  if (props.type == "add") return;
  if (props.manageData.product_id) {
    selectedProduct.value = {
      product_id: props.manageData.product_id,
      product_name: props.manageData.product_name,
    };
  }
}

watch(
  () => dialogContentVisible.value,
  (newVal) => {
    if (newVal) {
      checkAndSetDefaults();
    }
  }
);
</script>
