<template>
  <Dialog v-if="roomStatus == 'success'" v-model:open="dialogContentVisible">
    <DialogTrigger class="w-full">
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <h1 class="text-center font-bold mb-1">{{ $t("add_booking") }}</h1>
        </DialogTitle>
        <DialogDescription>
          <div class="flex flex-wrap items-center gap-2 py-2 text-black">
            <h1 class="room_detail">
              {{ $t("room_number") }}: {{ roomData.data[0].room_number }}
            </h1>
            <h1 class="room_detail">
              {{ $t("day_price") }}:
              {{ parseInt(roomData.data[0].day_price).toLocaleString() }} IQD
            </h1>
            <h1 class="room_detail">
              {{ $t("hour_price") }}:
              {{ parseInt(roomData.data[0].hour_price).toLocaleString() }} IQD
            </h1>
            <h1
              v-for="feature in roomData.data[0].features"
              class="room_detail"
            >
              {{ feature.room_feature_name }}
            </h1>
          </div>
        </DialogDescription>
      </DialogHeader>

      <div class="h-[300px] overflow-y-scroll">
        <div class="flex flex-col gap-2 py-2">
          <!-- Client -->
          <label v-show="props.type == 'add'" for="" class="text-md">
            {{ $t("client_name") }}
          </label>
          <div v-show="props.type == 'add'" class="relative">
            <SearchComponent
              class="w-full h-full"
              path="clients"
              @on-select="onClientSelected"
              :selected-value="
                selectedClient != null ? selectedClient.client_name : ''
              "
              name-field="client_name"
              :disabled="selectedClient != null"
            />
            <div
              v-if="selectedClient != null"
              @click="
                () => {
                  selectedClient = null;
                }
              "
              class="cursor-pointer absolute right-0 top-0 bottom-0 text-red-500 px-1 py-2 rounded-sm h-10 w-10 flex items-center justify-center"
            >
              X
            </div>
          </div>

          <!-- Duration -->
          <label for="" class="text-md mt-2">{{ $t("stay_duration") }}</label>

          <div class="flex flex-col items-stretch w-full">
            <label for="" class="text-[16px]">{{ $t("from") }}</label>
            <input
              :disabled="props.type == 'update'"
              name="from"
              id="from"
              type="datetime-local"
              v-model="props.manageData.from"
              class="py-2 px-2 border-[1px] rounded-sm"
              :min="currentDate"
              @change="roundToNearestHour"
            />
          </div>

          <div class="flex flex-col items-stretch w-full">
            <label for="" class="text-[16px]">{{ $t("to") }}</label>
            <input
              name="to"
              id="to"
              type="datetime-local"
              v-model="props.manageData.to"
              class="py-2 px-2 border-[1px] rounded-sm"
              :min="
                props.type == 'add'
                  ? currentDate
                  : hasAccess('booking_dec')
                  ? props.manageData.from
                  : props.manageData.to
              "
              @change="roundToNearestHour"
            />
          </div>

          <div
            v-if="serviceStatus == 'success'"
            class="mt-3 max-h-[300px] overflow-y-scroll flex flex-wrap gap-2 py-2"
          >
            <button
              v-for="newService in serviceData.data"
              class="px-3 py-2 rounded-sm"
              :class="
                isOldChecked(newService)[0] || isNewChecked(newService)
                  ? 'bg-ten text-white'
                  : 'bg-gray-300 text-black'
              "
              @click="
                () => {
                  if (isOldChecked(newService)[0]) {
                    let old_id = isOldChecked(newService)[1];

                    services_delete.push(old_id);
                    calculateServicePrice();
                    return;
                  }

                  if (isNewChecked(newService)) {
                    services.splice(
                      services.indexOf(newService.room_service_id),
                      1
                    );
                    calculateServicePrice();
                    return;
                  }

                  services.push(newService.room_service_id);
                  calculateServicePrice();
                }
              "
            >
              {{ newService.room_service_name }} -
              {{ newService.room_service_price }} IQD
            </button>
          </div>

          <label for="">{{ $t("room_price") }}</label>
          <input
            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
            type="text"
            v-model="props.manageData.room_price"
            class="px-2 py-2 border-[1px] rounded-sm"
            @change="
              () => {
                calculateRoomPrice();
              }
            "
          />

          <label for="">{{ $t("service_price") }}</label>
          <input
            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
            type="text"
            v-model="props.manageData.service_price"
            class="px-2 py-2 border-[1px] rounded-sm"
          />

          <label for="">{{ $t("note") }}</label>
          <input
            type="text"
            v-model="props.manageData.note"
            class="px-2 py-2 border-[1px] rounded-sm"
          />
        </div>
      </div>

      <h1 class="text-red-500">{{ warning }}</h1>

      <div class="flex flex-wrap items-center justify-start gap-2 py-2">
        <h1 class="bg-green-100 px-2 py-2 rounded-sm">
          {{ $t("total_price") }}:
          {{
            (
              parseInt(props.manageData.room_price.toString()) +
              parseInt(props.manageData.service_price.toString())
            ).toLocaleString()
          }}
          IQD
        </h1>
        <span class="bg-orange-100 px-2 py-2 rounded-sm">
          {{ $t("room_price") }}:
          {{ props.manageData.room_price.toLocaleString() }} IQD
        </span>
        <span class="bg-yellow-100 px-2 py-2 rounded-sm">
          {{ $t("service_price") }}:
          {{ props.manageData.service_price.toLocaleString() }} IQD
        </span>
      </div>

      <button
        @click="onManageBooking"
        class="bg-ten text-sixty rounded-sm py-2 px-3 w-full"
      >
        {{ $t("save") }}
      </button>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useActionPost, useActionPut } from "~/hooks/actionFetch";
import { useGet } from "~/hooks/fetch";
import { useProfileStore } from "~/stores/users/profile_store";
import type { bookingType } from "~/types/tableTypes";

const { hasAccess } = useProfileStore();

const props = defineProps<{
  type: string;
  manageData: bookingType;
  room_id: any;
  id: any;
}>();

const {
  data: roomData,
  status: roomStatus,
  refresh: roomRefresh,
}: any = await useGet(`rooms/${props.room_id}`);

const {
  data: serviceData,
  status: serviceStatus,
  refresh: serviceRefresh,
}: any = await useGet(`room-services`);

const services = ref([]);
const services_delete = ref([]);

function isOldChecked(feature: any) {
  if (serviceStatus.value != "success") return;

  let result = false;
  let old_id;

  for (let i = 0; i < props.manageData.services.length; i++) {
    if (
      props.manageData.services[i].room_service_id == feature.room_service_id
    ) {
      old_id = props.manageData.services[i].booking_service_id;
      result = true;
    }
  }

  if (services_delete.value.includes(old_id)) result = false;

  return [result, old_id];
}

function isNewChecked(feature: any) {
  if (serviceStatus.value != "success") return;

  let result = false;

  if (services.value.includes(feature.room_service_id)) result = true;

  return result;
}

const selectedClient = ref<any>(null);
function onClientSelected(newItem: any) {
  selectedClient.value = newItem;
  if (selectedClient.value == null) return;
}

const warning = ref("");
const dataForm = ref<any>("");

function submitForm() {
  dataForm.value.dispatchEvent(new Event("submit"));
}

const emit = defineEmits(["refresh"]);

function validateFields() {
  let requiredFields = " ";

  if (selectedClient.value == null && props.type == "add")
    requiredFields += " " + "client";
  if (props.manageData.from == null) requiredFields += " " + "from";
  if (props.manageData.to == null) requiredFields += " " + "to";

  if (requiredFields == " ") return true;
  warning.value = requiredFields;
  return false;
}

async function onManageBooking() {
  warning.value = "";

  const isValid = validateFields();

  if (!isValid) return;

  try {
    let response;

    if (props.type == "add") {
      response = await useActionPost("bookings", {
        ...props.manageData,
        room_id: props.room_id,
        client_id: selectedClient.value.client_id,
        services: services.value,
      });
    }

    if (roomData.value.booking) {
      response = await useActionPut(`bookings/${props.id}`, {
        ...props.manageData,
        room_id: props.room_id,
        services: services.value,
        services_to_remove: services_delete.value,
      });
    }

    if (!response) return;

    if (response.status == 200) {
      emit("refresh", { data: response, type: props.type });
      dialogContentVisible.value = false;
    } else {
      warning.value = "An error occurred, please try again";
    }
  } catch (error) {
    warning.value = "An error occurred, please try again";
  }
}

const dialogContentVisible = ref(false);
const totalPrice = ref(0);

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:00`; // Format as "YYYY-MM-DDTHH:00"
}

const currentDate = computed(() => getCurrentDateTime());

function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:00`; // Format as YYYY-MM-DDTHH:00
}

function roundToNearestHour(event: any) {
  const value = event.target.value;
  const date = new Date(value);

  if (!isNaN(date.getTime())) {
    // Round the time to the nearest full hour
    if (date.getMinutes() > 0) {
      if (event.target.name == "from") date.setHours(date.getHours());
      if (event.target.name == "to") date.setHours(date.getHours() + 1);
    }
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // Format the date manually as YYYY-MM-DDTHH:mm to ensure local time is used
    const formattedDate = formatDateTimeLocal(date);

    // Update the input value
    event.target.value = formattedDate;
    props.manageData[event.target.name] = formattedDate; // Update v-model binding
    calculateRoomPrice();
  }
}

function calculateRoomPrice() {
  const fromDate = new Date(props.manageData.from);
  const toDate = new Date(props.manageData.to);

  // Check if both dates are valid
  if (
    isNaN(fromDate.getTime()) ||
    isNaN(toDate.getTime()) ||
    fromDate >= toDate
  ) {
    totalPrice.value = 0;
    return;
  }

  const differenceInMs = toDate.getTime() - fromDate.getTime();
  const differenceInHours = differenceInMs / 1000 / 60 / 60;

  if (differenceInHours < 24) {
    totalPrice.value = differenceInHours * roomData.value.data[0].hour_price;
  } else {
    const days = Math.floor(differenceInHours / 24);
    const hours = differenceInHours % 24;
    totalPrice.value =
      days * roomData.value.data[0].day_price +
      hours * roomData.value.data[0].hour_price;
  }

  props.manageData.room_price = totalPrice.value;
}

function calculateServicePrice() {
  let totalPrice = 0;

  if (serviceStatus.value != "success") return;

  services.value.forEach((room_service_id) => {
    const serviceInfo = serviceData.value.data.find(
      (service) => service.room_service_id === room_service_id
    );

    if (serviceInfo) {
      totalPrice += parseInt(serviceInfo.room_service_price);
    }
  });

  props.manageData.service_price = totalPrice;
}

watch(
  () => dialogContentVisible.value,
  async (newVal) => {
    if (newVal) {
      await roomRefresh();
      calculateRoomPrice();
      calculateServicePrice();

      if (roomStatus.value == "success") {
        if (roomData.value.booking) {
          props.manageData.room_price = roomData.value.booking.room_price;
          props.manageData.service_price = roomData.value.booking.service_price;
          props.manageData.note = roomData.value.booking.note;
          props.manageData.from = roomData.value.booking.from;
          props.manageData.to = roomData.value.booking.to;
        }
      }

      if (props.type == "add") {
        props.manageData.from = null;
        props.manageData.to = null;
      }
    }
  }
);
</script>

<style scoped>
.room_detail {
  @apply bg-ten bg-opacity-10 p-1 rounded-sm;
}
</style>
