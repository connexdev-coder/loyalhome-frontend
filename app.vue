<template>
  <div :style="{ direction: locale == 'en' ? 'ltr' : 'rtl' }">
    <div class="text-md h-screen relative font-calibri">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
  <Toaster />
</template>

<script setup lang="ts">
const { locale } = useI18n();

useHead({
  title: "Loyal Home",
});
</script>

<style>
.cell_overflow {
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflow content */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
}
</style>
