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
          <!-- Set dolar price -->
          <div class="flex flex-row items-center gap-2">
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
                    changeMaxValue()
                  }
                "
                @clear="
                  () => {
                    selectedDollarPrice = null;
                    manageData.client_id = '';
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

          <div class="bg-dollar text-white px-2 py-1 rounded-sm">
            <span class="text-md"
              >{{ $t("total_remaining") }}: {{ maxAmount }}
              {{ $t(props.manageData.currency_type) }}</span
            >
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
              @on-change="changeMaxValue"
            />

            <Input
              v-for="input in inputs"
              :label="input.valueField"
              :value="props.manageData"
              :value-field="input.valueField"
              :type="input.type"
              :icon="input.icon"
              :placeholder="input.valueField"
              :max-value="input.valueField == 'amount' ? maxAmount : null"
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

const { t } = useI18n();
const { toast } = useToast();

const dataForm = ref<any>("");

const props = defineProps<{
  title: string;
  type: string;
  manageData: any;
  id: any;
  max: any;
}>();

const selectedDollarPrice = ref<any>(null);
const maxAmount = ref<any>(props.max);

function validateFields() {
  const missingFields = ["amount", "currency_type"].filter(
    (field) => !props.manageData[field]?.length
  );

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
      ? await useActionPost("company_depts", {
          ...props.manageData,
        })
      : await useActionPut(`company_depts/${props.manageData.id}`, {
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
    max: props.manageData.max,
  },
  {
    valueField: "note",
    type: "text",
    icon: NOTE_ICON,
    max: null,
  },
];

function checkAndSetDefaults() {
  if (props.manageData.dollar_to_dinar_id) {
    selectedDollarPrice.value = {
      dollar_to_dinar_id: props.manageData.dollar_to_dinar_id,
      dinar_price: props.manageData.dinar_price,
    };
  }
}

watch(
  () => dialogContentVisible.value,
  (newVal) => {
    if (newVal) {
      checkAndSetDefaults();
      changeMaxValue();
    } else {
      props.manageData.dollar_to_dinar_id = null;
      selectedDollarPrice.value = null;
      maxAmount.value = 0;
    }
  }
);

function changeMaxValue() {
  if (props.manageData.currency_type == "dinar") {
    if (selectedDollarPrice.value) {
      maxAmount.value = props.max * selectedDollarPrice.value.dinar_price;
    }
  } else {
    maxAmount.value = props.max;
  }
}
</script>
