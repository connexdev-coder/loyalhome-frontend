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
            v-if="props.type == 'add'"
            label="employee_name"
            type="text"
            :icon="PRICE_ICON"
            placeholder="employee_name"
            api_route="employees"
            api_route_query="search"
            :result_fields="['employee_name']"
            :selectedValue="selectedEmployee"
            @on-change="
                  (data:any) => {
                    selectedEmployee = data;
                    props.manageData.employee_id = data.employee_id;
                  }
                "
            @clear="
              () => {
                selectedEmployee = null;
                manageData.employee_id = '';
              }
            "
            :disabled="selectedEmployee ? true : false"
          />

          <div
            v-if="selectedEmployee || props.type == 'update'"
            class="grid grid-cols-1 md:grid-cols-2 gap-2"
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

const selectedEmployee = ref<any>(null);

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
  const missingFields = ["from", "to"].filter(
    (field) => !props.manageData[field]?.length
  );
  if (!selectedEmployee.value && props.type == "add")
    missingFields.push("employee_id");
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
      ? await useActionPost("employee_offs", {
          ...props.manageData,
        })
      : await useActionPut(`employee_offs/${props.id}`, {
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
    valueField: "from",
    type: "datetime-local",
    icon: DATE_ICON,
  },
  {
    valueField: "to",
    type: "datetime-local",
    icon: DATE_ICON,
  },
  {
    valueField: "note",
    type: "text",
    icon: NOTE_ICON,
  },
];

function checkAndSetDefaults() {
  if (props.type == "add") return;
  if (props.manageData.employee_id) {
    selectedEmployee.value = {
      employee_id: props.manageData.employee_id,
      employee_name: props.manageData.employee_name,
    };
  }
}

watch(
  () => dialogContentVisible.value,
  (newVal) => {
    if (newVal) {
      checkAndSetDefaults();
    } else {
      props.manageData.employee_id = null;
      selectedEmployee.value = null;
    }
  }
);
</script>
