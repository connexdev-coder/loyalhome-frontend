<template>
  <div class="flex flex-col items-stretch gap-1">
    <label for="" class="text-sm" v-if="props.label">
      {{ $t(props.label) }}
    </label>
    <div
      class="h-10 relative border-2 button_shape gap-4 flex flex-row items-center justify-between"
    >
      <div class="w-full flex flex-row items-center gap-2">
        <Icon :name="props.icon" class="text-xl" />
        <span v-if="props.disabled" class="line-clamp-1">
          {{ props.selectedValue[props.result_fields[0]] }}
        </span>
        <input
          v-if="props.disabled == false"
          type="text"
          class="w-full outline-none text-md bg-transparent line-clamp-1"
          :placeholder="$t(props.placeholder)"
          v-model="searchValue"
          @input="debounceEmit"
          ref="searchBox"
          @click="
            () => {
              showResultBox = true;
              debounceEmit();
            }
          "
        />
      </div>

      <div
        v-if="disabled"
        class="p-1 bg-clear hover:bg-destructive duration-100 text-white rounded-full flex items-center justify-center cursor-pointer"
        @click="
          () => {
            emit('clear');
            searchValue = '';
          }
        "
      >
        <Icon name="hugeicons:cancel-01" class="text-md" />
      </div>

      <div
        v-if="showResultBox"
        ref="searchBox"
        class="absolute top-10 left-0 right-0 bg-sixty text-overSixty border-2 w-full max-h-[150px] overflow-y-scroll z-10 rounded-md shadow-md"
      >
        <div class="flex flex-col p-1 border-b-2" v-if="status == 'success'">
          <div
            v-for="data in data"
            @click="
              () => {
                emit('on-change', data);
                showResultBox = false;
                searchValue = data[props.result_fields[0]];
              }
            "
            class="p-2 border-b-2 border-gray-200 cursor-pointer hover:bg-ten hover:text-overTen"
          >
            <span v-for="field in props.result_fields" class="line-clamp-1">
              {{ data[field] }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGet } from "~/hooks/fetch";
import { onClickOutside } from "@vueuse/core";

const searchBox = ref(null);
const showResultBox = ref(false);
onClickOutside(searchBox, (event) => (showResultBox.value = false));

const searchValue = ref("");

const props = defineProps<{
  label?: string;
  type: string;
  icon: string;
  placeholder: string;
  api_route: string;
  api_route_query: string;
  result_fields: any[];
  selectedValue: any;
  disabled?: boolean;
}>();

const data = ref<any>(null);
const status = ref<any>(null);

async function fetchData() {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `${props.api_route}?${props.api_route_query}=${searchValue.value}`
  );
  data.value = dataData.value.data;
  status.value = dataStatus.value;
}

fetchData();

const emit = defineEmits(["on-change", "clear"]);

let timeout: ReturnType<typeof setTimeout>;

const debounceEmit = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => fetchData(), 500);
};
</script>
