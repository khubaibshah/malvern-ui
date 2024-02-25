<script setup lang="ts">
import { onMounted, ref, defineProps } from "vue";
import { useToast } from "primevue/usetoast";

import { useVehicleStore } from "@/stores/vehicleData";
import VehicleService from "@/services/VehicleService";
import JobCategoryService from "@/services/JobCategoryService";
import toUpperCase from '@/components/reusable/toUpperCase'

import Ordersummary from "./Ordersummary.vue";

const vehicleStore = useVehicleStore();
const registrationNumber = ref("");
const vehicleData = ref();

const JobSubCatergories = ref();
const getVehicleDataStore = vehicleStore.getVehicleData;

const Subcategories = ref();
const selectedSubcategory = ref()
const mainCat = ref()


const selectedRepairs = ref([]); // Array to store selected repairs

const registrationSuccess = ref(false); // Flag to track registration success

const props = defineProps<{
  selectedSubcategory: any;
}>();

const selectedKey = ref();
const toast = useToast();

const nodes = ref([
  {
      key: 1,
      label: 'Transmission',
      icon: 'pi pi-wrench',  
  },
  {
      key: 2,
      label: 'Electrical',
      icon: 'pi pi-wrench',  
  },
  {
      key: 3,
      label: 'Engine',
      icon: 'pi pi-wrench',  
  },
  {
      key: 4,
      label: 'Brakes',
      icon: 'pi pi-wrench',
  }
]);

const transformToUpperCase = () => {
  toUpperCase(registrationNumber)
};

const GetStoreData = () => {
  if (getVehicleDataStore) {
    vehicleData.value = getVehicleDataStore;
    console.log('storeData', getVehicleDataStore[0].registration)
    registrationNumber.value = getVehicleDataStore[0].registration || "";
    registrationSuccess.value = !!registrationNumber.value; // Set registrationSuccess to true if registrationNumber is present
  }
}

const handleRegistrationNumberChange = async () => {
  try {
    const vesApiCall = await VehicleService.getDvsaVehicleByReg(registrationNumber.value);
    vehicleData.value = vesApiCall;
    vehicleStore.setVehicleData(vesApiCall);
    registrationSuccess.value = true; // Set registrationSuccess to true upon successful registration
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    registrationSuccess.value = false; // Set registrationSuccess to false if there's an error
  }
};

const getJobSubCategories = async (node: any) => {
  if (!registrationNumber.value) {
    // Display error toast if registration number is empty
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please enter a registration number.' });
    return;
  }else{
     try {
    const jobSubCategories = await JobCategoryService.getjobsAndSubJobs();
    const selectedCategory = jobSubCategories.find(category => category.job_subcategory_id === node.key);
    mainCat.value = selectedCategory

    if (selectedCategory) {
      Subcategories.value = selectedCategory.subcategories
    } else {
      console.log('No matching category found for node key:', node.key);
    }
    JobSubCatergories.value = jobSubCategories;
  } catch (error) {
    console.error("Error fetching job subcategories:", error);
  }
  }
 
};

const handlePrimeCardClick = (category: any, subcategory: any) => {
  console.log("Clicked PrimeCard cat and sub cat : ", category, subcategory);
  selectedSubcategory.value = subcategory;
  const index = selectedRepairs.value.findIndex(rep => rep.id === subcategory.id);
  if (index !== -1) {
    selectedRepairs.value.splice(index, 1, subcategory);
    toast.add({ severity: 'warn', summary: 'Already Selected', detail: 'This repair was already selected.' });
  } else {
    selectedRepairs.value.push(subcategory);
    toast.add({ severity: 'success', summary: 'Repair Selected', detail:  subcategory.job_subcategory_job +' was selected.' });
  }
};

const removeSelectedRepair = (repairId: any) => {
  const index = selectedRepairs.value.findIndex(rep => rep.id === repairId);
  if (index !== -1) {
    toast.add({ severity: 'success', summary: 'Removed', detail:  'Repair was removed.' });
    selectedRepairs.value.splice(index, 1);
    console.log('removed repair item', selectedRepairs);
  }
};

onMounted(() => {
  GetStoreData();
  if (nodes.value.length > 0) {
    selectedKey.value = nodes.value[0].key;
    getJobSubCategories(nodes.value[0]);
  }
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
                @input="transformToUpperCase"
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
              v-if="vehicleData" v-for="VehData in vehicleData"
            >
              <div
                class="flex align-items-center justify-content-center font-bold border-round mb-2"
              >
                Vehicle Make
              </div>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                {{ VehData.make }}
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
                {{ VehData.model }}
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
                {{ VehData.primaryColour }}
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
                {{ VehData.engineSize }}
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
                {{ VehData.fuelType }}
              </div>
              <PrimeDivider></PrimeDivider>
              <!-- <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                Manufacture Date
              </div>
              <div
                class="flex align-items-center justify-content-center font-bold border-round"
              >
                {{ VehData.yearOfManufacture }}
              </div>
              <PrimeDivider></PrimeDivider> -->
            </div>
          </div>
        </div>
        <div class="surface-card border-round">
          <div class="text-1xl text-500 mb-3 font-bold">Select a Category or Search for repairs below.</div>
        </div>
      <PrimeToast />
        <PrimeTree v-model:selectionKeys="selectedKey" :filter="true"
        filterMode="lenient" :value="nodes" selectionMode="single"
            @nodeSelect="getJobSubCategories" class="w-full"
            style="padding-left: 0"></PrimeTree>
      </div>
      <div class="col-12 md:col-12 lg:col-6">
        <div class="px-0 py-4 md:px-4">
          <div class="border-round surface-card">
            <div class="text-2xl text-500 mb-3">Avaliable Repairs</div>
            <PrimeDivider></PrimeDivider>
            <div class="grid" v-if="registrationSuccess && (registrationNumber || vehicleData)">
              <div class="col-12 md:col-12 lg:col-4" v-for="subcategory in Subcategories" :key="subcategory.id">

                <PrimeCard
                  style="
                    border-style: solid;
                    border-color: darkgoldenrod !important;"
                    @click="handlePrimeCardClick(mainCat.job_category, subcategory)"
                  v-ripple
                  class="p-ripple flex select-none border-round font-bold"
                >
                  <template #title>{{subcategory.job_subcategory_job}}</template>
                  <template #content>
                    <p class="m-0">
                      {{ subcategory.job_subcategory_price }}
                    </p>
                  </template>
                </PrimeCard>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-12 lg:col-3">
        <Ordersummary :selectedSubcategory="selectedSubcategory" 
        :mainCat="mainCat" 
        :selectedRepairs="selectedRepairs" 
        :vehicleData="vehicleData"
         @repairRemoved="removeSelectedRepair"/>

      </div>
    </div>
  </div>
</template>
<style scoped>
  .grey-background {
    background-color: #f0f0f0; /* Apply grey background color */
  }
</style>

