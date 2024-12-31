<template>
  <div class="card flex items-stretch justify-center">
    <Dialog v-model:open="dialogOpen">
      <DialogTrigger>
        <slot />
      </DialogTrigger>

      <DialogContent class="max-w-sm">
        <DialogTitle class="flex flex-col items-center gap-2">
          <Icon :name="APPROVE_ICON" class="text-4xl text-ten" />
          <h1 class="text-center font-normal">{{ $t("approve_warning") }}</h1>
        </DialogTitle>

        <DialogDescription></DialogDescription>

        <div class="flex flex-col items-stretch gap-2 w-full">
          <button
            @click="dialogOpen = false"
            class="text-overSixty border-2 rounded-sm py-2 px-3 w-full"
          >
            {{ $t("cancel") }}
          </button>
          <button
            @click="deleteItem"
            class="bg-ten text-overTen rounded-sm py-2 px-3 w-full"
          >
            {{ $t("yes") }}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useActionPut } from "~/hooks/actionFetch";

const props = defineProps<{
  type: string;
  id: number;
  body: any;
}>();

const emit = defineEmits(["refresh"]);

const dialogOpen = ref(false);

async function deleteItem() {
  const response = await useActionPut(`${props.type}/${props.id}`, props.body);
  if (response.status == 200) {
    emit("refresh");
    dialogOpen.value = false;
  }
}
</script>
