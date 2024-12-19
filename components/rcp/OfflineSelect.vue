<template>
  <div class="flex flex-col items-stretch gap-1">
    <label for="" class="text-sm" v-if="props.label">
      {{ $t(props.label) }}
    </label>
    <div
      class="relative border-2 button_shape gap-4 flex flex-row items-center justify-between"
    >
      <div class="w-full flex flex-row items-center gap-2">
        <Icon :name="props.icon" class="text-xl" />
        <select
          :placeholder="props.placeholder"
          v-model="props.selectedValue[props.field]"
          class="w-full outline-none text-md bg-transparent"
          :name="props.label"
        >
          <option v-for="option in props.options" :value="option">
            {{ $t(option) }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const searchBox = ref(null);
const showResultBox = ref(false);

onClickOutside(searchBox, (event) => (showResultBox.value = false));

const emit = defineEmits(["on-change"]);

const props = defineProps<{
  label?: string;
  icon: string;
  placeholder: string;
  selectedValue: any;
  field: string;
  options: any[];
}>();
</script>
