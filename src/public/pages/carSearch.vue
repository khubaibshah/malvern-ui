<template>
  <div>
    <PrimeToast />
    <div class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container">
      <PrimeToast />
      <div
        class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border mb-3">
        <div class="text-3xl font-medium text-900 mb-3">Available Vehicles</div>
        <div class="text-500">Filter Vehicles based on your search criteria.</div>
      </div>
    </div>
    <!-- mega menu -->
    <div
      class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container md:align-items-center md:justify-content-between">
      <!-- Filter Bar -->
      <div
        class="filter-bar  text-white px-2 py-1 flex flex-wrap gap-3 align-items-center justify-content-start">
        <div
          class=" text-white px-2 py-3 flex flex-wrap gap-3 justify-content-start desktop-margin-left">

          <Dropdown v-model="vehicle_make" :options="makeOptions" optionLabel="label" class="w-full md:w-14rem"
            placeholder="Make" />
          <Dropdown v-model="vehicle_model" :options="filteredModelOptions" optionLabel="label"
            class="w-full md:w-14rem" placeholder="Model" />
          <Dropdown v-model="vehicle_variant" :options="filteredVariantOptions" optionLabel="label"
            class="w-full md:w-14rem" placeholder="Variant" />
          <PrimeButton icon="pi pi-times" label="Clear" @click="clearFilters"
            class="p-button-sm p-button-secondary w-full md:w-auto" />
        </div>

      </div>
      

      <div class="col-12 md:col-12 mt-5">
        <div class="flex justify-content-between mb-4">
        </div>

        <div class="grid">
          
          <div v-for="(item, index) in filteredVehicles" :key="index" class="col-12 sm:col-6 lg:col-4 p-2">
            <div class="p-3 border-1 surface-border surface-card border-round shadow-1 relative">
              <!-- Image Carousel (or first image preview) -->
              <div class="relative">
                <img v-if="item.images && item.images.length > 0" :src="item.images[0]" alt="car"
                  class="w-full border-round" style="height: 180px; object-fit: cover;" />
                <div v-else class="h-[180px] w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>

                <!-- Registration Plate Badge -->
                <div
                  class="absolute bottom-0 right-0 bg-white text-black text-xs font-semibold px-2 py-1 border-round m-2 shadow">
                  £{{ item.price?.toLocaleString() || '£N/A' }}
                </div>
              </div>

              <!-- Car Info -->
              <div class="mt-3">
                <div class="text-lg font-bold text-900 mb-1">
                  {{ item.make }} {{ item.model }}
                </div>
                <div class="text-sm text-600 mb-1">
                  {{ item.variant || 'Variant Info' }}
                </div>
                <div class="text-xs text-gray-500 mb-2 truncate">
                  {{ item.description || 'No description provided' }}
                </div>

                <!-- Badges -->
                <div class="flex gap-2 flex-wrap mt-2">
                  <span class="text-xs bg-gray-100 border-round px-2 py-1 text-gray-800 font-medium">
                    {{ item.mileage?.toLocaleString() || '0' }} miles
                  </span>
                  <span class="text-xs bg-gray-100 border-round px-2 py-1 text-gray-800 font-medium">
                    {{ item.year || 'Year' }}
                  </span>
                </div>

                <!-- Price -->
                <div class="text-xl text-green-600 font-bold mt-2">
                  £{{ item.price?.toLocaleString() || 'N/A' }}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>




    </div>

    <!-- Content Section with Filter + Cars -->
    <div class="grid pl-2 mt-3 mr-0">

      <!-- Filter Column -->
      <div class="col-12 md:col-12">

      </div>

      <!-- Cars Column -->

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
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/get-all-vehicles`)
    if (response.status === 200) {
      vehicles.value = response.data.cars || []

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
.filter-bar {
  font-size: 0.95rem;
  font-weight: 500;
  background-color: #000; /* Default for desktop */
  color: #fff;
}

/* Invert colors for mobile */
@media (max-width: 768px) {
  .filter-bar {
    background-color: #fff !important;
    color: #000 !important;
    /* border: 2px solid #ddd !important;
    border-radius: 1rem; */

  }

  ::v-deep(.p-dropdown) {
    background-color: #fff !important;
    color: #000 !important;
    border: 1px solid #ccc !important;
  }

  ::v-deep(.p-dropdown .p-dropdown-label) {
    color: #000 !important;
  }

  ::v-deep(.p-dropdown-panel) {
    background-color: #fff !important;
  }

  ::v-deep(.p-dropdown-item) {
    color: #000 !important;
  }

  ::v-deep(.p-dropdown-item.p-highlight) {
    background-color: #ddd !important;
    color: #000 !important;
  }

  .white-btn {
    color: #000 !important;
    border-color: #000 !important;
  }

  .white-btn:hover {
    background-color: #eee !important;
    border-color: #aaa !important;
  }
}

@media (max-width: 768px) {
  .p-megamenu-start {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

.filter-bar {
  /* border-radius: 0.75rem; */
  /* margin-top: 2rem; */
  font-size: 0.95rem;
  font-weight: 500;
  background: #000000;

  /* Matches Audi’s bar */
}

.white-btn {
  color: #fff;
  background-color: transparent;
  border-color: #fff;
}

.white-btn:hover {
  background-color: #333;
  border-color: #ccc;
}



@media (max-width: 768px) {
  .filter-bar {
    /* flex-direction: column; */
    align-items: stretch;
  }
}

@media (min-width: 768px) {
  .desktop-margin-left {
    margin-left: 2rem;
  }
}

::v-deep(.p-dropdown) {
  background-color: #000 !important;
  color: #fff !important;
  border: 1px solid #333;
}

::v-deep(.p-dropdown .p-dropdown-label) {
  color: #fff !important;
}

::v-deep(.p-dropdown-panel) {
  background-color: #000 !important;
}

::v-deep(.p-dropdown-item) {
  color: #fff !important;
}

::v-deep(.p-dropdown-item.p-highlight) {
  background-color: #333 !important;
  color: #fff !important;
}

</style>
