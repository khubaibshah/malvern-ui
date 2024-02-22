<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useVehicleStore } from "@/stores/vehicleData";
import VehicleService from "@/services/VehicleService";
import JobCategoryService from "@/services/JobCategoryService";

import Ordersummary from "./Ordersummary.vue";
import router from "@/router/router";

const vehicleStore = useVehicleStore();
const registrationNumber = ref("");
const vehicleData = ref();
const JobCatergories = ref();
const getVehicleDataStore = vehicleStore.getVehicleData;
const jobNodes = ref([]);


const GetStoreData = () => {
  if (getVehicleDataStore) {
    vehicleData.value = getVehicleDataStore;
    registrationNumber.value = getVehicleDataStore.registrationNumber || "";
  }
}
const handleRegistrationNumberChange = async () => {
    try {
      const vesApiCall = await VehicleService.getVehicleDetails(
        registrationNumber.value
      );
      vehicleData.value = vesApiCall;
      vehicleStore.setVehicleData(vesApiCall);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
};

const getJobCategories = async () => {
  try {
    const jobCategories = await JobCategoryService.getJobCat();
    JobCatergories.value = jobCategories;
    const nodes = jobCategories.map(category => ({
      label: category.job_category,
      icon: "pi pi-wrench"
    }));
    jobNodes.value = nodes;
  } catch (error) {
    console.error("Error fetching job categories:", error);
  }
};

onMounted(() => {
  getJobCategories();
  GetStoreData();
});
</script>

<template>
  <div class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container">
    <div
      class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border mb-3"
    >
      <div class="mb-3 lg:mb-0">
        <div class="text-3xl font-medium text-900 mb-3">Book Repairs</div>
        <div class="text-500 mr-0 md:mr-3">
          Below you can book the repairs you need
        </div>
      </div>
      <span class="p-input-icon-left w-full md:w-auto">
        <i class="pi pi-search"></i>
        <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
      </span>
    </div>
    <!-- align-items-center justify-content-center -->
    <div class="grid">
      <div class="col-12 md:col-12 lg:col-3">
        <div class="surface-card border-round">
          <div class="text-3xl font-medium text-900 mb-2">Your Car</div>
          <div class="font-medium text-500 mb-3">
            Below are your car details.
          </div>
          <div class="surface-border mb-2">
            <InputGroup class="w-full">
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
                class="text-2xl w-10 text-100 font-bold"
              />
            </InputGroup>
          </div>
          <div class="font-medium text-500 mb-3">
            <div class="flex justify-content-between flex-wrap">
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                Not your car? Type in your Reg
                <PrimeButton
                  label="and click me"
                  text
                  @click="handleRegistrationNumberChange"
                />
              </div>
            </div>
          </div>

          <div class="font-medium text-500 mb-3">
            <div
              class="flex justify-content-between flex-wrap mt-3"
              v-if="vehicleData"
            >
              <div
                class="flex align-items-center justify-content-center font-bold border-round mb-2"
              >
                Vehicle Make
              </div>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                {{ vehicleData.make }}
              </div>
              <PrimeDivider></PrimeDivider>
              <div
                class="flex align-items-center justify-content-center font-bold border-round mb-2"
              >
                Vehicle Colour
              </div>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                {{ vehicleData.colour }}
              </div>
              <PrimeDivider></PrimeDivider>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                Vehicle Engine
              </div>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                {{ vehicleData.engineCapacity }}
              </div>
              <PrimeDivider></PrimeDivider>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                Vehicle Fuel Type
              </div>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                {{ vehicleData.fuelType }}
              </div>
              <PrimeDivider></PrimeDivider>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                Manufacture Date
              </div>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                {{ vehicleData.yearOfManufacture }}
              </div>
              <PrimeDivider></PrimeDivider>
            </div>
          </div>
        </div>
        <div class="surface-card border-round">
          <div class="text-2xl text-500 mb-3">Search for repairs below.</div>
        </div>
        <PrimeTree
          class="w-full"
          :value="jobNodes"
          :filter="true"
          filterMode="lenient"
          style="padding-left: 0"
        ></PrimeTree>
      </div>
      <div class="col-12 md:col-12 lg:col-6">
        <div class="px-0 py-4 md:px-4">
          <div class="border-round surface-card">
            <div class="text-2xl text-500 mb-3">Avaliable Repairs</div>
            <PrimeDivider></PrimeDivider>
            <div class="grid">
              <div class="col-12 md:col-12 lg:col-4">
                <PrimeCard
                  style="
                    border-style: solid;
                    border-color: darkgoldenrod !important;
                  "
                  v-ripple
                  class="p-ripple flex select-none border-round font-bold"
                >
                  <template #title>Repairs 1</template>
                  <template #content>
                    <p class="m-0">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Inventore sed consequuntur error repudiandae numquam
                      deserunt quisquam repellat libero asperiores earum nam
                      nobis, culpa ratione quam perferendis esse, cupiditate
                      neque quas!
                    </p>
                  </template>
                </PrimeCard>
              </div>
              <div class="col-12 md:col-12 lg:col-4">
                <PrimeCard
                  style="
                    border-style: solid;
                    border-color: darkgoldenrod !important;
                  "
                  v-ripple
                  class="p-ripple flex select-none border-round font-bold"
                >
                  <template #title>Repairs 1</template>
                  <template #content>
                    <p class="m-0">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Inventore sed consequuntur error repudiandae numquam
                      deserunt quisquam repellat libero asperiores earum nam
                      nobis, culpa ratione quam perferendis esse, cupiditate
                      neque quas!
                    </p>
                  </template>
                </PrimeCard>
              </div>
              <div class="col-12 md:col-12 lg:col-4">
                <PrimeCard
                  style="
                    border-style: solid;
                    border-color: darkgoldenrod !important;
                  "
                  v-ripple
                  class="p-ripple flex select-none border-round font-bold"
                >
                  <template #title>Repairs 1</template>
                  <template #content>
                    <p class="m-0">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Inventore sed consequuntur error repudiandae numquam
                      deserunt quisquam repellat libero asperiores earum nam
                      nobis, culpa ratione quam perferendis esse, cupiditate
                      neque quas!
                    </p>
                  </template>
                </PrimeCard>
              </div>
            </div>
            <!-- <PrimeCard>
    <template #title>Simple Card</template>
    <template #content>
        <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
            quas!
        </p>
    </template>
</PrimeCard> -->
          </div>
        </div>
      </div>
      <div class="col-12 md:col-12 lg:col-3">
        <Ordersummary />
      </div>
    </div>
  </div>
</template>
