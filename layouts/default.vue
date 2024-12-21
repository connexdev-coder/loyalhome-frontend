<template>
  <div
    class="flex flex-row items-stretch overflow-hidden h-screen bg-underSixty"
  >
    <PanelToolbar />

    <div
      class="flex flex-col gap-1 flex-1 overflow-hidden overflow-y-auto h-screen"
    >
      <Header />
      <!-- slots -->
      <div class="bg-sixty h-full px-3 py-2 pb-10">
        <slot />
      </div>
    </div>
  </div>
</template>
