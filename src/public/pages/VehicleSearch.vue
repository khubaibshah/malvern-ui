<template>
  <div>
    <PrimeToast />
    <div class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container">
      <div
        class="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
        <div class="text-3xl font-medium text-900 mb-3" style="margin-left:3px;">Available Vehicles</div>
        <div class="text-500">Filter Vehicles based on your search criteria.</div>
      </div>
    </div>

    <!-- mega menu -->
    <div
      class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container md:align-items-center md:justify-content-between">

      <!-- Filter Bar -->
      <div class="filter-bar text-white py-1 flex flex-wrap gap-3 align-items-center justify-content-start">

        <!-- DESKTOP FILTER CONTROLS -->
        <div class="hidden md:flex text-white px-2 py-3 flex-wrap gap-3 justify-start desktop-margin-left">
          <Dropdown v-model="vehicle_make" :options="makeOptions" optionLabel="label"
            class="w-full md:w-14rem custom-black-button" placeholder="Make" />
          <Dropdown v-model="vehicle_model" :options="filteredModelOptions" optionLabel="label"
            class="w-full md:w-14rem custom-black-button" placeholder="Model" />
          <Dropdown v-model="vehicle_variant" :options="filteredVariantOptions" optionLabel="label"
            class="w-full md:w-14rem custom-black-button" placeholder="Variant" />
          <PrimeButton icon="pi pi-filter" label="Advanced Filters" class="w-full md:w-14rem custom-black-button"
            @click="showFilters = true" />
          <PrimeButton icon="pi pi-times" label="Clear filters" @click="clearFilters"
            class="w-full md:w-auto custom-black-button" />
        </div>

        <!-- MOBILE FILTER CONTROLS -->
        <div class="md:hidden w-full">
          <Dropdown v-model="vehicle_make" :options="makeOptions" optionLabel="label"
            class="w-full md:w-14rem custom-black-button" placeholder="Make" />
          <Dropdown v-model="vehicle_model" :options="filteredModelOptions" optionLabel="label"
            class="w-full md:w-14rem custom-black-button" placeholder="Model" />
          <Dropdown v-model="vehicle_variant" :options="filteredVariantOptions" optionLabel="label"
            class="w-full md:w-14rem custom-black-button" placeholder="Variant" />
          <PrimeButton icon="pi pi-filter" label="Advanced Filters" class="w-full md:w-14rem custom-black-button"
            @click="showFilters = true" />
          <PrimeButton icon="pi pi-times" label="Clear filters" @click="clearFilters"
            class="w-full md:w-auto custom-black-button" />
        </div>

        <!-- MODAL -->
        <FilterModel ref="filterModelRef" v-model:visible="showFilters" @applyFilters="fetchFilteredVehicles" />
      </div>

      <div class="col-12 md:col-12 mt-2">
        <div class="flex justify-content-between mb-4"></div>

        <!-- Loading skeletons -->
        <div v-if="loading" class="grid">
          <div v-for="n in 6" :key="n" class="col-12 sm:col-6 lg:col-4 p-2">
            <div class="p-3 border-1 surface-border surface-card border-round shadow-1 relative">
              <PrimeSkeleton width="100%" height="180px" class="mb-3 border-round" />
              <PrimeSkeleton width="70%" class="mb-2" />
              <PrimeSkeleton width="50%" class="mb-2" />
              <PrimeSkeleton width="100%" height="1rem" />
              <div class="flex justify-content-between mt-3">
                <PrimeSkeleton width="5rem" height="2rem" />
                <PrimeSkeleton width="5rem" height="2rem" />
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicle cards -->
        <div class="grid" v-else-if="filteredVehicles.length > 0">
          <div v-for="(item, index) in filteredVehicles" :key="index" class="col-12 sm:col-6 lg:col-4 p-2">
            <RouterLink :to="{ name: 'vehicle-details', params: { id: item.id } }" class="no-underline">
              <div class="relative">
                <PrimeCard style="overflow: hidden" class="mb-4">
                  <!-- IMAGE with SOLD overlay -->
                  <template #header>
                    <div class="relative">
                      <!-- CHANGED: unified image source selection -->
                      <img
                        :src="getPrimaryImage(item) || '/src/assets/img/default.jpg'"
                        alt="car"
                        class="w-full border-round"
                        style="object-fit: cover;"
                        :class="{ 'sold-dim': isSold(item) }"
                      />
                      <!-- SOLD ribbon -->
                      <div v-if="isSold(item)" class="sold-ribbon" aria-label="Sold">SOLD</div>
                    </div>
                  </template>

                  <template #title>
                    <h3 class="text-sm font-bold text-800 mb-1">{{ item.make }} {{ item.model }}</h3>
                  </template>

                  <template #subtitle>
                    <div class="text-sm text-gray-500 mb-1">
                      {{ item.variant || 'No Variant' }} • {{ item.year || 'N/A' }} • {{ item.body_style || 'N/A' }}
                    </div>
                  </template>

                  <template #content>
                    <div class="flex gap-2 flex-wrap mt-2">
                      <span class="text-xs bg-gray-100 border-round px-2 py-1 text-gray-800 font-medium">
                        {{ item.mileage?.toLocaleString() || '0' }} miles
                      </span>
                      <span class="text-xs bg-gray-100 border-round px-2 py-1 text-gray-800 font-medium">
                        {{ item.year || 'Year' }}
                      </span>
                    </div>
                  </template>

                  <template #footer>
                    <div class="flex gap-3 mt-1 items-center">
                      <div
                        class="text-xl font-bold mt-2"
                        :class="isSold(item) ? 'text-gray-400 line-through' : 'text-green-400'"
                      >
                        £{{ item.price?.toLocaleString() || 'N/A' }}
                      </div>
                      <span v-if="isSold(item)" class="text-xs px-2 py-1 bg-red-100 text-red-600 border-round font-semibold">
                        Sold
                      </span>
                    </div>
                  </template>
                </PrimeCard>
              </div>
            </RouterLink>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 py-4">
          No vehicles found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import FilterModel from '../components/filterModal.vue'

import { useVehicleStore } from '@/stores/vehicleData'
import VehicleService from '@/services/VehicleService'

const vehicleStore = useVehicleStore()

const filterModelRef = ref(null);
const toast = useToast()
const vehicles = ref<any[]>([])
const layout = ref('grid')
const vehicle_make = ref()
const vehicle_model = ref()
const vehicle_variant = ref()
const advancedFilters = ref(false);
const makeOptions = ref<any[]>([])
const modelOptions = ref<any[]>([])
const variantOptions = ref<any[]>([])
const loading = ref(true)
const showFilters = ref(false);
const isSold = (v:any) => String(v?.vehicle_status).toUpperCase() === 'WASTEBIN'

/** ---- IMAGE HELPERS (DB first → main_image → default) ---- **/
const decodeImageUrl = (val: any): string => {
  if (!val) return ''
  const s = String(val)
  if (/^https?:\/\//i.test(s)) return s
  try {
    // handle potential URL-safe base64 just in case
    const normalized = s.replace(/-/g, '+').replace(/_/g, '/')
    return atob(normalized)
  } catch {
    return s
  }
}

const getPrimaryImage = (car: any): string => {
  // 1) Prefer DB images if present (objects with car_image/is_main/sort_order)
  if (Array.isArray(car.images) && car.images.length > 0) {
    if (typeof car.images[0] === 'object' && car.images[0] !== null) {
      const sorted = [...car.images].sort((a: any, b: any) =>
        Number(b?.is_main || 0) - Number(a?.is_main || 0) ||
        (a?.sort_order ?? 1e9) - (b?.sort_order ?? 1e9) ||
        (a?.id ?? 1e9) - (b?.id ?? 1e9)
      )
      const first = sorted[0]?.car_image
      const decoded = decodeImageUrl(first)
      if (decoded) return decoded
    } else {
      // older format: array of base64/url strings
      const decoded = decodeImageUrl(car.images[0])
      if (decoded) return decoded
    }
  }
  // 2) Fallback to main_image if provided
  if (car.main_image) {
    const decoded = decodeImageUrl(car.main_image)
    if (decoded) return decoded
  }
  // 3) Final fallback
  return '/src/assets/img/default.jpg'
}
/** -------------------------------------------------------- **/

const prepareDropdowns = () => {
  const makes = new Set<string>();
  const models = new Set<string>();
  const variants = new Set<string>();

  vehicles.value.forEach((v: any) => {
    if (v.make) makes.add(v.make);
    if (v.model) models.add(v.model);
    if (v.variant) variants.add(v.variant);
  });

  makeOptions.value = [...makes].map(m => ({ label: m, value: m }));
  modelOptions.value = [...models].map(m => ({ label: m, value: m }));
  variantOptions.value = [...variants].map(v => ({ label: v, value: v }));
};

onMounted(async () => {
  try {
    const cars = await VehicleService.loadVehicles();
    vehicles.value = cars;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load vehicle data',
      life: 3000
    });
  } finally {
    loading.value = false;
    prepareDropdowns();
  }
});

const fetchFilteredVehicles = async (filters: any) => {
  try {
    const data = await VehicleService.getVehiclesByFilters(filters);
    vehicleStore.setVehicles(data.cars || []);
    vehicles.value = vehicleStore.getVehicles;
    prepareDropdowns();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to apply filters', life: 3000 });
  }
};

const filteredModelOptions = computed(() => {
  const models = new Set<string>()
  vehicles.value.forEach((v: any) => {
    if (!vehicle_make.value || v.make === vehicle_make.value.value) {
      if (v.model) models.add(v.model)
    }
  })
  return [...models].map(m => ({ label: m, value: m }))
})

const filteredVariantOptions = computed(() => {
  const variants = new Set<string>()
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

  // Reset filters inside the modal
  filterModelRef.value?.resetFilters()

  // Also clear any filtered results and re-fetch full list (optional)
  fetchFilteredVehicles({}) // empty filters

  toast.add({
    severity: 'info',
    summary: 'Filters Cleared',
    detail: 'All filters have been reset.',
    life: 2000
  })
}
</script>

<style scoped>
/* Diagonal ribbon */
.sold-ribbon {
  position: absolute;
  top: 12px;
  left: -40px;
  transform: rotate(-45deg);
  background: #ef4444;
  color: #fff;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 6px 56px;
  box-shadow: 0 8px 20px rgba(0,0,0,.25);
  text-transform: uppercase;
  font-size: 0.85rem;
  pointer-events: none;
}

/* Dim image when sold */
.sold-dim {
  filter: grayscale(50%) brightness(0.85);
}

:deep(.custom-black-button) {
  background-color: black !important;
  color: white !important;
  border: 1px solid black !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  /* removes rounding */
}

:deep(.custom-black-button:focus),
:deep(.custom-black-button:focus-visible) {
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.5) !important;
  /* black focus ring */
  outline: none !important;
}

.filter-bar {
  font-size: 0.95rem;
  font-weight: 500;
  background-color: #000;
  /* Default for desktop */
  color: #fff;
}

/* Invert colors for mobile */
@media (max-width: 768px) {
  .filter-bar {
    background-color: #fff !important;
    color: #000 !important;
  }

  ::v-deep(.p-dropdown) {
    background-color: #fff !important;
    color: #000 !important;
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
  font-size: 0.95rem;
  font-weight: 500;
  background: #000000;
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
