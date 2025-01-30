<template>
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

let navigations = [
  {
    name: "ballon",
    route: "/ballon",
    icon: BALLON_ICON,
    role: "",
    background: "var(--color-ballon)",
    textColor: "#ffffff",
  },
  {
    name: "mdf",
    route: "/mdf",
    icon: MDF_ICON,
    role: "",
    background: "var(--color-mdf)",
    textColor: "#ffffff",
  },
  {
    name: "contracts",
    route: "/contracts",
    icon: CONTRACT_ICON,
    role: "",
    background: "var(--color-management)",
    textColor: "#ffffff",
  },
  {
    name: "settings",
    route: "/settings",
    icon: "hugeicons:settings-02",
    role: "",
    background: "var(--color-management)",
    textColor: "#ffffff",
  },
];
</script>

<style scoped></style>
