<template>
  <div class="flex flex-col items-stretch gap-0 w-full">
    <label for="" class="text-sm font-bold" v-if="props.label">
      {{ $t(props.label) }}
    </label>
    <div class="border-2 button_shape gap-2 h-10">
      <Icon :name="props.icon" class="text-xl text-ten" />
      <input
        :disabled="props.disabled"
        :name="props.valueField"
        :type="props.type == 'number' ? 'text' : props.type"
        class="w-full outline-none text-md bg-transparent disabled:bg-transparent"
        :placeholder="$t(props.placeholder)"
        v-model="props.value[props.valueField]"
        @input="handleInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string;
  type: string;
  icon: string;
  placeholder: string;
  value: any;
  valueField: string;
  disabled?: boolean;
  maxValue?: number;
}>();

const emit = defineEmits(["on-change"]);
let timeout: ReturnType<typeof setTimeout>;

const debounceEmit = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => emit("on-change", props.value.name), 500);
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (props.type === "number") {
    target.value = target.value.replace(/[^0-9.]/g, ""); // Allow numeric characters and decimal points

    if (props.maxValue && parseFloat(target.value) > props.maxValue) {
      target.value = props.maxValue.toString();
    }
  }

  props.value[props.valueField] = target.value; // Update the value
  debounceEmit();
};
</script>
