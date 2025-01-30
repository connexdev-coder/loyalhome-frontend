<template>
  <div :style="{ direction: locale == 'en' ? 'ltr' : 'rtl' }">
    <div class="text-md h-screen relative font-calibri">
      <NuxtLayout
        :name="
          route.path.startsWith('/ballon')
            ? 'ballon-layout'
            : route.path.startsWith('/mdf')
            ? 'mdf-layout'
            : 'default'
        "
      >
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
  <Toaster />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

useHead({
  title: "Loyal Home",
});

const { locale } = useI18n();
const route = useRoute();
</script>

<style>
.cell_overflow {
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflow content */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
}
</style>
