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
const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 1,
    numScroll: 1
  }
])

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
</script>


<template>
  <div class="hero-container">

    <div class="overlay"></div>
    <div class="content">
      <h1 class="main-heading">STANLEY CAR SALES</h1>
      <div class="button-row">

        <PrimeButton label="Discover more" class="custom-button left-btn" />
        <PrimeButton label="Find & Buy" class="custom-button right-btn" />
      </div>
    </div>
  </div>
<div class="card">

  <PrimeCarousel :value="vehicles" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular
    :autoplayInterval="3000">
    <template #item="slotProps">
  <div class="carousel-card p-3 border-1 surface-border surface-card border-round shadow-1">
    <div class="relative">
      <img
        v-if="slotProps.data.images?.[0]"
        :src="slotProps.data.images[0]"
        alt="car"
        class="w-full border-round mb-3"
        style="height: 140px; object-fit: cover;"
      />
      <div
        class="absolute top-0 left-0 px-2 py-1 text-xs font-bold text-white bg-red-500 border-round-left"
        v-if="slotProps.data.mileage && slotProps.data.mileage > 100000"
      >
        HIGH MILES
      </div>
    </div>

    <div class="font-medium text-base mb-1">
      {{ slotProps.data.make }} {{ slotProps.data.model }}
    </div>
    <div class="text-sm text-gray-600 mb-2">{{ slotProps.data.variant || 'No variant' }}</div>
    <div class="text-lg font-bold text-green-600 mb-3">£{{ slotProps.data.price?.toLocaleString() }}</div>

    <div class="flex justify-between items-center">
      <PrimeButton icon="pi pi-heart" severity="secondary" outlined rounded />
      <PrimeButton icon="pi pi-info-circle" rounded label="Details" />
    </div>
  </div>
</template>


  </PrimeCarousel>


</div>

</template>
<style scoped>
.carousel-card {
  width: 100%;
  max-width: 240px;
  min-height: 320px;
  margin: auto;
  text-align: center;
}

.hero-container {
  position: relative;
  width: 100%;
  height: 90vh;
  background-image: url('/src/assets/img/lamb4.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 90%;
  margin-right: 75rem;
  margin-top: 26rem;
}

.main-heading {
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  margin: 0.5rem 0 2rem 0;
}

.button-row {
  display: flex;
  gap: 0.5rem;
  /* slight gap */
}

/* Override PrimeButton deeply */
:deep(.custom-button) {
  border-radius: 0 !important;
  height: 3.5rem !important;
  padding: 0 2rem !important;
  font-size: 1rem !important;
  border-width: 1px !important;
  box-shadow: none !important;
}

/* Left (white background, black text) */
:deep(.left-btn) {
  background-color: white;
  color: black;
  border: 1px solid black;
  font-weight: 500;
}

/* Right (black background, white text) */
:deep(.right-btn) {
  background-color: black;
  color: white;
  border: 1px solid white;
  font-weight: 500;
}
</style>
