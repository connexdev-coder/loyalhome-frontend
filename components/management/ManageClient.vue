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
    "firstname",
    // "lastname",
    "phone",
    // "extra_phone",
    // "relative_name",
    // "relative_phone",
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
      ? await useActionPost("clients", {
          ...props.manageData,
        })
      : await useActionPut(`clients/${props.manageData.client_id}`, {
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
    valueField: "contract_number",
    type: "text",
    icon: "hugeicons:document-validation",
  },
  {
    valueField: "firstname",
    type: "text",
    icon: "hugeicons:user",
  },
  // {
  //   valueField: "lastname",
  //   type: "text",
  //   icon: "hugeicons:user",
  // },
  {
    valueField: "phone",
    type: "text",
    icon: "hugeicons:call",
  },
  {
    valueField: "extra_phone",
    type: "text",
    icon: "hugeicons:call",
  },
  {
    valueField: "location",
    type: "text",
    icon: "hugeicons:flow-connection",
  },
  {
    valueField: "relative_name",
    type: "text",
    icon: "hugeicons:flow-connection",
  },
  {
    valueField: "relative_phone",
    type: "text",
    icon: "hugeicons:call",
  },
];
</script>
