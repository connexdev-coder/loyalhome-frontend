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
          class="flex flex-col gap-3"
        >
          <ComboBox
            label="product_name"
            type="text"
            icon="hugeicons:workflow-square-06"
            placeholder="product_name"
            api_route="products"
            api_route_query="search"
            :result_fields="['product_name']"
            :selectedValue="selectedProduct"
            @on-change="
              (data) => {
                selectedProduct = data;
                props.manageData.product_id = data.product_id;
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

          <Input
            v-for="input in inputs"
            :label="input.valueField"
            :value="props.manageData"
            :value-field="input.valueField"
            :type="input.type"
            :icon="input.icon"
            :placeholder="input.valueField"
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useActionPost, useActionPut } from "~/hooks/actionFetch";
import { useToast } from "./ui/toast";
import Input from "./rcp/Input.vue";
import ComboBox from "./rcp/ComboBox.vue";

const { t } = useI18n();
const { toast } = useToast();

const dataForm = ref<any>("");

const props = defineProps<{
  title: string;
  type: string;
  manageData: any;
  id: any;
  invoice_id: any;
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
      ? await useActionPost("import_product", {
          ...props.manageData,
          import_invoice_id: props.invoice_id,
        })
      : await useActionPut(`import_product/${props.id}`, {
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
    icon: "hugeicons:user",
  },
  {
    valueField: "quantity",
    type: "number",
    icon: "hugeicons:tags",
  },
  {
    valueField: "note",
    type: "text",
    icon: "hugeicons:note-04",
  },
];

function checkAndSetUnit() {
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
      checkAndSetUnit();
    }
  }
);
</script>
