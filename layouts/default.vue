<template>
  <div
    class="flex flex-row items-stretch gap-1 overflow-hidden h-screen bg-underSixty"
  >
    <PanelToolbar />

    <div
      class="flex flex-col gap-1 flex-1 overflow-hidden overflow-y-auto h-screen pb-9"
    >
      <!-- header -->
      <div
        class="z-10 border-b-[1px] py-3 bg-sixty text-overSixty px-3 flex flex-row place-items-stretch justify-between gap-1 text-md w-full"
      >
        <!-- Breadcrumbs -->
        <div class="flex flex-row items-center gap-1">
          <div
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="index"
            class="flex flex-row items-center"
          >
            <!-- Paths -->
            <div
              v-if="!breadcrumb.last"
              class="flex flex-row items-center justify-end gap-1 opacity-80"
            >
              <NuxtLink :to="breadcrumb.path" class="hover:underline">
                <span>{{ breadcrumb.name }}</span>
              </NuxtLink>
              <span>/</span>
            </div>
            <!-- Last -->
            <span class="" v-else="breadcrumb.last">
              {{ breadcrumb.name }}
            </span>
          </div>
        </div>

        <!-- profile -->
        <div class="relative w-32 flex justify-end" ref="profileActionArea">
          <button
            @click="expanded = !expanded"
            class="flex flex-row items-center justify-end gap-2"
          >
            <Icon name="hugeicons:language-skill" class="text-2xl" />
            <img src="/assets/icons/arrow.svg" class="w-4" alt="" srcset="" />
          </button>

          <div
            v-if="expanded"
            class="absolute top-11 w-full bg-white border-[1px] p-2 rounded-sm flex flex-col items-stretch gap-2"
          >
            <button @click="setLocale('en')">English</button>
            <button @click="setLocale('kr')">کوردی</button>
            <button @click="setLocale('ar')">العربیە</button>
          </div>
        </div>
      </div>

      <!-- slots -->
      <div class="p-3 bg-sixty h-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from "~/stores/users/profile_store";

const { locale } = useI18n();

const expanded = ref(false);
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

const { setLocale } = useI18n();

const { logout } = useProfileStore();
const { userDetails } = storeToRefs(useProfileStore());

const breadcrumbs = computed(() => {
  const pathArray = useRoute()
    .path.split("/")
    .filter((path) => path);

  const breadcrumbs = pathArray.map((path, index) => {
    return {
      name: path.charAt(0).toUpperCase() + path.slice(1),
      path: "/" + pathArray.slice(0, index + 1).join("/"),
      last: index === pathArray.length - 1,
    };
  });

  // Add a "Home" breadcrumb
  return [
    { name: "Home", path: "/", last: pathArray.length === 0 },
    ...breadcrumbs,
  ];
});
</script>
