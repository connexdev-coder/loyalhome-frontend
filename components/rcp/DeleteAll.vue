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
import { useToast } from "../ui/toast";

const { toast } = useToast();

const props = defineProps<{
  path: string;
  ids: number[];
}>();

const { t } = useI18n();
const emit = defineEmits(["refresh"]);

const dialogOpen = ref(false);
const loading = ref(false);

async function deleteItem() {
  loading.value = true;
  for (let i = 0; i < props.ids.length; i++) {
    const response = await useActionDelete(`${props.path}/${props.ids[i]}`);
    if (response.status != 200) {
      toast({
        title: t("delete_warning"),
        variant: "destructive",
      });
    }
  }

  emit("refresh");
  dialogOpen.value = false;
  loading.value = false;
}
</script>
