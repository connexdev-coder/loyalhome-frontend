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

      <div class="h-[80vh] overflow-y-scroll">
        <form
          ref="dataForm"
          @submit.prevent="onManageClient"
          @keydown.enter.prevent="submitForm"
          class="flex flex-col gap-3"
        >
          <OfflineSelect
            label="spending_type"
            placeholder="spending_type"
            :icon="SPENDING_ICON"
            :options="['kar', 'bnchina']"
            :selected-value="manageData"
            field="spending_type"
          />

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
                props.manageData.dinar_price = data.dinar_price;

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

          <ComboBox
            label="factory_name"
            type="text"
            :icon="PRICE_ICON"
            placeholder="factory_name"
            api_route="configs/factories"
            api_route_query="search"
            :result_fields="['factory_name']"
            :selectedValue="selectedFactory"
            @on-change="
              (data:any) => {
                selectedFactory = data;
                props.manageData.factory_id = data.factory_id;
                props.manageData.factory_name = data.factory_name;

              }
            "
            @clear="
              () => {
                selectedFactory = null;
                manageData.client_id = '';
              }
            "
            :disabled="selectedFactory ? true : false"
          />

          <div
            class="grid grid-cols-2 gap-2"
            v-if="selectedFactory || props.type == 'update'"
          >
            <OfflineSelect
              label="currency_type"
              placeholder="currency_type"
              :icon="DOLLAR_ICON"
              :options="['dollar', 'dinar']"
              :selected-value="manageData"
              field="currency_type"
            />

            <AutoComplete
              label="spend_by"
              type="text"
              :icon="SPENDING_ICON"
              placeholder="spend_by"
              api_route="configs/spending?type=spend_by&"
              api_route_query="search"
              :result_fields="['spend_by']"
              :selectedValue="props.manageData"
              @on-change="
                (data:any) => {
                  props.manageData.spend_by = data.spend_by;
                }
              "
            />

            <AutoComplete
              label="spend_to"
              type="text"
              :icon="SPENDING_ICON"
              placeholder="spend_to"
              api_route="configs/spending?type=spend_to&"
              api_route_query="search"
              :result_fields="['spend_to']"
              :selectedValue="props.manageData"
              @on-change="
                (data:any) => {
                  props.manageData.spend_to = data.spend_to;
                }
              "
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

const { t } = useI18n();
const { toast } = useToast();

const dataForm = ref<any>("");

const props = defineProps<{
  title: string;
  type: string;
  manageData: any;
  id: any;
}>();

const selectedFactory = ref<any>(null);
const selectedDollarPrice = ref<any>(null);

function validateFields() {
  const missingFields = [
    "spending_type",
    "spend_to",
    "spend_by",
    "currency_type",
    "amount",
  ].filter(
    (field) => props.manageData[field] == null || props.manageData[field] === ""
  );
  if (!selectedFactory.value) missingFields.push("factory_id");
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
      ? await useActionPost("spendings", {
          ...props.manageData,
        })
      : await useActionPut(`spendings/${props.id}`, {
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
    icon: PRICE_ICON,
  },
  {
    valueField: "note",
    type: "text",
    icon: NOTE_ICON,
  },
];

function checkAndSetDefaults() {
  if (props.manageData.dollar_to_dinar_id) {
    selectedDollarPrice.value = {
      dollar_to_dinar_id: props.manageData.dollar_to_dinar_id,
      dinar_price: props.manageData.dinar_price,
    };
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
