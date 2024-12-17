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
          <label for="" class="text-md">{{ $t("company_name") }}</label>
          <div class="relative">
            <SearchComponent
              class="w-full h-full"
              path="companies"
              @on-select="onCompanySelected"
              :selected-value="
                selectedCompany != null ? selectedCompany.company_name : ''
              "
              name-field="company_name"
              :disabled="selectedCompany != null"
            />
            <div
              v-if="selectedCompany != null"
              @click="
                () => {
                  selectedCompany = null;
                }
              "
              class="cursor-pointer absolute right-0 top-0 bottom-0 text-red-500 px-1 py-2 rounded-sm h-10 w-10 flex items-center justify-center"
            >
              X
            </div>
          </div>

          <div
            v-if="selectedCompany != null"
            class="flex flex-col items-stretch gap-2"
          >
            <label for=""
              >{{ $t("money_amount") }} ({{
                selectedCompany.owing_amount
              }})</label
            >
            <input
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              @input="handleInput"
              type="number"
              v-model="manageData.amount_paid"
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
          </div>
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
import type { companyPaymentType, spendingType } from "~/types/tableTypes";

const selectedCompany = ref<any>(null);
function onCompanySelected(newItem: any) {
  selectedCompany.value = newItem;
  if (selectedCompany.value == null) return;
  props.manageData.company_id = selectedCompany.value.company_id;
}

const { t } = useI18n();

const warning = ref("");
const dataForm = ref<any>("");

const props = defineProps<{
  type: string;
  manageData: companyPaymentType;
  id: any;
}>();

function submitForm() {
  dataForm.value.dispatchEvent(new Event("submit"));
}

const emit = defineEmits(["refresh", "categorySelected"]);

function validateFields() {
  let requiredFields = " ";
  if (props.manageData.company_id == 0) requiredFields += " " + "company";
  if (props.manageData.amount_paid == 0) requiredFields += " " + "price";

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
        ? await useActionPost("companies/payments", {
            ...props.manageData,
            image: uploadedImage,
          })
        : await useActionPut(`companies/payments/${props.id}`, {
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

function handleInput(event: any) {
  event.target.value = event.target.value.replace(/[^0-9]/g, "");
  props.manageData.amount_paid = event.target.value;

  if (selectedCompany.value == null) return;

  let max = null;

  // without box
  if (selectedCompany.value != null) {
    max = parseInt(selectedCompany.value.owing_amount);
  }

  if (max == null) return;

  if (props.manageData.amount_paid > max) {
    props.manageData.amount_paid = max;
  } else if (props.manageData.amount_paid < 0) {
    props.manageData.amount_paid = 0;
  }
}
</script>
