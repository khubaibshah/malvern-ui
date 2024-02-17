<template>
  <div class="car-details-container">
    <span class="block text-6xl font-bold mb-1">Welcome to</span>
    <div class="text-6xl text-primary font-bold mb-3" style="color:#f97316!important">Malvern Autos</div>
    <p class="mt-0 mb-4 text-700 line-height-3">
      Is this your Vehicle?
    </p>
    <PrimeDivider></PrimeDivider>
    <div class="col-12 md:col-12 lg:col-12">
    <div class="formgrid grid">
    <div class="field col">
        <label for="reg">Registration</label>
      <input
        id="reg"
        type="text"
        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
      />
    </div>
    <div class="field col">
        <label for="Make">Make</label>
      <input
        id="Make"
        type="text"
        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
      />
    </div>
    <div class="field col">
        <label for="Make">Make</label>
      <input
        id="Make"
        type="text"
        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
      />
    </div>
</div>
    <div class="formgrid grid">
    <div class="field col">
        <label for="make">Make</label>
      <input
        id="make"
        type="text"
        class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
      />
    </div>
    <div class="field col">
        <label for="variation">Variation</label>
        <input id="variation" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
    </div>
</div>
  </div>

        
    </div>

</template>
<style scoped>
.car-details-container {
  animation: fadeIn 0.7s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
