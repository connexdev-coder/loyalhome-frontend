<template>
  <div class="flex flex-col items-stretch gap-4">
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon name="hugeicons:folder-file-storage" class="text-4xl text-ten" />
      <h1 class="text-xl uppercase">{{ $t("warehouse") }}</h1>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
    name: "products",
    route: "/warehouse/products",
    icon: "hugeicons:dashboard-square-01",
    role: "",
    background: "var(--color-inventory)",
    textColor: "#ffffff",
  },
  {
    name: "import_invoices",
    route: "/warehouse/imports",
    icon: "hugeicons:invoice",
    role: "",
    background: "var(--color-inventory)",
    textColor: "#ffffff",
  },
  {
    name: "wasted_products",
    route: "/warehouse/wasted",
    icon: WASTED_ICON,
    role: "",
    background: "var(--color-destructive)",
    textColor: "#ffffff",
  },
  {
    name: "companies",
    route: "/settings/companies",
    icon: "hugeicons:delivery-truck-02",
    role: "",
    background: "var(--color-client)",
    textColor: "#ffffff",
  },
  {
    name: "company_depts",
    route: "/finance/company_depts",
    icon: REPAYMENT_ICON,
    role: "",
    background: "var(--color-dollar)",
    textColor: "#ffffff",
  },
];
</script>

<style scoped></style>
