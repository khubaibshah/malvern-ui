<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useVehicleStore } from '@/stores/vehicleData'
import VehicleService from '@/services/VehicleService'
import toUpperCase from '@/components/reusable/toUpperCase'

// --- state ---
const toast = useToast()
const vehicleStore = useVehicleStore()

const availableVehicles = ref<any[]>([])          // stock: not WASTEBIN
const vehicleOptions = ref<{label:string; value:number}[]>([])
const targetVehicleId = ref<number | null>(null)  // the car they want from your stock
const targetVehicle = computed(() =>
  availableVehicles.value.find(v => v.id === targetVehicleId.value) || null
)

const valuation = ref<any | null>(null)
const loadingValuation = ref(false)
const formLocked = ref(false) // when we’ve shown valuation summary
const isLocked = ref(false)   // locks DVSA-populated fields

const registrationNumber = ref('')

// Customer’s car quick dataset (DVSA payload)
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
  partEx: true, // default to part-ex ON for this flow
})

// Lead details
const form = ref({
  fullName: '',
  email: '',
  postcode: '',
  phone: '',
})
const formErrors = ref({
  fullName: false,
  email: false,
  postcode: false,
  phone: false,
})

// --- helpers ---
const transformToUpperCase = () => toUpperCase(registrationNumber)

const formatGBP = (n: number | string) => {
  const v = +n || 0
  return v.toLocaleString('en-GB', { maximumFractionDigits: 0 })
}

// So the “instant” valuation is clearly indicative,
// present ±7.5% range (rounded to nearest £50)
const round50 = (n: number) => Math.round(n / 50) * 50
const partExBase = computed<number>(() => +valuation.value?.valuations?.partExchange || 0)
const partExLow  = computed<number>(() => round50(partExBase.value * 0.925)) // slightly protective
const partExHigh = computed<number>(() => round50(partExBase.value * 1.075))

const changeToPay = computed<number>(() => {
  const price = +(targetVehicle.value?.price || 0)
  const px    = partExBase.value
  return Math.max(price - px, 0)
})

const canRequestValuation = computed<boolean>(() =>
  !!vehData.value.registration && !!vehData.value.odometerValue && !!targetVehicle.value
)

// --- actions ---
const clearValuation = () => {
  formLocked.value = false
  valuation.value = null
}

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
    partEx: true,
  }
  form.value = { fullName: '', email: '', postcode: '', phone: '' }
  registrationNumber.value = ''
  targetVehicleId.value = null
  isLocked.value = false
  clearValuation()
}

const loadStock = async () => {
  // You can also use vehicleStore if it’s already hydrated elsewhere
  const data = await VehicleService.getAllVehicles()
  const list = (data.cars || []) as any[]
  availableVehicles.value = list.filter(v => String(v.vehicle_status).toUpperCase() !== 'WASTEBIN')
  vehicleOptions.value = availableVehicles.value.map(v => ({
    label: `${v.make} ${v.model}${v.variant ? ' ' + v.variant : ''} — £${formatGBP(v.price)}`,
    value: v.id
  }))
}

const getDvsa = async () => {
  try {
    const response = await VehicleService.getDvsaVehicleByReg(registrationNumber.value)
    vehData.value = response
    isLocked.value = true
    vehicleStore.setVehicleData(response)
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to retrieve vehicle details. Check the reg.', life: 4000 })
  }
}

const getValuation = async () => {
  try {
    if (!canRequestValuation.value) {
      toast.add({ severity: 'warn', summary: 'Missing info', detail: 'Select one of our cars, enter reg & mileage.', life: 3500 })
      return
    }
    loadingValuation.value = true

    // Your existing valuation endpoint (reg + mileage only)
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/scs/at/${vehData.value.registration}/${vehData.value.odometerValue}`
    )
    valuation.value = res.data.data
    formLocked.value = true
    toast.add({ severity: 'success', summary: 'Indicative valuation ready', detail: `For ${vehData.value.registration}`, life: 3000 })
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Valuation failed',
      detail: err?.response?.data?.message || 'Could not get valuation',
      life: 5000,
    })
  } finally {
    loadingValuation.value = false
  }
}

const submitSellRequest = async () => {
  formErrors.value = {
    fullName: !form.value.fullName,
    email: !form.value.email,
    postcode: !form.value.postcode,
    phone: !form.value.phone,
  }
  if (Object.values(formErrors.value).some(Boolean)) {
    toast.add({ severity: 'error', summary: 'Missing Fields', detail: 'Please complete all required fields.', life: 4000 })
    return
  }
  try {
    const payload = {
      ...form.value,
      registration: vehData.value?.registration,
      vehicle: vehData.value,
      partEx: true,
      target_vehicle_id: targetVehicleId.value ?? undefined
    }
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/scs/lead/sell-your-car`, payload)
    await getValuation() // show indicative instantly post submit
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit your details.', life: 4000 })
  }
}

// init
onMounted(async () => {
  try { await loadStock() } catch {}
})
</script>

<template>
  <PrimeToast />

  <div class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container">
    <div class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
      <div class="text-3xl font-medium text-900 mb-3" style="margin-left: 3px;">Trade In or Sell</div>
      <div class="text-500">Get an indicative offer for your car, against one of ours.</div>
    </div>
  </div>

  <div class="surface-section p-5 md:p-6 lg:p-8 shadow-md rounded-xl car-details-container">
    <!-- SUMMARY / RESULT -->
    <PrimeCard v-if="formLocked && valuation && targetVehicle" class="mb-4">
      <template #title>
        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
          <h3 class="text-lg font-semibold text-gray-700 m-0">Your Indicative Part-Exchange Summary</h3>
          <PrimeTag severity="warning" value="Subject to appraisal" />
        </div>
      </template>
      <template #content>
        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="p-3 surface-100 border-round">
              <div class="text-sm text-gray-500 mb-1">Selected Vehicle</div>
              <div class="text-base font-semibold">
                {{ targetVehicle.make }} {{ targetVehicle.model }} {{ targetVehicle.variant || '' }}
              </div>
              <div class="text-2xl font-bold mt-2">
                £{{ formatGBP(targetVehicle.price) }}
              </div>
            </div>
          </div>
          <div class="col-12 md:col-6">
            <div class="p-3 surface-100 border-round">
              <div class="text-sm text-gray-500 mb-1">Your Car (Indicative Part-Ex)</div>
              <div class="text-base">
                {{ valuation.make }} {{ valuation.model }} ({{ valuation.registration }})
              </div>
              <div class="text-xs text-gray-500 mb-2">{{ valuation.fuelType }} • {{ valuation.colour }}</div>
              <div class="text-xl font-bold">
                £{{ formatGBP(partExLow) }} – £{{ formatGBP(partExHigh) }}
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="p-3 border-round surface-card flex gap-4 align-items-center justify-content-between">
              <div class="text-base text-gray-700">
                Estimated difference to change (vs. mid-range): 
                <span class="font-bold">£{{ formatGBP(Math.max((+targetVehicle.price || 0) - partExBase, 0)) }}</span>
              </div>
              <div class="flex gap-2">
                <PrimeButton label="Book Inspection" severity="contrast" />
                <PrimeButton label="Choose Another Car" text @click="() => { formLocked = false; valuation = null; }" />
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              All figures are indicative and may vary with condition, history and market movement. Final offer confirmed after on-site appraisal.
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <PrimeButton label="Back to Edit" icon="pi pi-pencil" text @click="clearValuation" />
        </div>
      </template>
    </PrimeCard>

    <!-- FORM -->
    <div v-if="!formLocked" class="grid">
      <!-- LEFT: pick one of your cars -->
      <div class="col-12 md:col-6">
        <PrimeCard>
          <template #title>
            <h3 class="text-lg font-semibold text-gray-700">1) Pick a car from our stock</h3>
          </template>
          <template #content>
            <Dropdown
              v-model="targetVehicleId"
              :options="vehicleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a vehicle"
              class="w-full mb-3"
            />
            <PrimeMessage v-if="!targetVehicleId" severity="info" :closable="false">
              Choose a vehicle you’d like to buy — we’ll estimate your part-ex against it.
            </PrimeMessage>

            <div v-if="targetVehicle" class="p-3 border-1 surface-border border-round mt-2">
              <div class="text-sm text-gray-500 mb-1">Selected:</div>
              <div class="font-semibold">
                {{ targetVehicle.make }} {{ targetVehicle.model }} {{ targetVehicle.variant || '' }}
              </div>
              <div class="text-xl font-bold mt-1">£{{ formatGBP(targetVehicle.price) }}</div>
            </div>
          </template>
        </PrimeCard>

        <!-- Your details -->
        <PrimeCard class="mt-4">
          <template #title>
            <h3 class="text-lg font-semibold text-gray-700">2) Your Contact Details</h3>
          </template>
          <template #content>
            <div class="grid gap-3">
              <div class="col-12">
                <label class="block text-sm font-medium">Full Name</label>
                <InputText v-model="form.fullName" class="w-full" placeholder="John Smith" />
                <PrimeInlineMessage v-if="formErrors.fullName" severity="error">Full name is required</PrimeInlineMessage>
              </div>
              <div class="col-12">
                <label class="block text-sm font-medium">Email</label>
                <InputText type="email" v-model="form.email" class="w-full" placeholder="john@example.com" />
              </div>
              <div class="col-12">
                <label class="block text-sm font-medium">Postcode</label>
                <InputText v-model="form.postcode" class="w-full" placeholder="B1 2AA" />
              </div>
              <div class="col-12">
                <label class="block text-sm font-medium">Phone</label>
                <InputText v-model="form.phone" class="w-full" placeholder="07123 456789" />
              </div>
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- RIGHT: their car -->
      <div class="col-12 md:col-6">
        <PrimeCard>
          <template #title>
            <h3 class="text-lg font-semibold text-gray-700">3) Your Car (Part-Exchange)</h3>
          </template>
          <template #content>
            <div class="p-3 border-round surface-100 mb-3">
              <div class="text-sm text-gray-600 mb-2">Enter Registration</div>
              <InputGroup class="w-full h-3rem">
                <InputGroupAddon style="background-color:#00309a;color:#fbe90a">GB</InputGroupAddon>
                <InputText
                  v-model="registrationNumber"
                  style="background-color:#fbe90a;border-color:#00309a"
                  placeholder="REG"
                  class="w-full text-xl font-bold"
                  @input="transformToUpperCase"
                />
                <PrimeButton label="Lookup" severity="contrast" @click="getDvsa" />
              </InputGroup>
              <small class="text-gray-500">We’ll fetch basics. You can amend anything below.</small>
            </div>

            <div class="grid formgrid p-fluid">
              <div class="field col-12 md:col-6">
                <label>Registration</label>
                <InputText v-model="vehData.registration" :readonly="isLocked" />
              </div>
              <div class="field col-12 md:col-6">
                <label>Make</label>
                <InputText v-model="vehData.make" :readonly="isLocked" />
              </div>
              <div class="field col-12 md:col-6">
                <label>Model</label>
                <InputText v-model="vehData.model" :readonly="isLocked" />
              </div>
              <div class="field col-12 md:col-6">
                <label>Mileage</label>
                <InputText
                  v-model="vehData.odometerValue"
                  placeholder="e.g. 75000"
                />
              </div>
              <div class="field col-12 md:col-6">
                <label>First Used</label>
                <InputText v-model="vehData.firstUsedDate" />
              </div>
              <div class="field col-12 md:col-6">
                <label>Reg Date</label>
                <InputText v-model="vehData.registrationDate" :readonly="isLocked" />
              </div>
              <div class="field col-12 md:col-6">
                <label>Fuel</label>
                <InputText v-model="vehData.fuelType" :readonly="isLocked" />
              </div>
              <div class="field col-12 md:col-6">
                <label>Engine Size</label>
                <InputText v-model="vehData.engineSize" :readonly="isLocked" />
              </div>
              <div class="field col-12 md:col-6">
                <label>Colour</label>
                <InputText v-model="vehData.primaryColour" :readonly="isLocked" />
              </div>
            </div>
          </template>

          <template #footer>
            <div class="grid mt-2">
              <div class="col-6">
                <PrimeButton label="Reset" class="w-full p-button-outlined text-red-500 border-red-500" @click="resetForm" />
              </div>
              <div class="col-6">
                <PrimeButton
                  label="Submit & Get Indicative Offer"
                  class="w-full bg-black text-white font-semibold"
                  :loading="loadingValuation"
                  :disabled="!canRequestValuation"
                  @click="submitSellRequest"
                />
              </div>
            </div>
            <small class="text-xs text-gray-500 block mt-2">
              By continuing you agree that figures shown are indicative only and subject to in-person appraisal.
            </small>
          </template>
        </PrimeCard>
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
