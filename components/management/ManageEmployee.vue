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
          <Input
            v-for="input in inputs"
            :label="input.valueField"
            :value="props.manageData"
            :value-field="input.valueField"
            :type="input.type"
            :icon="input.icon"
            :placeholder="input.valueField"
          />

          <OfflineSelect
            label="salary_type"
            placeholder="salary_type"
            :icon="TRANSACTION_ICON"
            :options="['weekly', 'daily']"
            :selected-value="manageData"
            field="salary_type"
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

function validateFields() {
  const missingFields = [
    "name",
    "phone",
    "position",
    "salary_type",
    "salary",
  ].filter((field) => !props.manageData[field]?.length);

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
      ? await useActionPost("employees", {
          ...props.manageData,
        })
      : await useActionPut(`employees/${props.manageData.employee_id}`, {
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
    valueField: "phone",
    type: "number",
    icon: "hugeicons:call",
  },
  {
    valueField: "position",
    type: "text",
    icon: "hugeicons:flow-connection",
  },
  {
    valueField: "salary",
    type: "number",
    icon: "hugeicons:dollar-02",
  },
];
</script>
