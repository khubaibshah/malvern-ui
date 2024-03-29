<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'


const name = ref('')
const email = ref('')
const phoneNumber = ref('')
const vehicle_make = ref('')
const vehicle_model = ref('')
const notes = ref('')
const Booking_reference = ref('')
const deposit_paid = ref(''); // Assuming it's a boolean field
const job_repair_id = ref(''); // Initialize as a number
const repair_price = ref('') // Initialize as a number

const date = ref()
const bookings = ref()
const datetime24h = ref()


const toast = useToast()

const createBooking = async () => {
  try {
    const userBooking = {
      name: name.value,
      email: email.value,
      phone_number: phoneNumber.value,
      vehicle_make: vehicle_make.value,
      vehicle_model: vehicle_model.value,
      booking_datetime: formatDate(date.value), // Format the date before sending
      notes: notes.value,
      Booking_reference: Booking_reference.value,
      deposit_paid: deposit_paid.value.toString(), // Convert boolean to string // Format the date before sending
      job_repair_id: job_repair_id.value.toString(), // Use the numeric ref
      repair_price: repair_price.value // Use the numeric ref
    };

    // Check if required fields are populated
    if (!userBooking.booking_datetime || !userBooking.job_repair_id || !userBooking.repair_price) {
      throw new Error('Please fill in all required fields.');
    }

    // Call the createBooking method from BookingService
    const response = await axios.post(`https://malvern-api-production.up.railway.app/admin/customer-booking`, userBooking, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    bookings.value = response.data

    // Optionally, you can reset the form fields after successful submission
    name.value = '';
    email.value = '';
    phoneNumber.value = '';
    vehicle_make.value = '';
    vehicle_model.value = '';
    date.value = null;
    notes.value = '';
    // Set success message
    toast.add({
      severity: 'success',
      summary: 'Info',
      detail: 'Booking created successfully',
      life: 3000
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    // Set error message
    toast.add({
      severity: 'error',
      summary: 'Info',
      detail: 'Booking couldn\'t be created. Please try again',
      life: 3000
    });
  }
};

const formatDate = (date: any) => {
  if (date) {
    const formattedDate = new Date(date)
    const year = formattedDate.getFullYear()
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0')
    const day = String(formattedDate.getDate()).padStart(2, '0')
    const hours = String(formattedDate.getHours()).padStart(2, '0')
    const minutes = String(formattedDate.getMinutes()).padStart(2, '0')
    const seconds = String(formattedDate.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  return ''
}

onMounted(async () => {})
</script>

<template>
  <div>
    <PrimeToast />
    <!-- <Nav />  -->
      <div class="surface-section px-4 py-5 md:px-6 lg:px-8 mt-3">
      <div
        class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border"
      >
        <div class="mb-3 lg:mb-0">
          <div class="text-3xl font-medium text-900 mb-3">Create a booking</div>
          <div class="text-500 mr-0 md:mr-3">
            The garage is open between 9am and 5:30pm, Monday to Friday. Only 1 booking is allowed per slot.
          </div>
        </div>
        <span class="p-input-icon-left w-full md:w-auto">
          <i class="pi pi-search"></i>
          <InputText type="text" placeholder="Search" class="w-full md:w-auto" />
        </span>
      </div>
      <div class="grid mt-5">
        <div class="col-12 md:col-6">
          <div class="p-fluid pr-0 md:pr-6">
            <div class="field">
              <label for="name" class="font-medium">Full name</label>
              <InputText v-model="name" id="name" type="text" class="py-3 px-2 text-lg" />
            </div>
            <div class="field">
              <label for="Booking_reference" class="font-medium">Booking reference</label>
              <InputText v-model="Booking_reference" id="Booking_reference" type="text" class="py-3 px-2 text-lg" />
            </div>
            <div class="field">
              <label for="deposit_paid" class="font-medium">deposit_paid</label>
              <InputText v-model="deposit_paid" id="deposit_paid" type="deposit_paid" class="py-3 px-2 text-lg" />
            </div>
            <div class="field">
              <label for="job_repair_id" class="font-medium">job_repair_id</label>
              <InputText v-model="job_repair_id" id="job_repair_id" type="job_repair_id" class="py-3 px-2 text-lg" />
            </div>
            <div class="field">
              <label for="company" class="font-medium">Phone number</label>
              <InputText v-model="phoneNumber" id="company" type="text" class="py-3 px-2 text-lg" />
            </div>
            <div class="field">
              <label for="email" class="font-medium">Email</label>
              <InputText v-model="email" id="email" type="text" class="py-3 px-2 text-lg" />
            </div>
            <div class="field">
              <label for="message" class="font-medium">Vehicle make</label>
              <InputText
                v-model="vehicle_make"
                id="message"
                :rows="6"
                class="py-3 px-2 text-lg"
              ></InputText>
            </div>
            <div class="field">
              <label for="message" class="font-medium">Vehicle model</label>
              <InputText
                v-model="vehicle_model"
                id="message"
                :rows="6"
                class="py-3 px-2 text-lg"
              ></InputText>
            </div>
            <div class="field">
              <label for="message" class="font-medium">Notes</label>
              <PrimeTextarea v-model="notes" id="notes" class="pb-3"></PrimeTextarea>
            </div>
          </div>
        </div>
        <div class="col-12 md:col-6 bg-no-repeat bg-right-bottom">
          <div class="text-900 text-2xl font-medium mb-3">Please pick a date and Time</div>
          <PrimeCalendar v-model="date" inline showTime hourFormat="12" />
        </div>
        <div class="col-12 md:col-6">
          <PrimeButton
            label="Create Booking"
            icon="pi pi-send"
            class="w-auto"
            @click="createBooking"
          ></PrimeButton>
        </div>
      </div>
    </div>

<div class="surface-section px-4 py-8 md:px-6 lg:px-8">
    <div class="grid">
        <div class="col-12 md:col-6">
            <PrimeButton label="Travel Update" icon="pi pi-chevron-right" iconPos="right" class="p-button-success p-button-rounded mb-3 font-bold"></PrimeButton>
            <div class="text-900 font-bold text-5xl mb-3">Book Flights</div>
            <div class="text-600 text-2xl line-height-3">Find cheap flights and airline tickets.</div>
            <div class="text-600 text-2xl line-height-3">Prime Flights helps you compare and track airfares.</div>
        </div>
        <div class="col-12 md:col-6 flex align-items-center md:justify-content-end">
            <div>
                <div class="text-900 font-medium justify-content-start mb-3">Round Trip Dates</div>
                <PrimeCalendar id="calendar-24h" v-model="datetime24h" showTime hourFormat="24"  :showIcon="true" selectionMode="range" :style="{'min-width': '240px'}" inputClass="'bg-transparent text-900 border-400'"/>
                <!-- <PrimeCalendar v-model="date1" dateFormat="dd/mm/yy" :showIcon="true" selectionMode="range" :style="{'min-width': '240px'}" inputClass="'bg-transparent text-900 border-400'"></PrimeCalendar> -->
                <PrimeButton label="Book Now" icon="pi pi-check" class="block mt-3 font-bold white-space-nowrap p-button-outlined w-full"></PrimeButton>
            </div>
        </div>
    </div>
</div>
 
  </div>
</template>