<script setup lang="ts">

import Stripe from 'stripe';
// Create a new Stripe instance with your test secret API key
const stripe = new Stripe('sk_test_KUgd5hcMpYmUloBmiJ2W4h6S');

import type { Nullable } from 'primevue/ts-helpers';
import { ref, computed, onMounted, watch } from 'vue';

import { useBookingStore } from '@/stores/BookingStore';
import router from '@/router/router';
import axios from 'axios';

const bookingStore = useBookingStore(); // Accessing the Pinia store

const fullBookingDetails = computed(() => bookingStore.fullBookingDetails);

// console.log('full booking', Object.keys(fullBookingDetails.value).length)

// Define reactive properties
const selectedAddress = ref<string>(''); // Assuming selectedAddress is a string
const address1 = ref<string>(''); // Assuming address1 is a string
const address2 = ref<string>(''); // Assuming address2 is a string
const quantities1 = ref<Nullable<number>[]>([null]); // Assuming quantities1 is an array of nullable numbers
const selectedCard = ref<string>(''); // Assuming selectedCard is a string
const card1 = ref<string>(''); // Assuming card1 is a string
const card2 = ref<string>(''); // Assuming card2 is a string
    const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
};

const reload = () => {
  if (!fullBookingDetails.value || Object.keys(fullBookingDetails.value).length === 0) {
    router.push({ name: 'bookJob' });
  }
};

onMounted(() => {
  reload(); // Call reload whenever fullBookingDetails changes
});

</script>
<template>
  <div class="surface-50 px-4 py-5 md:px-6 lg:px-8">
    <div class="mb-3 lg:mb-0">
      <div class="text-3xl font-medium text-900 mb-3">Payment</div>
      <div class="text-500 mr-0 md:mr-3">Payment for repairs</div>
    </div>
    <PrimeDivider></PrimeDivider>

    <!-- <span class="p-input-icon-left w-full md:w-auto">
        <i class="pi pi-search"></i>
        <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
      </span> -->
    <div class="text-900 font-medium text-3xl mt-5 mb-5">
      Your order is almost done
    </div>
    <div class="grid -mr-3 -ml-3">
      <div class="col-12 lg:col-9 p-3">
        <div class="px-0 py-4 lg:px-4 surface-card border-round shadow-2">
          <div class="flex">
            <div
              class="flex flex-column align-items-center ml-3"
              style="width: 2rem"
            >
              <span
                class="bg-green-500 text-0 flex align-items-center justify-content-center border-circle"
                style="min-width: 3rem; min-height: 3rem"
              >
                <i class="pi pi-image text-xl"></i>
              </span>
              <div
                class="h-full border-dashed border-1 surface-border"
                style="min-height: 12rem"
              ></div>
            </div>
            <div class="ml-0 lg:ml-5 p-2 flex-auto">
              <div class="mb-3">
                <span class="text-900 text-xl block ml-2">Your Cart</span>
              </div>
              <div class="p-2 flex flex-column lg:flex-row flex-wrap lg:align-items-center">
                <div class="flex-auto lg:ml-3">
                  
                  <div class="flex align-items-center justify-content-between mb-3" v-if="fullBookingDetails">
                    <span class="text-900 font-medium">Choosen Repairs</span>
                  </div>
                  
                  <div v-for="repairs in fullBookingDetails">
                    <div class="text-600 text-lg mb-3" v-for="jobs in repairs">{{ jobs.job_subcategory_job }}</div>
                  </div>
                  <!-- <div class="text-600 text-sm mb-3">Clutch Replace</div> -->
                  <div class="flex flex-auto justify-content-between align-items-center  mb-4">
                    <span class="text-900 font-bold">Total Amount</span>
                    <span class="text-900 font-bold">£{{ fullBookingDetails.totalAmount }}</span>
                  </div>
                  <!-- <div
                    class="flex flex-auto justify-content-between align-items-center">
                    <InputNumber
                      :showButtons="true"
                      buttonLayout="horizontal"
                      :min="0"
                      inputClass="w-2rem text-center p-0 border-none surface-50"
                      v-model="quantities1[0]"
                      class="border-none border-round"
                      decrementButtonClass="surface-50 p-button-text text-600 hover:text-primary"
                      incrementButtonClass="p-button-text surface-50 text-600 hover:text-primary py-1 px-1"
                      incrementButtonIcon="pi pi-plus"
                      decrementButtonIcon="pi pi-minus"
                    ></InputNumber>
                    <span class="text-600 cursor-pointer"
                      ><i class="pi pi-trash mr-2"></i>Delete</span
                    >
                  </div> -->
                </div>
              </div>
            </div>
          </div>
          <div class="flex">
            <div
              class="flex flex-column align-items-center ml-3"
              style="width: 2rem"
            >
              <span
                class="bg-gray-200 text-500 flex align-items-center justify-content-center border-circle"
                style="min-width: 3rem; min-height: 3rem"
              >
                <i class="pi pi-credit-card text-xl"></i>
              </span>
            </div>
            <div class="ml-0 lg:ml-5 p-2 flex-auto">
              <div class="mb-3">
                <span class="text-900 text-xl block ml-2">Payment Method</span>
              </div>
              <div class="grid flex-column lg:flex-row">
                <div class="col p-3">
                  <div
                    class="flex flex-column border-round border-1 surface-border p-4 cursor-pointer hover:border-primary transition-duration-150"
                    @click="selectedCard = card1"
                    :class="{ 'border-primary': selectedCard === card1 }"
                  >
                    <img
                      src="../../assets/img/checkoutform-1-5.png"
                      class="w-6rem"
                      alt="Visa"
                    />
                    <span class="inline-block text-900 text-lg lg:text-xl mt-3"
                      >**** **** **** 1234</span
                    >
                    <div
                      class="flex justify-content-between align-items-center mt-3"
                    >
                      <span class="inline-block text-600 text-sm"
                        >Cardholder Name</span
                      >
                      <span class="inline-block text-600 text-sm text-right"
                        >Expiry Date</span
                      >
                    </div>
                    <div
                      class="flex justify-content-between align-items-center mt-3"
                    >
                      <span class="inline-block text-900 font-bold"
                        >John Warden</span
                      >
                      <span class="inline-block text-900 font-bold">12/25</span>
                    </div>
                  </div>
                </div>
                <div class="col p-3">
                  <div
                    class="flex flex-column border-round border-1 surface-border p-4 cursor-pointer hover:border-primary transition-duration-150"
                    @click="selectedCard = card2"
                    :class="{ 'border-primary': selectedCard === card2 }"
                  >
                    <img
                      src="../../assets/img/checkoutform-1-5.png"
                      class="w-6rem"
                      alt="Visa"
                    />
                    <span class="inline-block text-900 text-lg lg:text-xl mt-3"
                      >**** **** **** 1234</span
                    >
                    <div
                      class="flex justify-content-between align-items-center mt-3"
                    >
                      <span class="inline-block text-600 text-sm"
                        >Cardholder Name</span
                      >
                      <span class="inline-block text-600 text-sm text-right"
                        >Expiry Date</span
                      >
                    </div>
                    <div
                      class="flex justify-content-between align-items-center mt-3"
                    >
                      <span class="inline-block text-900 font-bold"
                        >John Warden</span
                      >
                      <span class="inline-block text-900 font-bold">12/25</span>
                    </div>
                  </div>
                </div>
                <div class="col-12 lg:col-3 p-3">
                  <div
                    class="flex h-full flex-column justify-content-center align-items-center py-5 border-round border-1 surface-border surface-100 cursor-pointer hover:border-primary transition-duration-150"
                  >
                    <span
                      class="text-600 border-circle border-2 w-2rem h-2rem flex align-items-center justify-content-center"
                      ><i class="pi pi-fw pi-plus"></i
                    ></span>
                    <span class="text-600 mt-3 text-center"
                      >Add New Credit Card</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-3 p-3">
        <div class="surface-card p-4 border-round shadow-2">
          <div class="border-bottom-1 surface-border pb-4">
            <span class="text-900 text-xl block">Order Summary</span>
          </div>
          <div class="border-bottom-1 surface-border my-3 py-2">
            <div class="flex justify-content-between mb-3">
              <span class="text-900">Price</span>
              <span class="text-900">£{{ fullBookingDetails.totalAmount }}</span>
            </div>
          </div>
          <div class="border-bottom-1 surface-border my-3 py-2">
            <div class="flex justify-content-between mb-3">
              <span class="text-900 font-medium">Total</span>
              <span class="text-900 font-bold">£{{ fullBookingDetails.totalAmount }}</span>
            </div>
          </div>
          <PrimeButton
            class="surface-400 border-none hover:bg-primary w-full mt-3"
            label="Place Order"
            @click="createCheckoutSession"
          ></PrimeButton>
        </div>
      </div>
    </div>
  </div>
</template>
