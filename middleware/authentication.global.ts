// file: ~/middleware/authentication.global.ts
// import { useAuth } from "~/composables/useAuth";
import { useProfileStore } from "~/stores/users/profile_store";

export default defineNuxtRouteMiddleware(async (to) => {
  const { checkAuth } = useProfileStore();
  const { isAuthenticated, roles } = storeToRefs(useProfileStore());

  await checkAuth();

  if (!isAuthenticated.value && to.path != "/login") {
    return navigateTo("/login");
  }

  if (isAuthenticated.value && (to.path == "/login" || to.path == "/")) {
    return navigateTo("/dashboard");
  }

  const requiredAuthorities = to.meta.requiredAuthorities || [];

  // if (requiredAuthorities.length > 0) {
  //   const hasAuthority = roles.value.some((authority) =>
  //     requiredAuthorities.includes(authority.authority_name)
  //   );

  //   if (!hasAuthority) {
  //     return navigateTo("/dashboard");
  //   }
  // }
});
