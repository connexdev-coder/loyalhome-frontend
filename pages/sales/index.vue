<template>
  <div class="flex flex-col items-stretch gap-4">
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon name="hugeicons:file-verified" class="text-4xl text-ten" />
      <h1 class="text-xl uppercase">{{ $t("sales") }}</h1>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      <NuxtLink
        v-for="section in navigations"
        :to="section.route"
        class="flex flex-col justify-center items-center text-center hover:scale-95 duration-100 gap-2 px-3 py-2 rounded-sm"
        :style="{
          backgroundColor: section.background,
          color: section.textColor,
        }"
      >
        <Icon :name="section.icon" class="text-4xl" />
        <span class="text-xl">{{ $t(section.name) }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  requiredAuthorities: ["settings"],
});

let navigations = [
  {
    name: "ballon_sale",
    route: "/sales/ballon",
    icon: BALLON_ICON,
    role: "",
    background: "var(--color-ballon)",
    textColor: "#ffffff",
  },
  {
    name: "mdf_sale",
    route: "/sales/mdf",
    icon: MDF_ICON,
    role: "",
    background: "var(--color-mdf)",
    textColor: "#ffffff",
  },
];
</script>

<style scoped></style>
