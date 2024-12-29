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
            label="client_name"
            type="text"
            :icon="CLIENT_ICON"
            placeholder="client_name"
            api_route="clients"
            api_route_query="search"
            :result_fields="['client_name']"
            :selectedValue="selectedClient"
            @on-change="
            (data:any) => {
              selectedClient = data;
              props.manageData.client_id = data.client_id;
              props.manageData.client_name = data.client_name;

            }
        "
            @clear="
              () => {
                selectedClient = null;
                manageData.client_id = '';
              }
            "
            :disabled="selectedClient ? true : false"
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

          <UploadInput
            :selectedFile="selectedFile"
            @update:selectedFile="updateSelectedFile"
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
import { useUpload } from "~/hooks/fetch";

const selectedClient = ref<any>(null);
const selectedFile = ref<any>(null);

function updateSelectedFile(file: File) {
  selectedFile.value = file;
}

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
  const missingFields = ["contract_name"].filter(
    (field) => !props.manageData[field]?.length
  );
  if (!selectedClient.value) missingFields.push("client_id");
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
  let uploadedFile;
  if (selectedFile.value) {
    const { data: uploadData, status: uploadStatus }: any = await useUpload(
      "files/upload",
      selectedFile.value
    );

    console.log(uploadData);

    if (uploadStatus.value == "success") {
      uploadedFile = uploadData.value.data;
      props.manageData.contract_file = uploadedFile;
    } else {
      toast({
        title: t("upload_failed"),
        variant: "destructive",
      });
      return;
    }
  }

  const response =
    props.type == "add"
      ? await useActionPost("client_contracts", {
          ...props.manageData,
        })
      : await useActionPut(`client_contracts/${props.manageData.client_id}`, {
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
    valueField: "contract_name",
    type: "text",
    icon: CONTRACT_ICON,
  },
  {
    valueField: "note",
    type: "text",
    icon: NOTE_ICON,
  },
];
</script>
