<template>
  <div class="flex flex-col items-stretch gap-4">
    <div class="font-bold flex flex-row items-center gap-1">
      <img src="/assets/icons/report.svg" class="w-6" alt="" srcset="" />
      <h1>{{ $t("reports") }}</h1>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <NuxtLink
        v-for="section in navigations"
        :to="section.route"
        :style="{ backgroundColor: section.color }"
        class="white duration-150 flex flex-col items-center gap-2 p-2 w-full rounded-sm"
      >
        <img
          :src="images[section.icon]"
          alt=""
          srcset=""
          class="w-7 h-7 whiteFilter"
        />
        <span class="text-white">{{ $t(section.name) }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { filename } from "pathe/utils";

definePageMeta({
  requiredAuthorities: ["report"],
});

const route = useRoute();

const glob = import.meta.glob("~/assets/icons/*.svg", { eager: true });
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]: any[]) => [
    filename(key),
    value.default,
  ])
);

let navigations = [
  {
    name: "inventory_jard",
    route: "/reports/inventory_jard",
    icon: "inventory",
    role: "",
    color: "#0096c7",
  },
  {
    name: "company_payment",
    route: "/reports/company_payment",
    icon: "company",
    role: "",
    color: "#e76f51",
  },
  {
    name: "employee_owings",
    route: "/reports/employee_owings",
    icon: "employee",
    role: "",
    color: "#fca311",
  },
  {
    name: "employee_owings_paid",
    route: "/reports/employee_owings_paid",
    icon: "employee",
    role: "",
    color: "#fca311",
  },
  {
    name: "employee_salary",
    route: "/reports/employee_salary",
    icon: "employee",
    role: "",
    color: "#fca311",
  },
];
</script>

<style scoped></style>
