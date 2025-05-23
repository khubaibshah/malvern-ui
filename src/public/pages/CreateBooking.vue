<template>
  <div>
    <PrimeToast />
    <!-- Hero Section -->
    <div class="hero-section surface-ground p-5">
      <div class="grid grid-nogutter align-items-center justify-content-between">
        <div class="col-12 md:col-6 text-white z-1">
          <h1 class="text-4xl font-bold mb-3">Welcome to SCS Car Sales LTD</h1>
          <p class="text-lg mb-4">In partnership with <span class="font-bold">Malvern Autos</span></p>
          <div class="p-inputgroup w-full md:w-30rem">
            <InputText placeholder="Keyword search" class="w-full p-3 border-round" />
            <PrimeButton icon="pi pi-search" class="p-button-secondary" />
          </div>
        </div>
        <div class="col-12 md:col-6 text-center mt-4 md:mt-0 hidden md:block">
          <img src="../../assets/img/lambo.png" alt="car" class="hero-image" />
        </div>
      </div>
    </div>

    <!-- Content Section with Filter + Cars -->
    <div class="grid pl-2 mt-3 mr-0">
      <!-- Filter Column -->
      <div class="col-12 md:col-3">
        <div class="p-4 border-1 surface-border surface-card border-round">
          <h2 class="text-xl font-semibold mb-3">Filter Cars</h2>

          <div class="mb-4">
            <Dropdown v-model="vehicle_make" :options="makeOptions" optionLabel="label" class="w-full" placeholder="Select Make" />
          </div>

          <div class="mb-4">
            <Dropdown v-model="vehicle_model" :options="filteredModelOptions" optionLabel="label" class="w-full" placeholder="Select Model" />
          </div>

          <div class="mb-4">
            <Dropdown v-model="vehicle_variant" :options="filteredVariantOptions" optionLabel="label" class="w-full" placeholder="Select Variant" />
          </div>

          <PrimeButton label="Apply Filters" icon="pi pi-filter" class="w-full mt-2" @click="applyFilters" />
          <PrimeButton label="Clear Filters" icon="pi pi-times" severity="secondary" class="w-full mt-2" @click="clearFilters" />
        </div>
      </div>

      <!-- Cars Column -->
      <div class="col-12 md:col-9">
        <div class="flex justify-content-between mb-4">
          <div>
            <div class="text-3xl font-medium text-900 mb-2">Cars Available</div>
            <div class="text-500">Filtered Vehicles based on your search criteria.</div>
          </div>
        </div>

        <div class="grid">
          <div v-for="(item, index) in filteredVehicles" :key="index" class="col-12 sm:col-6 lg:col-4 p-2">
            <div class="p-3 border-1 surface-border surface-card border-round">
              <div class="relative">
                <img
                  v-if="item.images && item.images.length > 0"
                  class="border-round w-full"
                  :src="item.images[0].car_image.startsWith('http') ? item.images[0].car_image : `data:image/jpeg;base64,${item.images[0].car_image}`"
                  :alt="item.make"
                  style="height: 200px; object-fit: cover;"
                />
              </div>
              <div class="mt-3">
                <div class="text-lg font-bold text-900 mb-1">{{ item.make }}</div>
                <div class="text-md text-500 mb-2">{{ item.model }}</div>
                <div class="text-sm text-500 mb-2">{{ item.variant || 'Category' }}</div>
                <div class="text-green-600 font-semibold">£{{ item.price || 'N/A' }}</div>
                <div class="text-500 text-sm line-through">£{{ item.was_price || '123.00' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const vehicles = ref([])
const layout = ref('grid')
const vehicle_make = ref()
const vehicle_model = ref()
const vehicle_variant = ref()

const makeOptions = ref([])
const modelOptions = ref([])
const variantOptions = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/scs-cars')
    if (response.status === 200) {
      vehicles.value = response.data

      const makes = new Set()
      const models = new Set()
      const variants = new Set()

      vehicles.value.forEach((v: any) => {
        if (v.make) makes.add(v.make)
        if (v.model) models.add(v.model)
        if (v.variant) variants.add(v.variant)
      })

      makeOptions.value = [...makes].map(m => ({ label: m, value: m }))
      modelOptions.value = [...models].map(m => ({ label: m, value: m }))
      variantOptions.value = [...variants].map(v => ({ label: v, value: v }))
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load car data', life: 3000 })
  }
})

const filteredModelOptions = computed(() => {
  const models = new Set()
  vehicles.value.forEach((v: any) => {
    if (!vehicle_make.value || v.make === vehicle_make.value.value) {
      if (v.model) models.add(v.model)
    }
  })
  return [...models].map(m => ({ label: m, value: m }))
})

const filteredVariantOptions = computed(() => {
  const variants = new Set()
  vehicles.value.forEach((v: any) => {
    if (!vehicle_make.value || v.make === vehicle_make.value.value) {
      if (!vehicle_model.value || v.model === vehicle_model.value.value) {
        if (v.variant) variants.add(v.variant)
      }
    }
  })
  return [...variants].map(v => ({ label: v, value: v }))
})

const filteredVehicles = computed(() => {
  return vehicles.value.filter((v: any) => {
    const makeMatch = vehicle_make.value ? v.make === vehicle_make.value.value : true
    const modelMatch = vehicle_model.value ? v.model === vehicle_model.value.value : true
    const variantMatch = vehicle_variant.value ? v.variant === vehicle_variant.value.value : true
    return makeMatch && modelMatch && variantMatch
  })
})

const applyFilters = () => {
  toast.add({ severity: 'info', summary: 'Filters Applied', detail: 'Car list updated.', life: 2000 })
}

const clearFilters = () => {
  vehicle_make.value = null
  vehicle_model.value = null
  vehicle_variant.value = null
  toast.add({ severity: 'info', summary: 'Filters Cleared', detail: 'All filters have been reset.', life: 2000 })
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(to right, #facc15, #f97316);
  border-radius: 0 0 1.5rem 1.5rem;
  position: relative;
}

.hero-image {
  max-height: 230px;
  filter: drop-shaWdow(0 10px 15px rgba(0, 0, 0, 0.2));
}
</style>
