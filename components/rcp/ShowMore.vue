<template>
  <div class="card flex items-stretch justify-center">
    <Dialog v-model:open="dialogOpen">
      <DialogTrigger>
        <slot />
      </DialogTrigger>

      <DialogContent class="max-w-sm">
        <DialogDescription></DialogDescription>

        <div v-if="props.data" class="flex flex-col items-stretch gap-2 w-full">
          <div v-for="(value, key) in JSON.parse(props.data)" :key="key">
            <strong>{{ $t(String(key)) }}:</strong> {{ value }}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const props = defineProps<{
  data: any;
}>();

const dialogOpen = ref(false);
</script>
