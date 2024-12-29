<template>
  <div class="flex flex-col items-stretch gap-1 w-full">
    <label for="contract_file" class="text-sm font-bold">
      {{ $t("contract_file") }}
    </label>
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-ten transition-colors cursor-pointer"
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleFileDrop"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        @change="handleFileSelect"
        accept=".pdf,.doc,.docx"
      />

      <div class="flex flex-col items-center gap-2">
        <Icon
          :name="selectedFile ? 'material-symbols:file-present' : CONTRACT_ICON"
          class="text-3xl text-ten"
        />
        <div class="text-center">
          <p v-if="!selectedFile" class="text-gray-500">
            {{ $t("drag_drop_or_click") }}
          </p>
          <p v-else class="text-ten font-medium">
            {{ selectedFile.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  selectedFile: any;
}>();

const emit = defineEmits(["update:selectedFile"]);

const fileInput = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileDrop(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (files && files.length) {
    emit("update:selectedFile", files[0]);
    if (fileInput.value) {
      fileInput.value.files = files;
    }
    handleFileSelect();
  }
}

function handleFileSelect() {
  if (fileInput.value?.files?.length) {
    emit("update:selectedFile", fileInput.value.files[0]);
  }
}
</script>
