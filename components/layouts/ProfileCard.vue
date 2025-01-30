<template>
  <NuxtLink
    to="/dashboard"
    class="flex items-center gap-2 transition-all duration-300 ease-in-out"
  >
    <div
      class="w-11 h-11 flex items-center justify-center bg-ten text-overTen rounded-full"
    >
      <Icon
        name="hugeicons:user"
        class="text-2xl transition-transform duration-150"
      />
    </div>

    <h1 class="text-lg">{{ userDetails.name }}</h1>
  </NuxtLink>
</template>

<script setup lang="ts">
import { useProfileStore } from "~/stores/users/profile_store";

const { logout } = useProfileStore();
const { userDetails } = storeToRefs(useProfileStore());
</script>

<style scoped></style>
