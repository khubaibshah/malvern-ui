<script setup lang="ts">
import axios from 'axios';

import { ref, onMounted } from 'vue';

import { useVehicleStore } from '@/stores/vehicleData';

import CarDetails from '@/public/pages/CarDetails.vue';
import VehicleService from '@/services/VehicleService'
import toUpperCase from '@/components/reusable/toUpperCase'


const showCarDetails = ref(false); // Reactive variable to control whether to show the car details section
const vehData = ref(); // Reactive variable to store the vehicle details
const registrationNumber = ref(''); // Reactive variable to store the registration number input
const vehicleStore = useVehicleStore();

const dvsadata = ref(null)

const handleCarDetails = (isVisible: boolean) => {
  showCarDetails.value = isVisible
}


// Method to make a request to the backend and display the details
const getDvsa = async () => {
  try {
    const response = await VehicleService.getDvsaVehicleByReg(registrationNumber.value);
    // console.log('sdvczxv',response)
    vehData.value = response; // Assign the response data
    showCarDetails.value = true;
    vehicleStore.setVehicleData(response)
  } catch (error) {
    console.error(error);
  }
};

const getVehicleDetails = async () => {
  try {
    const response = await VehicleService.getVehicleDetails(registrationNumber.value)
    // Assuming the response contains the vehicle details
    // vehicleStore.setVehicleData(response)
    // vehData.value = response;
    showCarDetails.value = true; // Set showCarDetails to true to render the CarDetails component
    // Handle displaying the response data on the template
  } catch (error) {
    console.error(error); // Log any errors
    // Handle displaying error messages on the template
  }
};


const transformToUpperCase = () => {
  toUpperCase(registrationNumber)
};

</script>

<template>
  <div class="surface-section text-800 flex justify-content-center flex-wrap">
    <div
      v-if="!showCarDetails"
      class="col-12 md:col-12 pt-6 pr-3 pl-3 text-center md:text-left flex align-items-center justify-content-center carDetailsForm"
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
                        v-model="registrationNumber"
                        style="background-color: #fbe90a; border-color: #00309a"
                        placeholder="REG"
                        inputClass="'bg-transparent text-900 border-400 border-blue-500'"
                        class="text-5xl w-10 text-100 font-bold"
                        @input="transformToUpperCase"
                      />
                    </InputGroup>
                  </div>
                </div>
              </PrimeFieldset>
            </div>
            <div class="col-12 md:col-12 lg:col-12">
              <!-- <PrimeFieldset legend="What is your postcode? *">
                <div class="flex justify-content-center flex-wrap">
                  <div
                    class="flex align-items-center justify-content-center h-4rem font-bold border-round"
                  >
                    <div class="flex flex-column gap-2 justify-center">
                      <InputText
                        class="w-full border-400 md:w-30rem"
                        placeholder="Enter Postcode"
                      />
                      <small id="username-help"
                        >We use this to find how far you are from our
                        garage.</small
                      >
                    </div>
                  </div>
                </div>
              </PrimeFieldset> -->
              <div class="flex justify-content-end flex-wrap">
                <div
                  class="flex align-items-center justify-content-center font-bold border-round"
                >
                  <PrimeButton
                    label="Get Vehicle Details"
                    @click="getDvsa"
                    class="w-full flex justify-content-end mt-2"
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
    <div v-else>
      <!-- Render the CarDetails component when showCarDetails is true -->
      <CarDetails :vehData="vehData" @showHomePage="handleCarDetails"/>
    </div>
  </div>
</template>




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
  animation: my-fadein 200ms linear;
}
</style>
