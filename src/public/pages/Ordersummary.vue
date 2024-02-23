<script lang="ts" setup>
import router from '@/router/router'
import { ref, type PropType } from 'vue';
const date = ref<Date | null>(null); // Define date property
const quantities1 = ref<number>(0); // Define quantities1 property
const value3 = ref<string>(''); // Define value3 property

// Define $filters object with formatDate method
const $filters = {
  formatDate(date: Date): string {
    // Implement your date formatting logic here
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
};
interface Subcategory {
  id: number;
  name: string;
  price: number;
  // any other properties needed to be added here
}
interface MainCategory {
  name: string;
  // Define the structure of your main category object here
}
interface SelectedRepairs {
  name: string;
  // Define the structure of your main category object here
}
const props = defineProps({
  selectedSubcategory: {
    type: Object as PropType<Subcategory>,
    required: true
  },
  mainCat: {
    type: Object as PropType<MainCategory>,
    required: true
  },
  selectedRepairs: {
    type: Object as PropType<SelectedRepairs>,
    required: true
  }
});

</script>

<template>
  <div class="px-0 py-4 md:px-4">
    <div class="border-round surface-card">
      <div class="text-2xl text-500 mb-3">Summary</div>
      
      <PrimeDivider></PrimeDivider>
      <PrimeCard
        style="
          border-style: solid;
          border-color: darkgoldenrod !important;
        "
      >
        <template #title
          ><div
            class="flex justify-content-between align-items-center border-bottom-1 pb-3 surface-border"
          >
            <span class="text-900 font-medium text-lg lg:text-xl"
              ><i class="pi pi-shopping-cart text-xl mr-2"></i>Your Order
              (1)</span
            >
            <a
              tabindex="0"
              class="text-600 font-medium cursor-pointer hover:text-primary"
              >Edit Cart</a
            >
          </div>
        </template>
        <template #content>
          <span class="text-900 font-medium text-lg lg:text-xl"
            ><i class="pi pi-calendar text-xl mr-2"></i>Pick Date</span
            >
          <div class="py-2 mt-3 border-bottom-1 surface-border">
              <PrimeCalendar v-model="date" inline showTime hourFormat="12" />
          </div>
          <div
            class="flex flex-column lg:flex-row flex-wrap lg:align-items-center py-3 my-3 border-bottom-1 surface-border"
          >
          <!-- {{ props.selectedRepairs }} -->
          <span class="text-900 font-medium">Your Selected Repairs</span>
            <div class="flex-auto lg:ml-3" v-if="props.mainCat">
              <div
                class="flex align-items-center justify-content-between mb-3"
              >
              </div>
              <!-- <div class="text-600 text-md mb-3">{{ props.mainCat.job_category }}</div> -->
              <div v-if="props.selectedRepairs && props.selectedRepairs.length">
              
                <!-- <div class="text-600 text-md mb-3" v-for="repair in props.selectedRepairs" :key="repair.job_subcategory_id" >{{ repair.category }}</div> -->
                <div class="text-600 text-sm mb-3" v-for="repair in props.selectedRepairs" :key="repair.job_subcategory_id">{{ repair.job_subcategory_job }}</div>
              </div>
              <div
                class="flex flex-auto justify-content-between align-items-center"
              >
                <InputNumber
                  :showButtons="true"
                  buttonLayout="horizontal"
                  spinnerMode="horizontal"
                  :min="0"
                  inputClass="w-2rem text-center py-2 px-1 border-transparent"
                  v-model="quantities1"
                  class="border-1 surface-border border-round"
                  decrementButtonClass="p-button-text text-600 hover:text-primary py-1 px-1"
                  incrementButtonClass="p-button-text text-600 hover:text-primary py-1 px-1"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                ></InputNumber>
                <PrimeButton
                  icon="pi pi-trash"
                  class="text-600 p-button-text p-button-rounded"
                ></PrimeButton>
                    </div>
                  </div>
                </div>
                <div class="py-2 mt-3 border-bottom-1 surface-border">
                  <div class="flex justify-content-between align-items-center mb-3">
                    <span class="text-900">Date for Repairs</span>
                    <span class="text-900">{{ $filters.formatDate(new Date()) }}</span>
                  </div>
                  <div class="flex justify-content-between align-items-center mb-3">
                    <span class="text-900">Subtotal</span>
                    <span class="text-900">$12.00</span>
                  </div>
                  <div
                    class="flex justify-content-between align-items-center mb-3"
                  >
                    <span class="text-900">Shipping</span>
                    <span class="text-900">Free</span>
                  </div>
                  <div
                    class="flex justify-content-between align-items-center mb-3"
                  >
                    <span class="text-900">Total</span>
                    <span class="text-900 font-bold">$12.00</span>
                  </div>
                </div>
                <div class="py-2 mt-3 border-bottom-1 surface-border">
                  <div class="text-900 font-medium mb-2">Save Your Account</div>
                  <div class="text-600 text-sm line-height-3 mb-2">
                    Create an exclusive account for easy shopping and experience
                    for your upcoming visits.
                  </div>
                  <Password
                    v-model="value3"
                    :toggleMask="true"
                    inputClass="w-full"
                    class="w-full mb-2"
                  ></Password>
                </div>
                <PrimeButton
                  class="p-button-primary w-full mt-3"
                  label="Confirm Booking"
                  @click="router.push({ name: 'payment'})"
                ></PrimeButton>
              </template>
            </PrimeCard>
          </div>
        </div>
</template>