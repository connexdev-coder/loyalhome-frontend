<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger class="w-full">
      <div class="px-2 py-2 bg-orange-500 rounded-sm text-white">
        {{ props.title }}
      </div>
    </DialogTrigger>
    <DialogScrollContent class="max-w-[800px] flex flex-col">
      <slot />
    </DialogScrollContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const props = defineProps<{
  title: string;
}>();

const dialogContentVisible = ref(false);
</script>
