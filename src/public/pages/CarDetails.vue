<script setup lang="ts">
import { useRouter } from "vue-router";
import { useVehicleStore } from "@/stores/vehicleData";
import VehicleService from "@/services/VehicleService";
import { onMounted, ref } from "vue";
const vehicleData = useVehicleStore()
const dvsadata = ref(null)
const getVehicleData = vehicleData.getVehicleData;

const emit = defineEmits(['showHomePage']); // Define the emit function to use event emitting

const router = useRouter();
const showHomePage = () => {

  emit('showHomePage'); // Emit the 'showHomePage' event
  router.push('/'); // Navigate to the main page
};


onMounted(() => {
  // getDvsa();
});
</script>
<template>

  <div class="surface-section text-800 flex justify-content-center flex-wrap my-fadein">
    <div
      class="col-12 md:col-12 pt-4 pr-3 pl-3 text-center flex align-items-center justify-content-center"
    >
      <section>
        <div>
          <!-- {{ getVehicleData }} -->
          <span class="block text-6xl font-bold mb-1">Welcome to</span>
          <div
            class="text-6xl text-primary font-bold mb-3"
            style="color: #f97316 !important"
          >
            Malvern Autos
          </div>
          <p class="mt-0 mb-2 text-700 line-height-3">
            Please Confirm your Vehicle Details below.
          </p>
          <div class="grid">
            <div class="col-12 md:col-12 lg:col-12 text-left">
              <PrimeFieldset legend="Is this your Vehicle?*">
                <div class="flex justify-content-center flex-wrap">
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round m-2"
                  >
                  <i class="pi pi-car" style="font-size: 2.5rem"></i>
                  </div>
                  </div>
                <div class="flex justify-content-center flex-wrap">
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round m-2"
                  >
                  
                    <InputGroup
                      class="w-full md:w-20rem h-3rem flex justify-center"
                    >
                      <InputGroupAddon
                        style="background-color: #00309a; color: #fbe90a"
                      >
                        GB
                      </InputGroupAddon>
                      <InputText
                        v-model="getVehicleData.registration"
                        style="background-color: #fbe90a; border-color: #00309a"
                        placeholder="REG"
                        inputClass="'bg-transparent text-900 border-400 border-blue-500'"
                        class="text-2xl w-10 text-100 font-bold"
                        readonly
                      />
                    </InputGroup>
                  </div>
                </div>
                <div class="flex justify-content-between flex-wrap mt-3">
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round mb-2"
                  >
                    Vehicle Make
                  </div>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round"
                  >
                    {{ getVehicleData.make }}
                  </div>
                  <PrimeDivider></PrimeDivider>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round mb-2"
                  >
                    Vehicle Model
                  </div>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round"
                  >
                    {{ getVehicleData.model }}
                  </div>
                  <PrimeDivider></PrimeDivider>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round mb-2"
                  >
                    Vehicle Colour
                  </div>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round "
                  >
                    {{ getVehicleData.primaryColour }}
                  </div>
                  <PrimeDivider></PrimeDivider>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round mb-2"
                  >
                    Vehicle Engine
                  </div>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round "
                  >
                    {{ getVehicleData.engineSize }}
                  </div>
                  <PrimeDivider></PrimeDivider>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round mb-2"
                  >
                    Vehicle Fuel Type
                  </div>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round "
                  >
                    {{ getVehicleData.fuelType }}
                  </div>
                  <PrimeDivider></PrimeDivider>
                  <!-- <div
                    class="flex align-items-center justify-content-center font-bold border-round mb-2"
                  >
                    Manufacture Date
                  </div>
                  <div
                    class="flex align-items-center justify-content-center font-bold border-round "
                  >
                    {{ getVehicleData.yearOfManufacture }}
                  </div>
                  <PrimeDivider></PrimeDivider> -->
                </div>
              </PrimeFieldset>
              <div class="flex justify-content-between flex-wrap mt-2">
                <div
                  class="flex align-items-center justify-content-center font-bold border-round"
                >
                  <PrimeButton
                    label="Not my car"
                    text
                    class="mt-2"
                    icon="pi pi-arrow-left"
                    @click="showHomePage()"
                  />
                </div>
                <div
                  class="flex align-items-center justify-content-center font-bold border-round"
                >
                  <PrimeButton
                    label="Get Vehicle Details"
                    @click="router.push({name:'bookJob'})"
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
  animation: my-fadein 150ms linear;
}
</style>