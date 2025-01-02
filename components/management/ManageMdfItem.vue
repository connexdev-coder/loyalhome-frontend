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
          @submit.prevent="onManageData"
          @keydown.enter.prevent="submitForm"
          class="flex flex-col gap-3"
        >
          <div class="grid grid-cols-2 gap-2">
            <Input
              v-for="input in inputs"
              :label="input.valueField"
              :value="props.manageData"
              :value-field="input.valueField"
              :type="input.type"
              :icon="input.icon"
              :placeholder="input.valueField"
            />
          </div>

          <div class="flex flex-row gap-2">
            <div class="flex-1">
              <Input
                label="extra_price"
                :value="props.manageData"
                value-field="extra_price"
                type="text"
                :icon="DOLLAR_ICON"
                placeholder="extra_price"
              />
            </div>
            <div @click="getMonthSpending" class="flex flex-col cursor-pointer">
              <span class="text-md invisible">asd</span>
              <div
                class="bg-dollar text-white h-10 w-10 flex items-center justify-center rounded-sm"
              >
                <Icon :name="CALCULATE_ICON" class="text-2xl" />
              </div>
            </div>
          </div>
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
import { useGet } from "~/hooks/fetch";

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

function validateFields() {
  const missingFields = ["extra_price", "item_name", "quantity"].filter(
    (field) => props.manageData[field] == null || props.manageData[field] === ""
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

async function onManageData() {
  const response =
    props.type == "add"
      ? await useActionPost("mdf_sale_items", {
          ...props.manageData,
          mdf_sale_id: props.invoice_id,
        })
      : await useActionPut(`mdf_sale_items/${props.id}`, {
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
    valueField: "item_name",
    type: "text",
    icon: PRODUCT_ICON,
  },
  {
    valueField: "discount",
    type: "number",
    icon: DISCOUNT_ICON,
  },
  {
    valueField: "quantity",
    type: "number",
    icon: PRODUCT_ICON,
  },
  {
    valueField: "note",
    type: "text",
    icon: NOTE_ICON,
  },
];

async function getMonthSpending() {
  const { data, status } = await useGet("reports/month_spending");
  if (status.value == "success") {
  }
  props.manageData.extra_price = data;
}
</script>
