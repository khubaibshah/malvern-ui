<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>
<template>
  <div class="grid grid-nogutter surface-section text-800">
    <div
      class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center"
    >
      <section>
        <div class="car-details-container">
          <span class="block text-6xl font-bold mb-1">Welcome to</span>
          <div
            class="text-6xl text-primary font-bold mb-3"
            style="color: #f97316 !important"
          >
            Malvern Autos
          </div>
          <p class="mt-0 mb-4 text-700 line-height-3">
            Please confirm this is your car.
          </p>
          <div class="grid">
            <div class="col-12 md:col-12 lg:col-4">
              <input
                id="reg"
                type="text"
                class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                placeholder="Registration"
              />
            </div>
            <div class="col-12 md:col-12 lg:col-4">
              <input
                id="Make"
                type="text"
                class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                placeholder="Make"
              />
            </div>
            <div class="col-12 md:col-12 lg:col-4">
              <input
                id="Model"
                type="text"
                class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                placeholder="Model"
              />
            </div>
            <div class="col-12 md:col-12 lg:col-6">
              <input
                id="variation"
                type="text"
                class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                placeholder="variation"
              />
            </div>

            <div class="col-12 md:col-12 lg:col-6">

              <input
                  id="milage"
                  type="text"
                  class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                  placeholder="milage"
                />
            </div>

            <div class="col-12 md:col-12 lg:col-4">

              <PrimeButton
                  class="w-full border-400 md:w-15rem"
                  label="Next Step"
                  v-styleclass="{
                    selector: '.carDetailsForm',
                    enterActiveClass: 'my-fadein',
                  }"
                  @click="router.push({ name: 'bookJob' })"
                />

            </div>
          </div>

          
        </div>

        <!-- <div v-else class="carDetailsForm">
            <CarDetails />
          </div> -->
      </section>
    </div>
    <div class="col-12 md:col-6 overflow-hidden" style="height: 60vh">
      <img
        src="../../assets/img/hero-bg.jpg"
        alt="Image"
        class="md:ml-auto block md:h-full"
        style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)"
      />
    </div>
  </div>
</template>
