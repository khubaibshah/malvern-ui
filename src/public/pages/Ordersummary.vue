<script lang="ts" setup>

import router from "@/router/router";
import { ref, type PropType, computed, watch } from "vue";
import { useToast } from "primevue/usetoast";

import { useBookingStore } from "@/stores/BookingStore";


const date = ref<Date | null>(null); // Define date property
const removeJobDialog = ref(false);
const fullBookingDetails = ref<any>({});

const bookingStore = useBookingStore(); // Accessing the bookingstore store
const toast = useToast();

// Define $filters object with formatDate method
const $filters = {
  formatDate(date: Date): string {
    // Implement your date formatting logic here
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  },
};
interface Subcategory {
  id: number;
  name: string;
  price: number;
}
interface MainCategory {
  name: string;
}
interface SelectedRepairs {
  id: any;
  job_subcategory_job: string;
  job_subcategory_price: string;
}
interface VehicleData {
  registration: string;
  make: string;
  model: string;
  firstUsedDate: string;
  fuelType: string;
  primaryColour: string;
  vehicleId: string;
  registrationDate: string;
  manufactureDate: string;
  engineSize: string;
}
const props = defineProps({
  selectedSubcategory: {
    type: Object as PropType<Subcategory>,
    required: true,
  },
  mainCat: {
    type: Object as PropType<MainCategory>,
    required: true,
  },
  selectedRepairs: {
    type: Array as PropType<SelectedRepairs[]>,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  vehicleData: {
    type: Object as PropType<VehicleData>,
    required: true,
  },
});
const emits = defineEmits(["repairRemoved"]);

const removeSelectedRepair = (repairId: any) => {
  emits("repairRemoved", repairId);
};

const isButtonDisabled = computed(() => {
  // Check if vehicleData exists and is not empty
  return (
    !date.value ||
    !props.vehicleData ||
    !props.vehicleData.registration ||
    // Check if selectedRepairs is empty
    props.selectedRepairs.length === 0
  );
});

// Calculate total amount
const calculateTotalAmount = computed(() => {
  let total = 0;
  // Check if fullBookingDetails and selectedRepairs exist
  if (fullBookingDetails.value && fullBookingDetails.value.selectedRepairs) {
    // Iterate over selectedRepairs and sum up the job_subcategory_price values
    fullBookingDetails.value.selectedRepairs.forEach((repair : any) => {
      total += parseFloat(repair.job_subcategory_price);
    });
  }
  // Return the total amount
  return total.toFixed(2); // Return the total amount with two decimal places
});

watch(
  [date, () => props.vehicleData, props.selectedRepairs],
  ([newDate, newVehicleData, newSelectedRepairs]) => {
    bookingStore.setFullBookingDetails({
      date: newDate,
      registration: newVehicleData?.registration || "",
      make: newVehicleData?.make || "",
      model: newVehicleData?.model || "",
      totalAmount: calculateTotalAmount.value, // Add the totalAmount property
      selectedRepairs: newSelectedRepairs.map((repair: any) => ({
        job_subcategory_job: repair.job_subcategory_job,
        job_subcategory_price: repair.job_subcategory_price,
      })),
      
    });
    // console.log('full amount for object ',calculateTotalAmount._value)
    fullBookingDetails.value.date = newDate;

    if (newVehicleData) {
  const { registration, make, model } = newVehicleData;
  fullBookingDetails.value.registration = registration || "";
  fullBookingDetails.value.make = make || "";
  fullBookingDetails.value.model = model || "";
}

    // Check if there are selected repairs
    if (newSelectedRepairs && newSelectedRepairs.length > 0) {
      const selectedRepairsDetails = newSelectedRepairs.map((repair) => ({
        job_subcategory_job: repair.job_subcategory_job,
        job_subcategory_price: repair.job_subcategory_price,
      }));
      // Only add selectedRepairsDetails if there are selected repairs
      fullBookingDetails.value.selectedRepairs = selectedRepairsDetails;
    }
  }
);


watch(date, (newDate, oldDate) => {
  if (newDate && newDate < new Date()) {
    // Show a toast if the selected date is in the past
    toast.add({
      severity: "warn",
      summary: "Invalid Date",
      detail: "Please pick a date in the future.",
      life: 5000, // Display duration in milliseconds
    });
    // Reset the date to null or any default value
    date.value = null;
  }
});


</script>

<template>
  <PrimeDialog
    v-model:visible="removeJobDialog"
    maximizable
    modal
    header="Remove Repairs"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div v-for="deleteRepairs in selectedRepairs">
      <div class="grid">
        <div class="col">
          <div class="text-left border-round-sm font-bold">
            {{ deleteRepairs.job_subcategory_job }}
          </div>
        </div>
        <div class="col">
          <div class="text-right border-round-sm font-bold">
            <PrimeButton
              icon="pi pi-trash"
              class="text-600 p-button-text p-button-rounded"
              @click="removeSelectedRepair(deleteRepairs.id)"
            ></PrimeButton>
          </div>
        </div>
      </div>
    </div>
  </PrimeDialog>
  <div class="px-0 py-4">
    <div class="border-round surface-card">
      <div class="text-2xl text-500 mb-3">Summary</div>
      <PrimeDivider></PrimeDivider>
      <PrimeCard
        style="border-style: solid; border-color: darkgoldenrod !important"
      >
        <template #title
          ><div
            class="flex justify-content-between align-items-center border-bottom-1 pb-3 surface-border"
          >
            <span class="text-900 font-medium text-lg lg:text-xl"
              ><i class="pi pi-shopping-cart text-xl mr-2"></i>Your Order
            </span>
            <a
              tabindex="0"
              class="text-600 font-medium cursor-pointer hover:text-primary"
              >Edit Cart</a
            >
          </div>
        </template>
        <template #content>
          <span class="text-900 font-medium text-lg lg:text-xl"
            ><i class="pi pi-calendar text-xl mt-2"></i> Pick A Date &
            Time</span
          >
          <div class="py-2 mt-3 border-bottom-1 surface-border mb-4">
            <PrimeCalendar
              v-model="date"
              dateFormat="dd/mm/yy"
              showTime
              hourFormat="12"
              touchUI
              class="w-full"
              placeholder="dd/mm/yy"
            />
          </div>
          <span class="text-900 font-medium">Your Selected Repairs</span>
          <div
            class="flex flex-column lg:flex-row flex-wrap lg:align-items-center border-bottom-1 surface-border mt-5"
          >

            <div class="flex-auto lg:ml-3" v-if="props.mainCat">
              <div
                class="flex align-items-center justify-content-between"
              ></div>

              <div v-if="props.selectedRepairs && props.selectedRepairs.length">

                <div
                  v-if="props.selectedRepairs && props.selectedRepairs.length"
                >
                  <div
                    v-for="repairs in props.selectedRepairs"
                    :key="repairs.id"
                  >
                  <!-- {{ console.log('selected repairs', props.selectedRepair) }} -->
                    <div class="grid">
                      <div class="col-9 p-0">
                        <div class="text-left border-round-sm font-bold">
                          {{ repairs.job_subcategory_job }}
                        </div>
                      </div>
                      <div class="col-9 p-0">
                        <div class="text-left border-round-sm font-bold">
                          {{ repairs.job_subcategory_price }}
                        </div>
                      </div>
                      <div class="col-3 p-0">
                        <div class="text-right border-round-sm font-bold">
                          <PrimeButton
                            icon="pi pi-trash"
                            class="text-600 p-button-text p-button-rounded"
                            @click="removeSelectedRepair(repairs.id)"
                          ></PrimeButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex flex-auto justify-content-end align-items-center"
              >
                <PrimeButton
                  icon="pi pi-trash"
                  class="text-600 p-button-text p-button-rounded"
                  @click="removeJobDialog = true"
                ></PrimeButton>
              </div>
            </div>
          </div>
          <div class="py-2 mt-3 border-bottom-1 surface-border">
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-900">Date for Repairs</span>
              <span class="text-900">{{
                $filters.formatDate(new Date())
              }}</span>
            </div>
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-900">Subtotal</span>
              <span class="text-900">$12.00</span>
            </div>
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-900">Shipping</span>
              <span class="text-900">Free</span>
            </div>
            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-900">Total</span>
              {{ console.log('full amount',calculateTotalAmount) }}
              <span class="text-900 font-bold">{{ calculateTotalAmount }}</span>
            </div>
          </div>
          <!-- <div v-if="fullBookingDetails">
              <span class="text-900 font-medium">Full Booking Details:</span>
              <div>{{ fullBookingDetails }}</div>
          </div> -->
          <PrimeButton
            class="p-button-primary w-full mt-3"
            label="Confirm Booking"
            @click="router.push({ name: 'payment' })"
            :disabled="isButtonDisabled"
          ></PrimeButton>
        </template>
      </PrimeCard>
    </div>
  </div>
</template>
<style scoped>
.disabled {
  opacity: 0.5; /* Adjust opacity to your preference */
  pointer-events: none;
}
</style>
