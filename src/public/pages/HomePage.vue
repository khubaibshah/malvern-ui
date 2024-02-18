<template>
  <div class="grid grid-nogutter surface-section text-800">
    <div
      class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center"
    >
      <section>
        <div>
          <span class="block text-6xl font-bold mb-1">Welcome to</span>
          <div
            class="text-6xl text-primary font-bold mb-3"
            style="color: #f97316 !important"
          >
            Malvern Autos
          </div>
          <p class="mt-0 mb-2 text-700 line-height-3">
            To book an appointment with us, please fill in the fields below.
          </p>
          <div class="grid">
            <div class="col-12 md:col-12 lg:col-12">
              <PrimeFieldset legend="What is your car registration? *">
                <div class="flex justify-content-center flex-wrap">
                  <div
                    class="flex align-items-center justify-content-center h-4rem bg-primary font-bold border-round m-2"
                  >
                    <InputGroup
                      class="w-full md:w-30rem h-5rem flex justify-center"
                    >
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
              </PrimeFieldset>
            </div>
            <div class="col-12 md:col-12 lg:col-12">
              <PrimeFieldset legend="What is your car registration? *">
                <div class="flex justify-content-center flex-wrap">
                  <div
                    class="flex align-items-center justify-content-center h-4rem  font-bold border-round m-2"
                  >
                  <div class="flex flex-column gap-2 justify-center">
                  <InputText
                    class="w-full border-400 md:w-30rem"
                    placeholder="Enter Postcode"
                  />
                  <small id="username-help"
                    >We use this to find how far you are from our garage.</small
                  >
                </div>
                  </div>
                </div>
              </PrimeFieldset>
            </div>
            <div class="col-12 md:col-12 lg:col-12">
              <div class="flex justify-content-end flex-wrap">
                <div
                  class="flex align-items-center justify-content-center h-4rem font-bold border-round"
                >
                <PrimeButton
                label="Create Booking"
                @click="router.push({ name: 'cardetails' })"
                class="w-full"
                v-styleclass="{
                  selector: '.carDetailsForm',
                  enterActiveClass: 'my-fadein',
                }"
              />
              </div>
              </div>
            </div>
          </div>
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
import router from "@/router/router";
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
