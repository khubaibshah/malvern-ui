<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'


const route = useRoute()
const car = ref<any>(null)
const images = ref<string[]>([])
const galleriaItems = ref<any[]>([])
const mainImage = ref<string>('')

const responsiveOptions = ref([
  { breakpoint: '1300px', numVisible: 4 },
  { breakpoint: '575px', numVisible: 1 }
])

const fetchCar = async () => {
  try {
    const id = route.params.id
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/get-vehicle-by-id/${id}`)
    car.value = res.data.car

    images.value = Array.isArray(car.value.images) ? car.value.images : []

    galleriaItems.value = images.value.map((img: string) => ({
      itemImageSrc: img,
      thumbnailImageSrc: img,
      alt: `${car.value?.make} ${car.value?.model}`,
    }))

    if (images.value.length > 0) {
      mainImage.value = car.value.main_image || images.value[0]
    }
  } catch (err) {
    console.error('Failed to load car data', err)
  }
}

onMounted(fetchCar)
</script>

<template>
  <div class="surface-section px-5 py-5 md:px-6 lg:px-8">
      <div class="text-3xl font-bold text-900 mb-4">{{ car?.make }} {{ car?.model }} {{ car?.variant }}</div>

      <div class="grid">
    <div class="col-12 md:col-12 lg:col-12 mx-auto">
        
    </div>
    <!-- <div class="col-12 md:col-6 lg:col-3">
        <div class="text-center p-3 border-round-sm bg-primary font-bold">col-12 md:col-6 lg:col-3</div>
    </div>
    <div class="col-12 md:col-6 lg:col-3">
        <div class="text-center p-3 border-round-sm bg-primary font-bold">col-12 md:col-6 lg:col-3</div>
    </div>
    <div class="col-12 md:col-6 lg:col-3">
        <div class="text-center p-3 border-round-sm bg-primary font-bold">col-12 md:col-6 lg:col-3</div>
    </div> -->
</div>
<div v-if="car" class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left: Main Image & Thumbnails -->
      <div>
       <div class="mb-4 border rounded overflow-hidden max-w-[400px] mx-auto">
  <img
    :src="mainImage"
    alt="Main Image"
    class="object-cover"
    style="width: 50rem;"
  />
</div>
        <div class="flex gap-3 overflow-x-auto max-w-[400px] mx-auto">
  <img
    v-for="(img, idx) in images"
    :key="idx"
    :src="img"
    @click="mainImage = img"
    class="object-cover rounded cursor-pointer border-2"
    style="    width: 7rem;
    height: 5rem;"
    :class="{ 'border-blue-500': mainImage === img, 'border-gray-300': mainImage !== img }"
/>
</div>
      </div>

      <!-- Right: Vehicle Info -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ car.make }} {{ car.model }} {{ car.variant }}
        </h1>
        <p class="text-gray-500 text-sm mb-1">{{ car.year }} • {{ car.fuel_type }} • {{ car.doors }} doors</p>
        <p class="text-gray-500 text-sm mb-3">Reg: {{ car.registration }}</p>
        <p class="text-2xl text-green-600 font-bold mb-4">£{{ car.price?.toLocaleString() }}</p>

        <div class="mb-4 grid grid-cols-2 gap-y-2 text-sm text-gray-800">
          <div><strong>Mileage:</strong> {{ car.mileage?.toLocaleString() }} mi</div>
          <div><strong>Colour:</strong> {{ car.colour }}</div>
          <div><strong>Type:</strong> {{ car.veh_type }}</div>
          <div><strong>Fuel:</strong> {{ car.fuel_type }}</div>
        </div>

        <PrimeButton
          label="Enquire / Book Test Drive"
          class="w-full bg-blue-600 border-blue-600 hover:bg-blue-700 text-white"
        />
      </div>
    </div>

    <!-- Description -->
    <div class="mt-10 border-t pt-6">
      <h2 class="text-xl font-semibold mb-2">Description</h2>
      <p class="text-gray-700 text-sm leading-relaxed">
        {{ car.description }}
      </p>
    </div>
  </div>

  <div v-else class="text-center py-12 text-gray-400">Loading vehicle details...</div>
      </div>
  
</template>

<style>
@media (max-width: 768px) {
  img {
    max-width: 100%;
  }
}

.img {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>