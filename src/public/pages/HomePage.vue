<template>
  <div class="grid grid-nogutter surface-section text-800">
    <div
      class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center"
    >
      <section>
        <div v-if="!showCarDetails">
          <span class="block text-6xl font-bold mb-1">Welcome to</span>
          <div class="text-6xl text-primary font-bold mb-3" style="color:#f97316!important">Malvern Autos</div>
          <p class="mt-0 mb-4 text-700 line-height-3">
            To book an appointment with us, please fill in the fields below.
          </p>
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3">
              <InputGroup class="w-full md:w-30rem h-5rem">
                <InputGroupAddon
                  style="background-color: #00309a; color: #fbe90a"
                >
                  GB
                </InputGroupAddon>
                <InputText
                  style="background-color: #fbe90a; border-color: #00309a"
                  placeholder="REG"
                  inputClass="'bg-transparent text-900 border-400 border-blue-500'"
                  class="text-7xl w-10 text-900 font-bold"
                />
              </InputGroup>
            </div>
          </div>
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3">
              <InputText
                class="w-full border-400 md:w-30rem"
                placeholder="Enter Postcode"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3">
              <PrimeButton
                class="w-full border-400 md:w-30rem"
                label="Create Booking"
                @click="showCarDetails = true"
                v-styleclass="{
                  selector: '.carDetailsForm',
                  enterActiveClass: 'my-fadein',
                }"
              />
            </div>
          </div>
        </div>

        <div v-else class="carDetailsForm">
          <CarDetails />
        </div>
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

<script setup lang="ts">
import { ref } from "vue";
import CarDetails from "@/public/pages/CarDetails.vue";

const showCarDetails = ref(false);
</script>

<style scoped>
@keyframes my-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.my-fadein {
  animation: my-fadein 150ms linear;
}
</style>
