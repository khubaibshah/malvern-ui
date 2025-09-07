<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useVehicleStore } from '@/stores/vehicleData'
import VehicleService from '@/services/VehicleService'
import toUpperCase from '@/components/reusable/toUpperCase'

// --- state ---
const toast = useToast()
const vehicleStore = useVehicleStore()


const isMobile = ref(false)
const updateIsMobile = () => { isMobile.value = window.innerWidth <= 768 }



const availableVehicles = ref<any[]>([])          // stock: not WASTEBIN
const vehicleOptions = ref<{ label: string; value: number }[]>([])
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
const partExLow = computed<number>(() => round50(partExBase.value * 0.925)) // slightly protective
const partExHigh = computed<number>(() => round50(partExBase.value * 1.075))

const changeToPay = computed<number>(() => {
  const price = +(targetVehicle.value?.price || 0)
  const px = partExBase.value
  return Math.max(price - px, 0)
})

const canRequestValuation = computed<boolean>(() => {
  const hasBasics = !!vehData.value.registration && !!vehData.value.odometerValue
  // If selling only, no need to pick our car
  return vehData.value.partEx ? (hasBasics && !!targetVehicle.value) : hasBasics
})


// --- actions ---
const clearValuation = () => {
  formLocked.value = false
  valuation.value = null
}

const resetForm = () => {
  const keepPartEx = !!vehData.value.partEx
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
    partEx: keepPartEx,
  }
  form.value = { fullName: '', email: '', postcode: '', phone: '' }
  registrationNumber.value = ''
  if (keepPartEx) {
    // keep their selected car if they’re still part-exing; otherwise clear
  } else {
    targetVehicleId.value = null
  }
  isLocked.value = false
  clearValuation()
}


const loadStock = async () => {
  const data = await VehicleService.getAllVehicles()
  const list = (data.cars || []) as any[]
  availableVehicles.value = list.filter(v => String(v.vehicle_status).toUpperCase() !== 'WASTEBIN')

  vehicleOptions.value = availableVehicles.value.map(v => ({
    label: `${v.make} ${v.model}${v.variant ? ' ' + v.variant : ''} — £${formatGBP(v.price)}`,
    value: v.id,
    image: (Array.isArray(v.images) && v.images.length ? v.images[0] : '/src/assets/img/default.jpg'),
    vehicle: v
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
      const msg = vehData.value.partEx
        ? 'Select one of our cars, and enter your reg & mileage.'
        : 'Enter your reg & mileage.'
      toast.add({ severity: 'warn', summary: 'Missing info', detail: msg, life: 3500 })
      return
    }
    loadingValuation.value = true
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
      partEx: !!vehData.value.partEx,
      // only include the target vehicle if part-ex
      target_vehicle_id: vehData.value.partEx ? (targetVehicleId.value ?? undefined) : undefined
    }
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/scs/lead/sell-your-car`, payload)
    await getValuation()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit your details.', life: 4000 })
  }
}


// init
onMounted(async () => {
  try { await loadStock() } catch { }
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})
onUnmounted(() => window.removeEventListener('resize', updateIsMobile))
</script>

<template>
  <PrimeToast />

  <div class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container">
    <div
      class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
      <div class="text-3xl font-medium text-900 mb-3" style="margin-left: 3px;">Trade In or Sell</div>
      <div class="text-500">
        Get an indicative offer for your car — either sell for cash or part-exchange against one of ours.
      </div>
    </div>
  </div>

  <div class="surface-section p-5 md:p-6 lg:p-8 shadow-md rounded-xl car-details-container">

    <!-- ===== FORM (EDIT MODE) ===== -->
    <template v-if="!formLocked">

      <!-- 0) DEAL TYPE FIRST -->
      <PrimeCard class="mb-4">
        <template #title>
          <h3 class="text-lg font-semibold text-gray-700">Deal Type</h3>
        </template>
        <template #content>
          <div class="flex align-items-center gap-3">
            <PrimeToggleButton
              v-model="vehData.partEx"
              onLabel="Part-Exchange"
              offLabel="Sell Only"
              class="w-12rem"
              severity="contrast"
            />
            <small class="text-gray-500">
              Start here. Choose whether you’re part-exchanging or selling for cash.
            </small>
          </div>
        </template>
      </PrimeCard>

      <div class="grid">
        <!-- LEFT: pick our car (only when Part-Ex), then contact details -->
        <div class="col-12 md:col-6">

          <!-- 1) PICK A CAR (only for part-ex) -->
          <PrimeCard v-if="vehData.partEx">
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
  appendTo="body"
  :panelStyle="{ width: isMobile ? '92vw' : '560px', maxWidth: '92vw' }"
  scrollHeight="260px"
>
  <!-- Selected value (compact with ellipsis) -->
  <template #value="{ value, placeholder }">
    <div v-if="value !== null" class="dd-value">
      <img
        :src="vehicleOptions.find(o => o.value === value)?.image"
        alt="thumb"
        class="dd-thumb"
      />
      <span class="dd-text">
        {{ vehicleOptions.find(o => o.value === value)?.label }}
      </span>
    </div>
    <span v-else class="text-400">{{ placeholder }}</span>
  </template>

  <!-- Each option row (thumb + ellipsised text) -->
  <template #option="{ option }">
    <div class="dd-option">
      <img :src="option.image" alt="thumb" class="dd-thumb" />
      <span class="dd-title">{{ option.label }}</span>
    </div>
  </template>
</Dropdown>


              <PrimeMessage v-if="!targetVehicleId" severity="info" :closable="false">
                Choose a vehicle you’d like to buy — we’ll estimate your part-ex against it.
              </PrimeMessage>

              <!-- Selected preview -->
              <div v-if="targetVehicle" class="p-3 border-1 surface-border border-round mt-2">
                <div class="flex gap-3">
                  <img
                    :src="(Array.isArray(targetVehicle.images) && targetVehicle.images.length ? targetVehicle.images[0] : '/src/assets/img/default.jpg')"
                    alt="selected car"
                    class="w-8rem h-6rem object-cover border-round"
                  />
                  <div class="flex flex-column justify-content-between">
                    <div>
                      <div class="text-sm text-gray-500 mb-1">Selected:</div>
                      <div class="font-semibold">
                        {{ targetVehicle.make }} {{ targetVehicle.model }} {{ targetVehicle.variant || '' }}
                      </div>
                    </div>
                    <div class="text-xl font-bold mt-1">£{{ formatGBP(targetVehicle.price) }}</div>
                  </div>
                </div>
              </div>
            </template>
          </PrimeCard>

          <!-- Helper note for SELL ONLY -->
          <PrimeMessage v-else severity="info" :closable="false" class="mt-2">
            Selling only? No need to pick a car — just enter your car details on the right.
          </PrimeMessage>

          <!-- 2) YOUR CONTACT DETAILS -->
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

        <!-- RIGHT: your car details -->
        <div class="col-12 md:col-6">
          <PrimeCard>
            <template #title>
              <h3 class="text-lg font-semibold text-gray-700">3) Your Car</h3>
            </template>

            <template #content>
              <!-- Registration -->
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
                  <PrimeButton icon="pi pi-search" severity="contrast" @click="getDvsa" />
                </InputGroup>
                <small class="text-gray-500">We’ll fetch basics. You can amend anything below.</small>
              </div>

              <!-- Vehicle Info Form -->
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
                  <InputText v-model="vehData.odometerValue" placeholder="e.g. 75000" />
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
                  <PrimeButton
                    label="Reset"
                    class="w-full p-button-outlined text-red-500 border-red-500"
                    @click="resetForm"
                  />
                </div>
                <div class="col-6">
                  <PrimeButton
                    :label="vehData.partEx ? 'Submit & Get Part-Ex Offer' : 'Submit & Get Cash Offer'"
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
    </template>

    <!-- ===== SUMMARY / RESULT (LOCKED) ===== -->
    <PrimeCard v-else-if="valuation" class="mb-4">
      <template #title>
        <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3">
          <h3 class="text-lg font-semibold text-gray-700 m-0">
            {{ vehData.partEx ? 'Your Part-Exchange Summary' : 'Your Sale-Only Indicative Offer' }}
          </h3>
          <PrimeTag severity="warning" value="Subject to appraisal" />
        </div>
      </template>

      <template #content>
        <div class="grid">
          <!-- Selected Vehicle (only when part-ex & chosen) -->
          <div v-if="vehData.partEx && targetVehicle" class="col-12 md:col-6">
            <div class="p-3 surface-100 border-round">
              <div class="text-sm text-gray-500 mb-1">Selected Vehicle</div>
              <div class="flex gap-3">
                <img
                  :src="(Array.isArray(targetVehicle.images) && targetVehicle.images.length ? targetVehicle.images[0] : '/src/assets/img/default.jpg')"
                  alt="selected vehicle"
                  class="w-7rem h-5rem object-cover border-round"
                />
                <div>
                  <div class="text-base font-semibold">
                    {{ targetVehicle.make }} {{ targetVehicle.model }} {{ targetVehicle.variant || '' }}
                  </div>
                  <div class="text-2xl font-bold mt-2">
                    £{{ formatGBP(targetVehicle.price) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Your car (always shown) -->
          <div :class="vehData.partEx && targetVehicle ? 'col-12 md:col-6' : 'col-12'">
            <div class="p-3 surface-100 border-round">
              <div class="text-sm text-gray-500 mb-1">
                {{ vehData.partEx ? 'Your Car (Indicative Part-Ex)' : 'Your Car (Indicative Cash Offer)' }}
              </div>
              <div class="text-base">
                {{ valuation.make }} {{ valuation.model }} ({{ valuation.registration }})
              </div>
              <div class="text-xs text-gray-500 mb-2">{{ valuation.fuelType }} • {{ valuation.colour }}</div>
              <div class="text-xl font-bold">
                £{{ formatGBP(partExLow) }} – £{{ formatGBP(partExHigh) }}
              </div>
            </div>
          </div>

          <!-- Footer row -->
          <div class="col-12">
            <div class="p-3 border-round surface-card flex gap-4 align-items-center justify-content-between">
              <div class="text-base text-gray-700">
                <template v-if="vehData.partEx && targetVehicle">
                  Estimated difference to change (vs. mid-range):
                  <span class="font-bold">
                    £{{ formatGBP(Math.max((+targetVehicle.price || 0) - partExBase, 0)) }}
                  </span>
                </template>
                <template v-else>
                  These figures are indicative. Book an appointment to receive a firm cash offer.
                </template>
              </div>
              <div class="flex gap-2">
                <PrimeButton label="Book Inspection" severity="contrast" />
                <PrimeButton
                  v-if="vehData.partEx"
                  label="Choose Another Car"
                  text
                  @click="() => { formLocked = false; valuation = null; }"
                />
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              All figures are indicative and may vary with condition, history and market movement. Final offer confirmed
              after on-site appraisal.
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
  </div>
</template>


<style scoped>
/* put in <style scoped> or a global css */
/* thumbnails */
.dd-thumb {
  width: 44px;
  height: 32px;
  object-fit: cover;
  border-radius: 6px;
  flex: 0 0 44px;
}

/* value (selected) container */
.dd-value {
  display: flex;
  align-items: center;
  gap: .5rem;
  min-width: 0; /* enable ellipsis */
}

/* options row */
.dd-option {
  display: flex;
  align-items: center;
  gap: .75rem;
  min-width: 0; /* enable ellipsis */
  padding-block: 4px;
}

/* ellipsis text */
.dd-text,
.dd-title {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1 1 auto;
  min-width: 0;
}

/* small polish for very narrow screens */
@media (max-width: 480px) {
  .dd-thumb { width: 40px; height: 28px; }
}

.object-cover {
  object-fit: cover;
}

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
