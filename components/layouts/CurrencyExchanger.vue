<template>
  <Dialog>
    <DialogTrigger>
      <div class="flex flex-row items-center gap-2">
        <Icon :name="EXCHANGER_ICON" class="text-2xl" />
      </div>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <h1 class="text-xl">{{ $t("currency_exchange") }}</h1>
        </DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <div class="h-[350px] overflow-y-scroll flex flex-col gap-3">
        <Input
          label="dinar_price"
          :value="filters"
          value-field="dinar_price"
          type="number"
          :icon="null"
          placeholder="dinar_price"
        />

        <OfflineSelect
          placeholder="exchange_type"
          :icon="EXCHANGER_ICON"
          :options="['dollar_dinar', 'dinar_dollar']"
          :selected-value="filters"
          field="exchange_type"
        />

        <div
          class="flex flex-row items-center gap-2"
          :class="
            filters.exchange_type === 'dollar_dinar'
              ? 'flex-row'
              : 'flex-row-reverse'
          "
        >
          <Input
            :disabled="filters.exchange_type === 'dinar_dollar'"
            label="dollar"
            :value="filters"
            value-field="dollar"
            type="text"
            :icon="null"
            placeholder="dollar"
            @on-change="exchangePrices"
          />

          <div class="flex flex-col">
            <label for="" class="invisible">a</label>
            <Icon :name="TRANSACTION_ICON" class="text-3xl" />
          </div>

          <Input
            :disabled="filters.exchange_type === 'dollar_dinar'"
            label="dinar"
            :value="filters"
            value-field="dinar"
            type="text"
            :icon="null"
            placeholder="dinar"
            @on-change="exchangePrices"
          />
        </div>

        <button
          @click="
            copyToClipboard(
              filters.exchange_type === 'dollar_dinar'
                ? filters.dinar
                : filters.dollar
            )
          "
          class="flex flex-row items-center gap-2 justify-end bg-ten text-overTen px-2 py-1 rounded-sm w-fit"
        >
          <Icon :name="COPY_ICON" class="text-xl" />
          <span>{{ $t("copy") }}</span>
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useToast } from "../ui/toast";

const { toast } = useToast();

const filters = ref({
  exchange_type: "dollar_dinar",
  dinar_price: 1500,
  dollar: 0,
  dinar: 0,
});

function exchangePrices() {
  if (filters.value.exchange_type === "dollar_dinar") {
    filters.value.dinar = filters.value.dollar * filters.value.dinar_price;
  } else {
    filters.value.dollar = filters.value.dinar / filters.value.dinar_price;
  }
}

function copyToClipboard(value: number) {
  navigator.clipboard.writeText(value.toString()).then(() => {
    toast({
      title: `Copied: ${value}`,
      variant: "default",
    });
  });
}
</script>
