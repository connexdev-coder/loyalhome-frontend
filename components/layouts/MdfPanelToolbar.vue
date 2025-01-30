<template>
  <div
    :style="{ width: expanded ? '230px' : '70px' }"
    class="text-[16px] py-3 bg-ten flex flex-col items-start justify-between h-screen overflow-y-auto overflow-x-clip transition-all duration-150 ease-in-out"
  >
    <!-- Top Section -->
    <div class="flex flex-col items-start w-full gap-5">
      <!-- logowhite -->
      <div
        class="px-3 flex items-center gap-3 transition-all duration-300 ease-in-out border-b-[1px] w-full pb-4"
      >
        <NuxtLink to="/dashboard" class="w-11 h-11 rounded-md border-[#245780]">
          <img
            src="/assets/images/logowhite.png"
            class="object-cover h-full w-full"
            alt="logowhite"
          />
        </NuxtLink>

        <h1
          class="text-lg uppercase transition-all text-overTen duration-300 ease-in-out whitespace-nowrap overflow-hidden"
          :style="{
            opacity: expanded ? 1 : 0,
            maxWidth: expanded ? '200px' : '0px',
          }"
        >
          {{ $t("app_name") }}
        </h1>
      </div>

      <!-- Navigation Links with Expandable Submenus -->
      <div class="flex flex-col items-start w-full gap-1">
        <NuxtLink
          v-for="(section, index) in navigations"
          :key="section.route"
          class="w-full border-b-[1px] border-slate-400 border-opacity-10"
          :to="section.route"
          @click="
            () => {
              if (route.path == section.route) return;
              router.push(section.route);
            }
          "
        >
          <div
            class="px-3 flex items-center justify-between w-full cursor-pointer"
            :class="
              route.path === section.route
                ? 'bg-thirty text-overThirty'
                : 'hover:bg-thirty hover:text-overThirty text-overTen '
            "
          >
            <div
              class="w-11 h-11 p-2 flex items-center justify-center flex-shrink-0"
            >
              <Icon :name="section.icon" class="text-2xl" />
            </div>
            <div
              class="text-md px-1 flex-1 flex flex-row items-center justify-between transition-all duration-150 ease-in-out overflow-hidden whitespace-nowrap"
              :style="{
                maxWidth: expanded ? '100%' : '0px',
                opacity: expanded ? 1 : 0,
              }"
            >
              <h1>{{ $t(section.name) }}</h1>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="flex flex-col items-start w-full gap-3 mb-3 px-3">
      <!-- Expand Button -->
      <button
        @click="expanded = !expanded"
        class="w-11 h-11 rounded-md flex items-center justify-center text-overTen"
      >
        <Icon
          name="iconoir:sidebar-expand"
          class="text-2xl transition-transform duration-150"
          :style="{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }"
        />
      </button>

      <!-- logout -->
      <Logout>
        <div class="w-11 h-11 flex items-center justify-center text-overTen">
          <Icon
            :name="LOGOUT_ICON"
            class="text-2xl transition-transform duration-150"
          />
        </div>
      </Logout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useProfileStore } from "~/stores/users/profile_store";

const expanded = ref(true);
const route = useRoute();
const router = useRouter();

const navigations = [
  {
    name: "sales",
    route: "/sales",
    icon: "hugeicons:shopping-basket-02",
  },
  {
    name: "clients",
    route: "/client",
    icon: "hugeicons:user-group",
  },
  {
    name: "employee",
    route: "/employee",
    icon: "clarity:employee-group-line",
  },
  {
    name: "warehouse",
    route: "/warehouse",
    icon: "hugeicons:folder-file-storage",
  },

  {
    name: "finance",
    route: "/finance",
    icon: "hugeicons:bitcoin-money-02",
  },
  {
    name: "report",
    route: "/reports",
    icon: "hugeicons:file-verified",
  },
];

const { logout } = useProfileStore();
const { userDetails } = storeToRefs(useProfileStore());
</script>

<style scoped>
/* Slide and Fade Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
