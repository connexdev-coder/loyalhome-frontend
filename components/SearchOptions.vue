<template>
  <div ref="searchArea">
    <div
      ref="searchArea"
      class="border-[1px] flex items-center justify-start gap-x-2 rounded-sm relative text-md"
    >
      <input
        @click="onClickInside"
        path="text"
        class="px-2 py-2 text-overSixty w-full outline-none"
        v-model="searchValue"
        @keypress=" (event: Event) => {
            emit('on-select', props.nameField, searchValue);
          }"
      />

      <div
        v-if="status == 'success'"
        v-show="searchOpen"
        :class="data.data.length == 0 ? 'hidden' : 'flex'"
        class="bg-sixty dark:bg-dsixty shadow-md max-h-[500px] overflow-y-auto rounded-md px-2 py-2 overflow-clip absolute left-0 right-0 top-12 flex flex-col items-stretch z-10 gap-y-2"
      >
        <div
          v-for="item in data.data"
          @click="
            () => {
              searchValue = item[props.nameField];
              emit('on-select', props.nameField, item[props.nameField]);
              resetSearch();
            }
          "
          class="hover:bg-ten hover:text-overTen text-center cursor-pointer border-[1px] py-2"
        >
          {{
            props.nameField == "unit"
              ? item.unit_name +
                (item.unit_box != "" ? " و " : "") +
                item.unit_box
              : item[props.nameField]
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGet } from "~/hooks/fetch";
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(["on-select"]);

function onClickInside() {
  searchOpen.value = true;
  fetchSearches();
}

const props = defineProps<{
  path: string;
  selectedValue: any;
  nameField: any;
}>();

const searchValue = ref(props.selectedValue[props.nameField]);

const data = ref<any>(null);
const status = ref<any>(null);

async function fetchSearches() {
  const { data: searchData, status: searchStatus } = await useGet(
    `${props.path}?search=${searchValue.value}`
  );

  data.value = searchData.value;
  status.value = searchStatus.value;
}

fetchSearches();

watch(searchValue, async (newValue) => {
  fetchSearches();
});

let searchArea = ref(null);
let searchOpen = ref(false);

onClickOutside(searchArea, (event) => {
  searchOpen.value = false;
});

function resetSearch() {
  searchOpen.value = false;
}
</script>
