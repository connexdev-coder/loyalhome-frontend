<template>
  <div class="flex flex-col gap-3 pb-3">
    <!-- Title -->
    <div class="font-bold flex flex-row items-center gap-1">
      <Icon :name="REPORT_ICON" class="text-4xl text-ten" />
      <h1 class="text-xl uppercase">{{ $t("reports") }}</h1>
    </div>

    {{ data }}

    <div
      class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 items-center gap-2"
    >
      <Input
        v-for="filter in filters"
        :label="filter.valueField"
        :value="filterData"
        :value-field="filter.valueField"
        :type="filter.type"
        :icon="filter.icon"
        :placeholder="filter.valueField"
        @on-change="filter.onChange"
      />
      <div class="flex flex-col items-start">
        <span class="invisible">a</span>
        <button
          @click="
            () => {
              filterData.from = '';
              filterData.to = '';
              fetchPage();
            }
          "
          class="h-10 w-10 flex items-center justify-center bg-ten rounded-sm"
        >
          <Icon :name="CLOSE_ICON" class="text-xl text-white" />
        </button>
      </div>
    </div>

    <div v-if="filterData.from == ''" class="flex flex-row items-center gap-1">
      <button
        @click="setThisMonth"
        class="bg-update text-white px-2 py-1 rounded-sm"
      >
        {{ $t("this_month") }}
      </button>
      <button
        @click="setThisYear"
        class="bg-update text-white px-2 py-1 rounded-sm"
      >
        {{ $t("this_year") }}
      </button>
      <button
        @click="setLastYear"
        class="bg-update text-white px-2 py-1 rounded-sm"
      >
        {{ $t("last_year") }}
      </button>
    </div>

    <!-- Sales And Imports -->
    <div v-if="data" class="flex flex-col lg:flex-row w-full gap-2">
      <div
        class="flex flex-col gap-2 w-full md:w-1/2 md:h-full border-2 p-3 rounded-sm"
      >
        <!-- BALLON -->
        <h1 class="text-2xl text-ten font-bold uppercase">
          {{ $t("ballon") }}
        </h1>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="span in ['ballon_cash', 'ballon_owing', 'ballon_meter']"
            class="bg-ballon text-white p-3 rounded-sm aspect-video"
          >
            <div class="flex flex-row items-center gap-1">
              <Icon :name="BALLON_ICON" class="text-lg" />
              <h1 class="line-clamp-1 text-lg">{{ $t(span) }}</h1>
            </div>
            <span class="text-2xl">
              {{
                span == "ballon_owing"
                  ? Number(data[0][span]) -
                    Number(data[0].ballon_client_payment)
                  : span == "ballon_cash"
                  ? Number(data[0].ballon_cash) + Number(data[0].ballon_owing)
                  : data[0][span]
              }}$
            </span>
          </div>
        </div>

        <!-- MDF -->
        <h1 class="text-2xl text-ten font-bold uppercase mt-3">
          {{ $t("mdf") }}
        </h1>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="span in ['mdf_cash', 'mdf_owing']"
            class="bg-mdf text-white p-3 rounded-sm aspect-video"
          >
            <div class="flex flex-row items-center gap-1">
              <Icon :name="MDF_ICON" class="text-lg" />
              <h1 class="line-clamp-1 text-lg">{{ $t(span) }}</h1>
            </div>
            <span class="text-2xl">
              {{
                span == "mdf_owing"
                  ? Number(data[0][span]) - Number(data[0].mdf_client_payment)
                  : span == "mdf_cash"
                  ? Number(data[0].mdf_cash) + Number(data[0].mdf_owing)
                  : data[0][span]
              }}$
            </span>
          </div>
        </div>
      </div>

      <!-- WAREHOUSE -->
      <div
        class="flex flex-col gap-2 w-full md:w-1/2 md:h-full border-2 p-3 rounded-sm"
      >
        <!-- Inventory -->
        <h1 class="text-2xl text-ten font-bold uppercase">
          {{ $t("import") }}
        </h1>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="span in ['import_cash', 'import_owing']"
            class="bg-inventory text-white p-3 rounded-sm aspect-video"
          >
            <div class="flex flex-row items-center gap-1">
              <Icon :name="IMPORT_ICON" class="text-lg" />
              <h1 class="line-clamp-1 text-lg">{{ $t(span) }}</h1>
            </div>
            <span class="text-2xl">
              {{
                span == "import_owing"
                  ? Number(data[0][span]) - Number(data[0].company_payment)
                  : span == "import_cash"
                  ? Number(data[0].import_cash) + Number(data[0].import_owing)
                  : data[0][span]
              }}$
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Spendings -->
    <div v-if="data" class="flex flex-col gap-2 border-2 rounded-sm p-3">
      <h1 class="text-2xl text-ten font-bold uppercase">
        {{ $t("spendings") }}
      </h1>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <div
          v-for="span in [
            'employee_salary_payment',
            'kar_spending',
            'bnchina_spending',
            'wasted_product',
          ]"
          class="bg-management text-white p-3 rounded-sm aspect-video"
        >
          <div class="flex flex-row items-center gap-1">
            <h1 class="line-clamp-1 text-lg">{{ $t(span) }}</h1>
          </div>
          <span class="text-2xl"> {{ data[0][span] }}$ </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGet } from "~/hooks/fetch";

function setThisMonth() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  filterData.value.from = firstDay.toISOString().split("T")[0];
  filterData.value.to = lastDay.toISOString().split("T")[0];
}
function setThisYear() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), 0, 1);
  const lastDay = new Date(now.getFullYear(), 11, 31);
  filterData.value.from = firstDay.toISOString().split("T")[0];
  filterData.value.to = lastDay.toISOString().split("T")[0];
}
function setLastYear() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear() - 1, 0, 1);
  const lastDay = new Date(now.getFullYear() - 1, 11, 31);
  filterData.value.from = firstDay.toISOString().split("T")[0];
  filterData.value.to = lastDay.toISOString().split("T")[0];
}

const filters = [
  {
    valueField: "from",
    type: "date",
    icon: DATE_ICON,
    onChange: () => {
      filterData.value.to == "" ? null : fetchPage();
    },
  },
  {
    valueField: "to",
    type: "date",
    icon: DATE_ICON,
    onChange: () => {
      filterData.value.from == "" ? null : fetchPage();
    },
  },
];

const filterData = ref({ from: "", to: "" });

// Backend pagination
const data = ref<any>(null);
const status = ref<any>(null);

async function fetchPage() {
  const { data: dataData, status: dataStatus }: any = await useGet(
    `reports?from=${filterData.value.from}&to=${filterData.value.to}`
  );
  data.value = dataData.value.data;
  status.value = dataStatus.value;
}

// Fetch initial page
fetchPage();
</script>
