<template>
  <div class="card flex items-stretch justify-center">
    <Dialog v-model:open="dialogOpen">
      <DialogTrigger>
        <slot />
      </DialogTrigger>

      <DialogContent class="max-w-sm">
        <DialogTitle class="flex flex-col items-center gap-2">
          <Icon :name="LOGOUT_ICON" class="text-4xl text-destructive" />
          <h1 class="text-center font-normal">{{ $t("logout_warning") }}</h1>
        </DialogTitle>

        <DialogDescription></DialogDescription>

        <div class="flex flex-col items-stretch gap-2 w-full">
          <button
            @click="dialogOpen = false"
            class="text-overSixty border-2 rounded-sm py-2 px-3 w-full"
          >
            {{ $t("cancel") }}
          </button>
          <button
            @click="logout"
            class="bg-red-500 text-white rounded-sm py-2 px-3 w-full"
          >
            {{ $t("logout") }}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useProfileStore } from "~/stores/users/profile_store";

const { logout } = useProfileStore();

const dialogOpen = ref(false);
</script>
