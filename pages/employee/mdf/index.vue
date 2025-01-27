<template>
  <div class="flex flex-col items-stretch gap-4">
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon name="clarity:employee-group-line" class="text-4xl text-ten" />
      <h1 class="text-xl uppercase">{{ $t("mdf_employees") }}</h1>
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
    name: "employees",
    route: "/employee/mdf/employees",
    icon: "clarity:employee-group-line",
    role: "",
    background: "var(--color-employee)",
    textColor: "#ffffff",
  },
  {
    name: "employee_attendances",
    route: "/employee/mdf/attendances",
    icon: "hugeicons:calendar-03",
    role: "",
    background: "var(--color-employee)",
    textColor: "#ffffff",
  },
  {
    name: "employee_payments",
    route: "/employee/mdf/payments",
    icon: "hugeicons:money-receive-circle",
    role: "",
    background: "var(--color-dollar)",
    textColor: "#ffffff",
  },
];
</script>

<style scoped></style>
