<script setup lang="ts">
import axios from 'axios';

import { ref, onMounted } from 'vue';

import { useVehicleStore } from '@/stores/vehicleData';

import CarDetails from '@/public/pages/CarDetails.vue';
import VehicleService from '@/services/VehicleService'
import toUpperCase from '@/components/reusable/toUpperCase'
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const valuation = ref<any | null>(null);
const loadingValuation = ref(false);
const showCarDetails = ref(false); // Reactive variable to control whether to show the car details section
const formLocked = ref(false); // hide form inputs after valuation


const clearValuation = () => {
  formLocked.value = false;
  valuation.value = null;
};

const registrationNumber = ref(''); // Reactive variable to store the registration number input
const vehicleStore = useVehicleStore();
const isLocked = ref(false); // Controls read-only state
const partEx = ref(false); // Default sale type
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
    partEx: partEx.value,
  };

  form.value = {
    fullName: '',
    email: '',
    postcode: '',
    phone: '',
  };

  registrationNumber.value = '';
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
  partEx: partEx.value, // Default partEx value
});


// default is null, only gets populated after API call
const form = ref({
  fullName: '',
  email: '',
  postcode: '',
  phone: '',
});
const formErrors = ref({
  fullName: false,
  email: false,
  postcode: false,
  phone: false,
});

const getValuation = async () => {
  try {
    if (!vehData.value.registration || !vehData.value.odometerValue) {
      throw new Error('Missing registration or mileage for valuation');
    }

    loadingValuation.value = true;

    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/scs/at/${vehData.value.registration}/${vehData.value.odometerValue}`
    );

    valuation.value = res.data.data;

    // valuation.value = response.data?.valuation; // ✅ This must be present
    formLocked.value = true;
    toast.add({
      severity: "success",
      summary: "Valuation Retrieved",
      detail: `Valuation for ${vehData.value.registration}`,
      life: 3000,
    });
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Valuation Failed",
      detail: err.response?.data?.message || "Could not get valuation",
      life: 5000,
    });
  } finally {
    loadingValuation.value = false;
  }
};


//make post request to the backend to submit the form
const submitSellRequest = async () => {
  // Reset all errors
  formErrors.value = {
    fullName: !form.value.fullName,
    email: !form.value.email,
    postcode: !form.value.postcode,
    phone: !form.value.phone,
  };

  // If any are true, stop submission
  if (Object.values(formErrors.value).some(v => v)) {
    toast.add({
      severity: 'error',
      summary: 'Missing Fields',
      detail: 'Please complete all required fields.',
      life: 4000,
    });
    return;
  }
  try {
    const payload = {
      ...form.value,
      registration: vehData.value?.registration,
      vehicle: vehData.value,
      partEx: vehData.value?.partEx ?? false, // <-- explicitly include
    };


    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/scs/lead/sell-your-car`, payload);

    await getValuation();
    // toast.add({
    //   severity: 'success',
    //   summary: 'Submitted!',
    //   detail: 'Your car details have been received. You will be contacted shortly.',
    //   life: 4000,
    // });
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
    // await getValuation(); 
    isLocked.value = true; // Lock the inputs
    showCarDetails.value = true;
    vehicleStore.setVehicleData(response) 

  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to retrieve vehicle details. Please check the registration number.',
      life: 4000,
    });
    // console.log('sdvczxv', error)
    // console.error(error);
  }
};


const transformToUpperCase = () => {
  toUpperCase(registrationNumber)
};

</script>

<template>
  <PrimeToast />

  <div class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container">
    <div class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
      <div class="text-3xl font-medium text-900 mb-3" style="margin-left: 3px;">Trade In or Sell</div>
      <div class="text-500">Get the Best Offer for Your Car</div>
    </div>
  </div>

  <div class="surface-section p-5 md:p-6 lg:p-8 shadow-md rounded-xl car-details-container">

    <!-- ✅ Valuation Card Only (when form is locked) -->
    <PrimeCard v-if="formLocked && valuation" class="mb-4 text-center">
      <template #title>
        <h3 class="text-lg font-semibold text-gray-700">Estimated Valuation</h3>
      </template>
      <template #content>
        <div class="text-lg font-medium text-gray-800 mb-2">
          {{ valuation.make }} {{ valuation.model }} ({{ valuation.registration }})
        </div>
        <div class="text-sm text-gray-600 mb-2">
          {{ valuation.fuelType }} - {{ valuation.colour }} - {{ valuation.generation }}
        </div>
        <div class="grid">
          <div class="col-12">
            <div class="p-3 surface-100 border-round text-center">
              <div class="text-sm text-gray-500">Part Exchange Value</div>
              <div class="text-2xl font-bold text-green-600">£{{ valuation.valuations.partExchange.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </template>
    </PrimeCard>

    <!-- 🔙 Back to Edit Button -->
    <div class="mb-3 flex justify-end" v-if="formLocked">
      <PrimeButton label="Back to Edit" icon="pi pi-pencil" severity="contrast" @click="clearValuation" />
    </div>

    <!-- 🧾 Full Form (only shown when not locked) -->
    <div v-if="!formLocked" class="grid">
      <!-- 👤 Your Details -->
      <div class="col-12 md:col-6">
        <PrimeCard>
          <template #title>
            <p class="mb-3">
              Please get in touch using the form below and we'll get back to you via phone or email as soon as possible with a quote!
            </p>
            <h3 class="text-lg font-semibold text-gray-700">Your Details</h3>
          </template>
          <template #content>
            <div class="grid gap-3">
              <div class="col-12">
                <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                <InputText id="fullName" v-model="form.fullName" class="w-full" placeholder="John Smith" />
                <PrimeInlineMessage v-if="formErrors.fullName" severity="error">Full name is required</PrimeInlineMessage>
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

      <!-- 🚗 Vehicle Info -->
      <div class="col-12 md:col-6">
        <!-- Part Ex Toggle -->
        <div class="p-4 border-round shadow-2 bg-white mb-4">
          <h3 class="text-xl text-gray-600 font-bold">Part Ex?</h3>
          <PrimeToggleButton v-model="vehData.partEx" class="w-6rem" onLabel="Yes" offLabel="No" severity="contrast" />
        </div>

        <!-- Registration Input -->
        <div class="p-4 border-round shadow-2 bg-white mb-4">
          <h3 class="text-xl text-gray-600 font-medium">Enter Registration</h3>
          <InputGroup class="w-full h-4rem flex justify-center mb-3">
            <InputGroupAddon style="background-color: #00309a; color: #fbe90a">GB</InputGroupAddon>
            <InputText
              v-model="registrationNumber"
              style="background-color: #fbe90a; border-color: #00309a"
              placeholder="REG"
              class="text-5xl w-full text-100 font-bold"
              @input="transformToUpperCase"
            />
          </InputGroup>
          <PrimeButton severity="contrast" label="Generate Vehicle Details" @click="getDvsa"
            class="w-full flex justify-content-end mt-2" />
        </div>

        <!-- Vehicle Info Form -->
        <div class="p-4 border-round shadow-2 bg-white mb-4">
          <h3 class="text-xl text-gray-600 font-medium">Vehicle Details</h3>
          <p class="text-md text-gray-600">Amend any information below if required, and click the button to confirm your vehicle details.</p>
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
              <InputText
                id="mileage"
                :value="vehData?.odometerValue ? vehData.odometerValue + ' ' + vehData.odometerUnit : ''"
                :readonly="isLocked"
              />
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

          <!-- Form Buttons -->
          <div class="grid mt-3">
            <div class="col-6">
              <PrimeButton label="Reset Form" class="w-full p-button-outlined text-red-500 border-red-500"
                @click="resetForm" />
            </div>
            <div class="col-6">
              <PrimeButton
                severity="contrast"
                label="Submit"
                class="w-full bg-black text-white font-semibold"
                @click="submitSellRequest"
              />
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
