<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger class="">
      <div class="bg-blue-500 text-white button_shape">
        <Icon :name="PRINT_ICON" class="text-xl" />
        <span> {{ $t(props.lang) }}</span>
      </div>
    </DialogTrigger>
    <DialogContent class="max-w-[90vw] md:max-w-[70vw] h-screen flex flex-col">
      <DialogHeader></DialogHeader>
      <iframe
        v-if="pdfUrl"
        :src="pdfUrl"
        width="100%"
        height="100%"
        class="rounded-md"
      ></iframe>
      <div v-else class="h-full w-full flex items-center justify-center">
        <Icon :name="LOADING_ICON" class="text-5xl animate-spin text-ten" />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const props = defineProps<{
  type: string;
  extra: string;
  lang: string;
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
        `${runtimeConfig.public.api_url}print?type=${props.type}&lang=${props.lang}&${props.extra}`,
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
