<template>
  <div class="card flex items-stretch justify-center">
    <Dialog v-model:open="dialogOpen">
      <DialogTrigger>
        <slot />
      </DialogTrigger>

      <DialogContent class="max-w-sm">
        <DialogTitle class="flex flex-col items-center gap-2">
          <Icon name="hugeicons:delete-02" class="text-4xl text-destructive" />
          <h1 class="text-center font-normal">{{ $t("delete_warning") }}</h1>
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
            class="bg-red-500 text-white rounded-sm py-2 px-3 w-full"
          >
            {{ $t("delete") }}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useActionDelete } from "~/hooks/actionFetch";

const props = defineProps<{
  type: string;
  id: number;
}>();

const emit = defineEmits(["refresh"]);

const dialogOpen = ref(false);

async function deleteItem() {
  const response = await useActionDelete(`${props.type}/${props.id}`);
  if (response.status == 200) {
    emit("refresh");
    dialogOpen.value = false;
  }
}
</script>
