<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger>
      <div class="bg-ten text-white px-3 py-2 rounded-sm w-full text-md">
        <slot />
      </div>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <h1 class="text-center font-bold"><slot /></h1>
        </DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <div class="h-[350px] overflow-y-scroll flex flex-col gap-2 py-2">
        <form
          ref="dataForm"
          @submit.prevent="onManageDriver"
          class="flex flex-col gap-1"
        >
          <label v-if="props.type == 'add'" for="">
            {{ $t("spend_type") }}
          </label>
          <SearchOptions
            v-if="props.type == 'add'"
            class="w-full h-full"
            path="settings/spending_types"
            :selected-value="props.manageData.spend_type"
            name-field="spend_type"
            :disabled="false"
            @on-select="onNewSearchOption"
          />

          <label v-if="props.type == 'add'" for="">{{ $t("spend_by") }}</label>
          <SearchOptions
            v-if="props.type == 'add'"
            class="w-full h-full"
            path="settings/spending_spenders"
            :selected-value="props.manageData.spend_by"
            name-field="spend_by"
            :disabled="false"
            @on-select="onNewSearchOption"
          />

          <label v-if="props.type == 'add'" for="">{{ $t("getter") }}</label>
          <SearchOptions
            v-if="props.type == 'add'"
            class="w-full h-full"
            path="settings/spending_getters"
            :selected-value="props.manageData.getter"
            name-field="getter"
            :disabled="false"
            @on-select="onNewSearchOption"
          />

          <label for="">{{ $t("spend_price") }}</label>
          <input
            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
            type="text"
            v-model="manageData.spend_price"
            class="px-2 py-2 border-[1px] rounded-sm"
          />

          <label for="">{{ $t("note") }}</label>
          <input
            type="text"
            v-model="manageData.note"
            class="px-2 py-2 border-[1px] rounded-sm"
          />
        </form>
      </div>

      <h1 class="text-red-500">{{ warning }}</h1>

      <button
        @click="submitForm"
        class="bg-ten text-white rounded-sm py-2 px-3 w-full"
      >
        <slot />
      </button>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useActionPost, useActionPut } from "~/hooks/actionFetch";
import type { spendingType } from "~/types/tableTypes";

const { t } = useI18n();

const warning = ref("");
const dataForm = ref<any>("");

const props = defineProps<{
  type: string;
  manageData: spendingType;
  id: any;
}>();

function submitForm() {
  dataForm.value.dispatchEvent(new Event("submit"));
}

const emit = defineEmits(["refresh", "categorySelected"]);

function onNewSearchOption(field: string, option: any) {
  props.manageData[field] = option;
}

function validateFields() {
  let requiredFields = " ";
  if (props.manageData.spend_price < 0) requiredFields += " " + "price";
  if (props.manageData.spend_type.length == 0) requiredFields += " " + "type";
  if (props.manageData.getter.length == 0) requiredFields += " " + "getter";
  if (props.manageData.spend_by.length == 0) requiredFields += " " + "by";

  if (requiredFields == " ") return true;
  warning.value = requiredFields;
  return false;
}

async function onManageDriver() {
  warning.value = "";
  const isValid = validateFields();

  if (!isValid) return;

  try {
    const response =
      props.type == "add"
        ? await useActionPost("spendings", {
            ...props.manageData,
          })
        : await useActionPut(`spendings/${props.id}`, {
            ...props.manageData,
          });

    if (response.status == 200) {
      emit("refresh", { data: response, type: props.type });
      dialogContentVisible.value = false;
    } else {
      warning.value = t("tryagain");
    }
  } catch (error) {
    warning.value = warning.value = t("tryagain");
  }
}

const dialogContentVisible = ref(false);
</script>
