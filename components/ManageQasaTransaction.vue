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
          @submit.prevent="onManageCompanyPayment"
          class="flex flex-col gap-1"
        >
          <label for="">{{ $t("transaction_type") }}</label>
          <select
            v-model="props.manageData.is_deposit"
            class="px-2 py-2 border-[1px] rounded-sm"
          >
            <option :value="true">{{ $t("deposit") }}</option>
            <option :value="false">{{ $t("withdraw") }}</option>
          </select>

          <label for="">{{ $t("money_amount") }} </label>
          <input
            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
            type="number"
            v-model="manageData.amount"
            class="px-2 py-2 border-[1px] rounded-sm"
          />

          <label for="">{{ $t("getter") }}</label>
          <input
            type="text"
            v-model="manageData.getter"
            class="px-2 py-2 border-[1px] rounded-sm"
          />

          <label for="">{{ $t("setter") }}</label>
          <input
            type="text"
            v-model="manageData.setter"
            class="px-2 py-2 border-[1px] rounded-sm"
          />

          <label for="">{{ $t("note") }}</label>
          <input
            type="text"
            v-model="manageData.note"
            class="px-2 py-2 border-[1px] rounded-sm"
          />

          <input
            id="dropzone-files"
            type="file"
            multiple
            @change="onFilesChange"
            accept="image/*, application/pdf"
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
import { useUpload } from "~/hooks/fetch";
import type { qasaTransactionType } from "~/types/tableTypes";

const { t } = useI18n();

const warning = ref("");
const dataForm = ref<any>("");

const props = defineProps<{
  type: string;
  manageData: qasaTransactionType;
  id: any;
}>();

const emit = defineEmits(["refresh"]);

function submitForm() {
  dataForm.value.dispatchEvent(new Event("submit"));
}

function validateFields() {
  let requiredFields = " ";
  if (props.manageData.amount == 0) requiredFields += " " + "amount";
  if (props.manageData.getter == "") requiredFields += " " + "getter";
  if (props.manageData.setter == "") requiredFields += " " + "setter";

  if (requiredFields == " ") return true;
  warning.value = requiredFields;
  return false;
}

const selectedFile = ref<File | null>(null);

async function onManageCompanyPayment() {
  warning.value = "";
  const isValid = validateFields();

  if (!isValid) return;

  // Upload selected images
  let uploadedImage = null;
  if (selectedFile.value != null) {
    const { data: uploadData, status: uploadStatus }: any = await useUpload(
      "files/upload",
      selectedFile.value
    );

    if (uploadStatus.value != "success") {
      warning.value = "All images are required";
      return;
    }

    uploadedImage = uploadData.value.data;
  }

  try {
    const response =
      props.type == "add"
        ? await useActionPost("box_invoices", {
            ...props.manageData,
            invoice_img: uploadedImage,
          })
        : await useActionPut(`box_invoices/${props.id}`, {
            ...props.manageData,
          });

    if (response.status == 200) {
      emit("refresh");
      dialogContentVisible.value = false;
    } else {
      warning.value = t("tryagain");
    }
  } catch (error) {
    warning.value = warning.value = t("tryagain");
  }
}

const dialogContentVisible = ref(false);

function onFilesChange(event: Event) {
  if (!event.target) return;

  const inputElement = event.target as HTMLInputElement;
  const files = Array.from(inputElement.files || []);

  if (files.length === 0) return;

  // Get the first file only
  const file = files[0];

  // Check if the file is an image or a PDF
  if (!(file.type.startsWith("image/") || file.type === "application/pdf")) {
    warning.value = "Only images and PDFs are allowed";
    return;
  }

  warning.value = "";
  selectedFile.value = file;
}
</script>
