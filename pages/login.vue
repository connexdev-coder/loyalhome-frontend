<template>
  <div class="h-full flex flex-row items-center justify-center w-screen">
    <img
      src="https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      alt=""
      srcset=""
      class="w-full h-full object-cover overflow-hidden hidden md:flex"
    />
    <div class="flex flex-col w-full">
      <div class="flex flex-col items-center w-full gap-3">
        <img src="/assets/images/logo.png" class="w-32" alt="" srcset="" />
        <h1 class="font-bold">{{ $t("app_name") }}</h1>
      </div>
      <form
        @submit.prevent="onSubmit"
        class="max-w-xl m-auto w-full flex flex-col items-stretch gap-2 p-3"
      >
        <input
          type="text"
          name="username"
          v-model="credentials.username"
          class="border-[1px] border-sixtyBorder rounded-md px-2 py-2"
          :placeholder="$t('username')"
        />

        <input
          type="password"
          name="password"
          v-model="credentials.password"
          class="border-[1px] border-sixtyBorder rounded-md px-2 py-2"
          :placeholder="$t('password')"
        />

        <input
          type="submit"
          :disabled="loading"
          :class="loading ? 'animate-pulse opacity-50' : ''"
          class="cursor-pointer bg-ten text-white rounded-md px-2 py-2"
          :value="$t('login')"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "~/components/ui/toast";
import { usePost } from "~/hooks/fetch";

definePageMeta({ layout: "login-layout" });

const credentials = ref({ username: "", password: "" });
const loading = ref(false);

const { t } = useI18n();
const { toast } = useToast();

async function onSubmit() {
  loading.value = true;
  const { data, error, status }: any = await usePost(
    "managers/login",
    credentials.value
  );

  loading.value = false;

  if (status.value == "success") {
    const token = useCookie("token", { maxAge: 10000000 });
    token.value = data.value.token;
    reloadNuxtApp();
  } else {
    toast({
      title: t("credentials_wrong"),
      variant: "destructive",
    });
  }
}
</script>

<style scoped>
* {
  direction: ltr;
}
</style>
