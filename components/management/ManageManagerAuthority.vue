<template>
  <Dialog v-model:open="dialogContentVisible">
    <DialogTrigger>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <h1 class="text-xl">{{ $t(props.title) }}</h1>
        </DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <div
        v-if="authStatus == 'success' && managerAuthStatus == 'success'"
        class="max-h-[300px] overflow-y-scroll flex flex-wrap gap-2 py-2"
      >
        <button
          v-for="newAuth in authData.data"
          class="px-3 py-2 rounded-sm"
          :class="
            isOldChecked(newAuth)[0] || isNewChecked(newAuth)
              ? 'bg-ten text-white'
              : 'bg-gray-300 text-black'
          "
          @click="
            () => {
              if (isOldChecked(newAuth)[0]) {
                let old_id = isOldChecked(newAuth)[1];

                authorities_delete.push(old_id);
                return;
              }

              if (isNewChecked(newAuth)) {
                authorities.splice(
                  authorities.indexOf(newAuth.authority_id),
                  1
                );
                return;
              }

              authorities.push(newAuth.authority_id);
            }
          "
        >
          {{ $t(newAuth.authority_name) }}
        </button>
      </div>

      <button
        @click="onManageAuthority"
        class="bg-ten text-white rounded-sm py-2 px-3 w-full"
      >
        {{ $t("submit") }}
      </button>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useActionPut } from "~/hooks/actionFetch";
import { useGet } from "~/hooks/fetch";

const authorities = ref([]);
const authorities_delete = ref([]);

const props = defineProps<{
  id: any;
  title: string;
}>();

async function onManageAuthority() {
  try {
    await useActionPut(`authority/${props.id}`, {
      authorities: authorities.value,
      authorities_delete: authorities_delete.value,
    });
  } catch (_) {}

  dialogContentVisible.value = false;
}

const {
  data: managerAuthData,
  status: managerAuthStatus,
  refresh: managerAuthRefresh,
}: any = await useGet(`authority/${props.id}`);

const { data: authData, status: authStatus }: any = await useGet(`authority`);

const dialogContentVisible = ref(false);

function isOldChecked(authority: any) {
  if (managerAuthStatus.value != "success") return;
  if (authStatus.value != "success") return;

  let result = false;
  let old_id;

  for (let i = 0; i < managerAuthData.value.data.length; i++) {
    if (managerAuthData.value.data[i].authority_id == authority.authority_id) {
      old_id = managerAuthData.value.data[i].manager_authority_id;
      result = true;
    }
  }

  if (authorities_delete.value.includes(old_id)) result = false;

  return [result, old_id];
}

function isNewChecked(authority: any) {
  if (managerAuthStatus.value != "success") return;
  if (authStatus.value != "success") return;

  let result = false;

  if (authorities.value.includes(authority.authority_id)) result = true;

  return result;
}

watch(
  () => dialogContentVisible.value,
  (newVal) => {
    if (newVal) {
      authorities.value = [];
      authorities_delete.value = [];
      managerAuthRefresh();
    }
  }
);
</script>
