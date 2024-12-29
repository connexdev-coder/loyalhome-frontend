<template>
  <!-- header -->
  <div
    class="z-10 px-3 py-2 border-b-2 border-gray-200 flex flex-row place-items-stretch justify-between gap-1 text-md w-full"
  >
    <!-- profile -->
    <ProfileCard />

    <div class="flex flex-row items-center gap-3">
      <CurrencyExchanger>
        <Icon :name="DOLLAR_ICON" class="text-2xl" />
      </CurrencyExchanger>
      <LangChanger />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
