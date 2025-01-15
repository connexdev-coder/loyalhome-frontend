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
            v-if="selectedEmployee && props.type == 'add'"
            class="flex flex-col items-start gap-1"
            style="direction: rtl"
          >
            <span>
              {{ $t("employee_name") }}:
              {{ selectedEmployee.employee_name }}
            </span>
            <span>
              {{ $t("position") }}:
              {{ selectedEmployee.position }}
            </span>
            <span>
              {{ $t("salary_type") }}:
              {{ $t(selectedEmployee.salary_type) }}
            </span>
          </div>

          <!-- Set dolar price -->
          <div v-if="selectedEmployee" class="flex flex-row items-center gap-2">
            <div class="flex-1">
              <ComboBox
                label="dinar_price"
                type="text"
                :icon="PRICE_ICON"
                placeholder="dinar_price"
                api_route="dollar_prices"
                api_route_query="search"
                :result_fields="['dinar_price']"
                :selectedValue="selectedDollarPrice"
                @on-change="
                  (data:any) => {
                    selectedDollarPrice = data;
                    props.manageData.dollar_to_dinar_id = data.dollar_to_dinar_id;
                  }
                "
                @clear="
                  () => {
                    selectedDollarPrice = null;
                    manageData.dollar_to_dinar_id = '';
                  }
                "
                :disabled="selectedDollarPrice ? true : false"
              />
            </div>

            <div class="flex flex-col">
              <span class="text-md invisible">asd</span>
              <ManageDollarPrice
                title="add_dinar_price"
                :manage-data="{}"
                type="add"
                :id="0"
              >
                <div
                  class="bg-ten text-overTen h-10 w-10 flex items-center justify-center rounded-sm"
                >
                  <Icon :name="ADD_ICON" class="text-xl" />
                </div>
              </ManageDollarPrice>
            </div>
          </div>

          <div
            v-if="selectedDollarPrice"
            class="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            <OfflineSelect
              label="currency_type"
              placeholder="currency_type"
              :icon="TRANSACTION_ICON"
              :options="['dollar', 'dinar']"
              :selected-value="manageData"
              field="currency_type"
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

const selectedDollarPrice = ref<any>(null);

function validateFields() {
  const missingFields = ["amount", "currency_type"].filter(
    (field) => !props.manageData[field]?.length
  );
  if (!selectedEmployee.value && props.type == "add")
    missingFields.push("employee_id");
  if (!selectedDollarPrice.value) missingFields.push("dollar_to_dinar_id");
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
      ? await useActionPost("employee_payments", {
          ...props.manageData,
        })
      : await useActionPut(`employee_payments/${props.id}`, {
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
    valueField: "amount",
    type: "number",
    icon: DOLLAR_ICON,
  },
  {
    valueField: "note",
    type: "text",
    icon: NOTE_ICON,
  },
  {
    valueField: "created_at",
    type: "date",
    icon: DATE_ICON,
  },
];

function checkAndSetDefaults() {
  if (props.manageData.dollar_to_dinar_id) {
    selectedDollarPrice.value = {
      dollar_to_dinar_id: props.manageData.dollar_to_dinar_id,
      dinar_price: props.manageData.dinar_price,
    };
  }
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
      selectedDollarPrice.value = null;
      selectedEmployee.value = null;
    }
  }
);
</script>
