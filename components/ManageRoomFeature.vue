<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger>
      <div class="bg-ten text-white px-3 py-2 rounded-sm w-full">
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

      <div class="max-h-[300px] md:max-h-[500px] overflow-y-scroll">
        <form
          ref="dataForm"
          @submit.prevent="onManageDriver"
          class="flex flex-col gap-1"
        >
          <label for="">{{ $t("name") }}</label>
          <input
            type="text"
            v-model="manageData.room_feature_name"
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
import type { roomFeatureType } from "~/types/tableTypes";

const { t } = useI18n();

const warning = ref("");
const dataForm = ref<any>("");

const props = defineProps<{
  type: string;
  manageData: roomFeatureType;
  id: any;
}>();

function submitForm() {
  dataForm.value.dispatchEvent(new Event("submit"));
}

const emit = defineEmits(["refresh"]);

function validateFields() {
  let requiredFields = " ";
  if (props.manageData.room_feature_name.length == 0)
    requiredFields += " " + "Name";

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
        ? await useActionPost("room-features", {
            ...props.manageData,
          })
        : await useActionPut(`room-features/${props.id}`, {
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
