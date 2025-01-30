<template>
  <div class="flex flex-col items-stretch gap-10">
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon name="hugeicons:user-group" class="text-4xl text-ten" />
      <h1 class="text-xl uppercase">{{ $t("clients") }}</h1>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      <NuxtLink
        v-for="section in ballonNavigations"
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

let ballonNavigations = [
  {
    name: "ballon_clients",
    route: "/ballon/client/ballon_clients",
    icon: "hugeicons:user-group",
    role: "",
    background: "var(--color-ballon)",
    textColor: "#ffffff",
  },
  {
    name: "ballon_deptors",
    route: "/ballon/client/ballon_deptors",
    icon: DOLLAR_ICON,
    role: "",
    background: "var(--color-ballon)",
    textColor: "#ffffff",
  },
  {
    name: "ballon_client_checks",
    route: "/ballon/client/ballon_client_checks",
    icon: FINISHED_ICON,
    role: "",
    background: "var(--color-ballon)",
    textColor: "#ffffff",
  },
];
let navigations = [
  {
    name: "payment_history",
    route: "/ballon/client/payments",
    icon: HISTORY_ICON,
    role: "",
    background: "var(--color-dollar)",
    textColor: "#ffffff",
  },
];
</script>

<style scoped></style>
