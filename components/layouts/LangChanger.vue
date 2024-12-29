<template>
  <div class="flex justify-end" ref="profileActionArea">
    <button
      @click="expanded = !expanded"
      class="flex flex-row items-center gap-2"
    >
      <Icon :name="LANG_ICON" class="text-2xl" />
    </button>

    <div
      v-if="expanded"
      class="w-32 absolute top-11 bg-white border-[1px] p-2 rounded-sm flex flex-col items-stretch gap-2"
    >
      <button
        @click="setLocale('en')"
        class="hover:bg-ten hover:text-overTen py-1 rounded-sm border-b-2"
      >
        English
      </button>
      <button
        @click="setLocale('kr')"
        class="hover:bg-ten hover:text-overTen py-1 rounded-sm border-b-2"
      >
        کوردی
      </button>
      <button
        @click="setLocale('ar')"
        class="hover:bg-ten hover:text-overTen py-1 rounded-sm"
      >
        العربیە
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setLocale } = useI18n();

const langExpanded = ref(false);
const expanded = ref(false);

let profileActionArea = ref(null);
onClickOutside(profileActionArea, (event) => {
  expanded.value = false;
  langExpanded.value = false;
});

let languageArea = ref(null);
onClickOutside(languageArea, (event) => {
  langExpanded.value = false;
});
</script>

<style scoped></style>
