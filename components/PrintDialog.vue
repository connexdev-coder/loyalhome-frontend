<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger class="">
      <div
        class="px-2 py-2 bg-blue-500 rounded-sm text-white text-md flex flex-row items-center gap-1"
      >
        <img src="/assets/icons/print.svg" alt="" srcset="" class="w-5" />
        <span> {{ $t("print") }}</span>
      </div>
    </DialogTrigger>
    <DialogContent class="max-w-full h-screen flex flex-col">
      <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="100%"></iframe>
      <DialogClose class="bg-ten rounded-sm py-2 text-white">{{
        $t("close")
      }}</DialogClose>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const props = defineProps<{
  type: string;
  extra: string;
}>();

const dialogContentVisible = ref(false);

const pdfUrl = ref<any>(null);

const runtimeConfig = useRuntimeConfig();
const token = useCookie("token");

watch(
  () => dialogContentVisible.value,
  async (newVal) => {
    if (newVal) {
      const response = await fetch(
        `${runtimeConfig.public.api_url}prints?type=${props.type}&${props.extra}`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      pdfUrl.value = url;
    }
  }
);
</script>
