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
      <div class="bg-sixty h-full px-3 pt-4">
        <slot />
      </div>
    </div>
  </div>
</template>
