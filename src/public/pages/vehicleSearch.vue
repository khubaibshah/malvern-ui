<script setup lang="ts">
import axios from 'axios';

import { ref, onMounted } from 'vue';

import { useVehicleStore } from '@/stores/vehicleData';

import CarDetails from '@/public/pages/CarDetails.vue';
import VehicleService from '@/services/VehicleService'
import toUpperCase from '@/components/reusable/toUpperCase'
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const showCarDetails = ref(false); // Reactive variable to control whether to show the car details section
const registrationNumber = ref(''); // Reactive variable to store the registration number input
const vehicleStore = useVehicleStore();
const isLocked = ref(false); // Controls read-only state

const resetForm = () => {
  vehData.value = {
    registration: '',
    make: '',
    model: '',
    odometerValue: '',
    odometerUnit: '',
    firstUsedDate: '',
    registrationDate: '',
    fuelType: '',
    engineSize: '',
    primaryColour: '',
  };

  form.value = {
    fullName: '',
    email: '',
    postcode: '',
    phone: '',
  };

  registrationNumber.value = '';
  isLocked.value = false;
};
const vehData = ref({
  registration: '',
  make: '',
  model: '',
  odometerValue: '',
  odometerUnit: '',
  firstUsedDate: '',
  registrationDate: '',
  fuelType: '',
  engineSize: '',
  primaryColour: '',
});
// default is null, only gets populated after API call

const form = ref({
  fullName: '',
  email: '',
  postcode: '',
  phone: '',
});



const submitSellRequest = async () => {
  try {
    const payload = {
      ...form.value,
      registration: vehData.value?.registration,
      vehicle: vehData.value, // Optional: full DVLA response if you want it
    };

    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/scs/sell-your-car`, payload);

    toast.add({
      severity: 'success',
      summary: 'Submitted!',
      detail: 'Your car details have been received.',
      life: 4000,
    });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to submit your car for sale.',
      life: 4000,
    });
  }
};


// Method to make a request to the backend and display the details for vehicle details 
const getDvsa = async () => {
  try {
    const response = await VehicleService.getDvsaVehicleByReg(registrationNumber.value);
    vehData.value = response;
    isLocked.value = true; // Lock the inputs
    showCarDetails.value = true;
    vehicleStore.setVehicleData(response)
  } catch (error) {
    console.log('sdvczxv', error)
    console.error(error);
  }
};

const transformToUpperCase = () => {
  toUpperCase(registrationNumber)
};

</script>

<template>
  <PrimeToast />
  <div class="surface-section p-5 md:p-6 lg:p-8 shadow-md rounded-xl">
    <h2 class="text-3xl font-semibold mb-4">Sell Your Car</h2>
    <PrimeDivider class="mb-4" />
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-6">
        <PrimeCard>
          <template #title>
            <p class="mb-3">
              Please get in touch using the form below and we'll get back to you via phone or email as soon as possible
              with a
              quote!.
            </p>
            <h3 class="text-lg font-semibold text-gray-700">Your Details</h3>
          </template>
          <template #content>
            <div class="grid gap-3">
              <div class="col-12">
                <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                <InputText id="fullName" v-model="form.fullName" class="w-full" placeholder="John Smith" />
              </div>

              <div class="col-12">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <InputText id="email" type="email" v-model="form.email" class="w-full" placeholder="john@example.com" />
              </div>

              <div class="col-12">
                <label for="postcode" class="block text-sm font-medium text-gray-700">Postcode</label>
                <InputText id="postcode" v-model="form.postcode" class="w-full" placeholder="B1 2AA" />
              </div>

              <div class="col-12">
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <InputText id="phone" v-model="form.phone" class="w-full" placeholder="07123 456789" />
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>
      <div class="col-12 md:col-6 lg:col-6">
        <!-- <PrimeFieldset legend="What is your car registration? *"> -->
        <div class="p-4 border-round shadow-2 bg-white mb-4">
          <h3 class="text-xl text-gray-600 font-medium ">Enter Registration</h3>
          <InputGroup class="w-full h-4rem flex justify-center mb-3">
            <InputGroupAddon style="background-color: #00309a; color: #fbe90a">
              GB
            </InputGroupAddon>
            <InputText v-model="registrationNumber" style="background-color: #fbe90a; border-color: #00309a"
              placeholder="REG" inputClass="'bg-transparent text-900 border-400 border-blue-500'"
              class="text-5xl w-full text-100 font-bold" @input="transformToUpperCase" />
          </InputGroup>
          <PrimeButton  severity="contrast" label="Generate Vehicle Details" @click="getDvsa" class="w-full flex justify-content-end mt-2"
            v-styleclass="{
              selector: '.carDetailsForm',
              enterActiveClass: 'my-fadein',
            }"  />
        </div>
        <div class="p-4 border-round shadow-2 bg-white mb-4">
          <h3 class="text-xl text-gray-600 font-medium">Vehicle Details</h3>
          <p class="text-md text-gray-600">
            Amend any information below if required, and click the button to confirm your vehicle details.
          </p>
          <div class="grid formgrid p-fluid mt-3">
            <div class="field col-12 md:col-6">
              <label for="registration">Registration</label>
              <InputText id="registration" v-model="vehData.registration" :readonly="isLocked" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="make">Make</label>
              <InputText id="make" v-model="vehData.make" :readonly="isLocked" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="model">Model</label>
              <InputText id="model" v-model="vehData.model" :readonly="isLocked" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="mileage">Mileage</label>
              <InputText id="mileage"
                :value="vehData?.odometerValue ? vehData.odometerValue + ' ' + vehData.odometerUnit : ''"
                :readonly="isLocked" />
            </div>

            <div class="field col-12 md:col-6">
              <label for="firstUsedDate">First Used Date</label>
              <InputText id="firstUsedDate" v-model="vehData.firstUsedDate" />
            </div>

            <div class="field col-12 md:col-6">
              <label for="registrationDate">Registration Date</label>
              <InputText id="registrationDate" v-model="vehData.registrationDate" :readonly="isLocked" />
            </div>

            <div class="field col-12 md:col-6">
              <label for="fuelType">Fuel Type</label>
              <InputText id="fuelType" v-model="vehData.fuelType" :readonly="isLocked" />
            </div>

            <div class="field col-12 md:col-6">
              <label for="engineSize">Engine Size</label>
              <InputText id="engineSize" v-model="vehData.engineSize" :readonly="isLocked" />
            </div>

            <div class="field col-12 md:col-6">
              <label for="primaryColour">Primary Colour</label>
              <InputText id="primaryColour" v-model="vehData.primaryColour" :readonly="isLocked" />
            </div>
          </div>
          <div class="grid">
            <div class="col-6">
              <PrimeButton label="Reset Form" class="w-full p-button-outlined text-red-500 border-red-500"
                @click="resetForm" />
            </div>
            <div class="col-6">
              <PrimeButton  severity="contrast" label="Submit Your Car for Sale" class="w-full bg-black text-white font-semibold"
                @click="submitSellRequest" />
            </div>
          </div>
        </div>
      </div>
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
