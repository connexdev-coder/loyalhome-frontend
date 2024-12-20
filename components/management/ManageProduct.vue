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
            label="unit_name"
            type="text"
            icon="hugeicons:workflow-square-06"
            placeholder="unit_name"
            api_route="configs/units"
            api_route_query="search"
            :result_fields="['unit_name']"
            :selectedValue="selectedUnit"
            @on-change="
              (data) => {
                selectedUnit = data;
                props.manageData.unit_id = data.unit_id;
              }
            "
            @clear="
              () => {
                selectedUnit = null;
                props.manageData.unit_id = '';
              }
            "
            :disabled="selectedUnit ? true : false"
          />
          <ComboBox
            label="factory"
            type="text"
            icon="hugeicons:factory-02"
            placeholder="factory"
            api_route="configs/factories"
            api_route_query="search"
            :result_fields="['factory_name']"
            :selectedValue="selectedFactory"
            @on-change="
              (data) => {
                selectedFactory = data;
                props.manageData.factory_id = data.factory_id;
              }
            "
            @clear="
              () => {
                selectedFactory = null;
                props.manageData.factory_id = '';
              }
            "
            :disabled="selectedFactory ? true : false"
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

const selectedUnit = ref<any>(null);
const selectedFactory = ref<any>(null);

function validateFields() {
  const missingFields = ["name", "tag", "get_price", "sell_price"].filter(
    (field) => !props.manageData[field]?.length
  );

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
      ? await useActionPost("products", {
          ...props.manageData,
        })
      : await useActionPut(`products/${props.manageData.product_id}`, {
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
    valueField: "name",
    type: "text",
    icon: "hugeicons:user",
  },
  {
    valueField: "tag",
    type: "text",
    icon: "hugeicons:tags",
  },
  {
    valueField: "get_price",
    type: "number",
    icon: "hugeicons:dollar-01",
  },
  {
    valueField: "sell_price",
    type: "number",
    icon: "hugeicons:dollar-01",
  },
];

function checkAndSetDefaults() {
  if (props.manageData.unit_id) {
    selectedUnit.value = {
      unit_id: props.manageData.unit_id,
      unit_name: props.manageData.unit_name,
    };
  }
  if (props.manageData.factory_id) {
    selectedFactory.value = {
      factory_id: props.manageData.factory_id,
      factory_name: props.manageData.factory_name,
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
