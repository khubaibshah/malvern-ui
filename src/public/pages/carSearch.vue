<template>
  <div>
    <PrimeToast />
    <div class="surface-section px-4 pt-5 md:px-6 lg:px-8 car-details-container">
      <!-- <PrimeToast /> -->
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

        <!-- DESKTOP FILTER CONTROLS (hidden on small screens) -->
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

        <!-- MOBILE FILTER BUTTON (only visible on small screens) -->
        <div class="flex md:hidden w-full justify-end">
          <PrimeButton icon="pi pi-sliders-h" label="Filters" class="w-full custom-black-button"
            @click="showFilters = true" />
        </div>

        <!-- MODAL -->
        <FilterModel ref="filterModelRef" v-model:visible="showFilters" @applyFilters="fetchFilteredVehicles" />
        <!-- <PrimeDialog v-model:visible="advancedFilters" header="Advanced Filters" maximizable :maximized="true" modal
          :style="{ width: '100vw', height: '100vh' }" :breakpoints="{ '1199px': '100vw', '575px': '100vw' }">
          <p class="m-0">


            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore...
          </p>
        </PrimeDialog> -->

      </div>


      <div class="col-12 md:col-12 mt-2">
        <div class="flex justify-content-between mb-4">
        </div>
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
        <div class="grid" v-else-if="filteredVehicles.length > 0">
          <div v-for="(item, index) in filteredVehicles" :key="index" class="col-12 sm:col-6 lg:col-4 p-2">
            <RouterLink :to="{ name: 'vehicle-details', params: { id: item.id } }" class="no-underline">
              <!-- <div class="p-3 border-1 surface-border surface-card border-round shadow-1 relative cursor-pointer"> -->
              <!-- Image Carousel (or first image preview) -->
              <div class="relative">
                <PrimeCard style="overflow: hidden" class="mb-4">
                  <template #header>
                    <img v-if="item.images && item.images.length > 0" :src="item.images[0]" alt="car"
                      class="w-full border-round" style="object-fit: cover;" />
                    <div v-else
                      class="h-[180px] w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      No Image
                    </div>
                  </template>
                  <template #title>
                    <h3 class="text-sm font-bold text-800 mb-1">{{ item.make }} {{ item.model }}</h3>
                  </template>
                  <template #subtitle>
                    <div class="text-sm text-gray-500 mb-1">
                      {{ item.variant || 'No Variant' }} • {{ item.year || 'N/A' }}

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
                    <div class="flex gap-3 mt-1">
                     <div class="text-xl text-green-400 font-bold mt-2">
                  £{{ item.price?.toLocaleString() || 'N/A' }}
                </div>
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

import { useVehicleStore } from '@/stores/vehicleData' // adjust path as needed
const vehicleStore = useVehicleStore()


const filterModelRef = ref(null);
const toast = useToast()
const vehicles = ref([])
const layout = ref('grid')
const vehicle_make = ref()
const vehicle_model = ref()
const vehicle_variant = ref()
const advancedFilters = ref(false);
const makeOptions = ref([])
const modelOptions = ref([])
const variantOptions = ref([])
const loading = ref(true)
const showFilters = ref(false);


const prepareDropdowns = () => {
  const makes = new Set();
  const models = new Set();
  const variants = new Set();

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
  if (vehicleStore.vehiclesLoaded) {
    vehicles.value = vehicleStore.getVehicles;
    loading.value = false; // ✅ <- this is needed
  } else {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/advanced-filters`);
      if (response.status === 200) {
        vehicleStore.setVehicles(response.data.cars || []);
        vehicles.value = vehicleStore.getVehicles;
        loading.value = false; // ✅ <- also here after async success
      }
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load vehicle data', life: 3000 });
      loading.value = false; // ✅ <- to unblock the UI even if it fails
    }
  }

  prepareDropdowns();
});



const fetchFilteredVehicles = async (filters: any) => {
  try {
    const params: any = {};

    if (filters.price_min !== undefined && filters.price_max !== undefined) {
      params.price_min = filters.price_min;
      params.price_max = filters.price_max;
    }

    if (filters.mileage !== undefined) {
      params.mileage = filters.mileage;
    }

    if (filters.types && Array.isArray(filters.types)) {
      params.types = filters.types.join(',');
    }

    if (filters.features && Array.isArray(filters.features)) {
      params.features = filters.features.join(',');
    }

    if (filters.color) {
      params.color = filters.color;
    }

    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/advanced-filters`, { params });
    if (response.status === 200) {
      vehicleStore.setVehicles(response.data.cars || []);
      vehicles.value = vehicleStore.getVehicles;
      prepareDropdowns(); // update dropdowns after filters
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to apply filters', life: 3000 });
  }
};





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
