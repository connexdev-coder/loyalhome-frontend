<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger class="w-full">
      <slot />
    </DialogTrigger>
    <DialogContent class="max-w-[300px] flex flex-col">
      <h1 class="text-center">{{ $t("update_warning") }}</h1>

      <button @click="onQuickUpdte" class="bg-ten text-white rounded-sm py-2">
        {{ $t("yes") }}
      </button>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useActionPut } from "~/hooks/actionFetch";

const props = defineProps<{
  path: string;
  id: number;
}>();

const emit = defineEmits(["refresh"]);

async function onQuickUpdte() {
  const response = await useActionPut(`${props.path}`, {});

  if (response.status == 200) {
    dialogContentVisible.value = false;
    emit("refresh");
  }
}

const dialogContentVisible = ref(false);
</script>
