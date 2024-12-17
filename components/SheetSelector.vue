<template>
  <Sheet>
    <SheetTrigger as-child>
      <button
        variant="outline"
        class="border-[1px] w-full px-5 py-3 rounded-sm flex items-center justify-between"
      >
        <slot />
      </button>
    </SheetTrigger>
    <SheetContent side="right" class="flex flex-col gap-3 overflow-y-scroll">
      <SheetHeader>
        <SheetTitle></SheetTitle>
      </SheetHeader>
      <div class="flex flex-col gap-2 py-2">
        <input
          type="text"
          v-model="searchValue"
          placeholder=""
          class="border-[1px] px-4 py-2 rounded-full"
        />
        <SheetClose
          as-child
          v-for="dataIndex in tempData.length == 0 ? props.items : tempData"
        >
          <button
            @click="emit('onSelected', dataIndex)"
            class="bg-inactive rounded-sm px-4 py-2 text-left flex flex-col items-start"
          >
            <span> {{ dataIndex[props.field] }}</span>
          </button>
        </SheetClose>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const props = defineProps({
  items: {
    type: Array,
    required: false,
    default: [],
  },

  field: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["onSelected"]);

const tempData = ref<any[]>([]);
const searchValue = ref("");

// watch([car_brand_id], fetchData, { immediate: true });
watch(
  [searchValue],
  () => {
    if (searchValue.value == "") {
      tempData.value = props.items;
    } else {
      tempData.value = props.items.filter((testData: any) =>
        testData.driver_name.includes(searchValue.value)
      );
    }
  },
  { immediate: true }
);
</script>
