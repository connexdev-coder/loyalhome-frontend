<template>
  <!-- header -->
  <div
    class="z-10 px-3 py-2 border-b-2 border-gray-200 flex flex-row place-items-stretch justify-between gap-1 text-md w-full"
  >
    <!-- profile -->
    <ProfileCard />

    <div class="flex flex-row items-center gap-3">
      <NuxtLink
        to="/settings/dollar_prices"
        class="flex flex-row items-center justify-end gap-2"
      >
        <Icon :name="DOLLAR_ICON" class="text-2xl" />
      </NuxtLink>

      <div class="flex justify-end" ref="profileActionArea">
        <button
          @click="expanded = !expanded"
          class="flex flex-row items-center justify-end gap-2"
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
    </div>
  </div>
</template>

<script setup lang="ts">
const expanded = ref(false);

const { setLocale } = useI18n();

let profileActionArea = ref(null);
onClickOutside(profileActionArea, (event) => {
  expanded.value = false;
  langExpanded.value = false;
});

const langExpanded = ref(false);
let languageArea = ref(null);
onClickOutside(languageArea, (event) => {
  langExpanded.value = false;
});
</script>

<style scoped></style>
