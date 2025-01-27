<template>
  <div class="flex flex-col items-stretch gap-4">
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon name="hugeicons:bitcoin-money-02" class="text-4xl text-ten" />
      <h1 class="text-xl uppercase">{{ $t("finance") }}</h1>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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
    name: "mdf_spendings",
    route: "/finance/mdf_spendings",
    icon: MDF_ICON,
    role: "",
    background: "var(--color-mdf)",
    textColor: "#ffffff",
  },
  {
    name: "mdf_box_transaction",
    route: "/finance/mdf_box_transaction",
    icon: "hugeicons:arrow-data-transfer-diagonal",
    role: "",
    background: "var(--color-mdf)",
    textColor: "#ffffff",
  },
  {
    name: "ballon_spendings",
    route: "/finance/ballon_spendings",
    icon: BALLON_ICON,
    role: "",
    background: "var(--color-ballon)",
    textColor: "#ffffff",
  },
  {
    name: "ballon_box_transaction",
    route: "/finance/ballon_box_transaction",
    icon: "hugeicons:arrow-data-transfer-diagonal",
    role: "",
    background: "var(--color-ballon)",
    textColor: "#ffffff",
  },
  {
    name: "box",
    route: "/finance/box",
    icon: BOX_ICON,
    role: "",
    background: "var(--color-dollar)",
    textColor: "#ffffff",
  },
];
</script>

<style scoped></style>
