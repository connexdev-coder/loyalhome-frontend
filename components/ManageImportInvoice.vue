<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent class="max-w-full max-h-screen">
      <DialogHeader>
        <DialogTitle>
          <h1 class="text-2xl font-bold">
            {{ $t("import_invoice") }}
          </h1>
        </DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <div class="overflow-y-scroll h-screen flex flex-col items-stretch gap-6">
        <!-- Creat invoice -->
        <div
          v-if="createdInvoice == null"
          class="flex flex-row items-end gap-1 w-full"
        >
          <!-- Company -->
          <div class="flex flex-col items-start gap-1">
            <label for="" class="text-[16px]">{{ $t("company") }}</label>
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
                    props.manageData.company_id = 0;
                  }
                "
                class="cursor-pointer absolute right-0 top-0 w-6 bottom-0 text-red-500 p-1 rounded-sm flex items-center justify-center"
              >
                <img src="/assets/icons/close.svg" class="" alt="" />
              </div>
            </div>
          </div>

          <div class="flex flex-col text-md">
            <label for="">{{ $t("custom_invoice_number") }}</label>
            <input
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              type="text"
              v-model="props.manageData.invoice_number"
              class="px-2 py-2 border-[1px] rounded-sm"
            />
          </div>

          <div class="flex flex-col text-md">
            <label for="">{{ $t("gender") }}</label>
            <select
              v-model="props.manageData.is_cash"
              class="px-2 py-2 border-[1px] rounded-sm"
            >
              <option :value="true">{{ $t("cash") }}</option>
              <option :value="false">{{ $t("owing") }}</option>
            </select>
          </div>

          <input
            id="dropzone-files"
            type="file"
            multiple
            @change="onFilesChange"
            accept="image/*, application/pdf"
          />

          <button
            @click="onManageClient"
            class="bg-ten text-sixty rounded-sm py-2 px-2"
          >
            {{ $t("add_invoice") }}
          </button>
        </div>

        <!-- Create Invoice Result -->
        <ImportInvoiceProducts
          v-if="createdInvoice != null"
          :id="createdInvoice.import_invoice_id"
          @close="dialogContentVisible = false"
          :company="selectedCompany"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useActionPost, useActionPut } from "~/hooks/actionFetch";
import { useGet, useUpload } from "~/hooks/fetch";
import type { importInvoiceType } from "~/types/tableTypes";

const invoiceData = ref(null);
const invoiceStatus = ref(null);

const warning = ref("");

const selectedCompany = ref<any>(null);
function onCompanySelected(newItem: any) {
  selectedCompany.value = newItem;
  if (selectedCompany.value == null) return;
  props.manageData.company_id = selectedCompany.value.company_id;
}

const props = defineProps<{
  type: string;
  manageData: importInvoiceType;
  id: any;
}>();

const emit = defineEmits(["refresh"]);

const createdInvoice = ref<any>(null);

const selectedFile = ref<File | null>(null);

async function onManageClient() {
  warning.value = "";

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
        ? await useActionPost("import_invoices", {
            ...props.manageData,
            image: uploadedImage,
          })
        : await useActionPut(
            `import_invoices/${props.manageData.import_invoice_id}`,
            {
              ...props.manageData,
            }
          );

    if (response.status == 200) {
      if (response.data.length > 0) {
        createdInvoice.value = response.data[0];
        fetchInvoices();
      }
    } else {
      warning.value = "An error occurred, please try again";
    }
  } catch (error) {
    warning.value = "An error occurred, please try again";
  }
}

async function fetchInvoices() {
  if (createdInvoice.value == null) return;

  const { data: clientData, status: clientStatus }: any = await useGet(
    `import_invoices/${createdInvoice.value.import_invoice_id}`
  );

  invoiceData.value = clientData.value;
  invoiceStatus.value = clientStatus.value;
}

fetchInvoices();

const dialogContentVisible = ref(false);

const { data: companyData, status: companyStatus } = await useGet("companies");

function checkAndSetCompany() {
  if (props.manageData.company_id != 0 && companyStatus.value == "success") {
    const company = companyData.value.data.find(
      (item: any) => item.company_id === props.manageData.company_id
    );

    if (company) {
      selectedCompany.value = company;
    }
  }
}

watch(
  () => dialogContentVisible.value,
  (newVal) => {
    if (newVal) {
      if (props.type == "update") {
        createdInvoice.value = props.manageData;
      }
      checkAndSetCompany();
    } else {
      createdInvoice.value = null;
      emit("refresh");
    }
  }
);

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
