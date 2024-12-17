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
          {{ selectedUnit }}
          <ComboBox
            label="unit_name"
            type="text"
            icon="hugeicons:workflow-square-06"
            placeholder="unit_name"
            api_route="configs/units"
            api_route_query="search"
            :result_fields="['unit_name']"
            :selectedValue="props.manageData.unit_name"
            @on-change="(data) => (selectedUnit = data)"
            :disabled="selectedUnit ? true : false"
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
}>();

const selectedUnit = ref<any>(null);

function validateFields() {
  const missingFields = ["name", "price", "get_price", "sell_price"].filter(
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
      ? await useActionPost("managers", {
          ...props.manageData,
        })
      : await useActionPut(`managers/${props.manageData.manager_id}`, {
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
</script>
