<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const car = ref<any>(null)
const mainImage = ref<string>('')
const images = ref<string[]>([])

const seshId = localStorage.getItem('token') || ''

const fetchCar = async () => {
  try {
    const id = route.params.id
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/get-vehicle-by-id/${id}`)
    car.value = res.data.car
    images.value = Array.isArray(car.value.images) ? car.value.images : []
    if (Array.isArray(images.value) && images.value.length > 0) {
      mainImage.value = car.value.main_image || images.value[0]
    }
  } catch (err) {
    console.error('Failed to load car data', err)
  }
}

onMounted(fetchCar)
</script>

<template>
  <div class="surface-section px-4 py-6">
    <div v-if="car" class="grid">
      <div class="col-12 md:col-6">
        <img :src="mainImage" alt="Main" class="w-full border-round shadow-1 mb-3" style="height:300px;object-fit:cover;" />
        <div class="flex gap-2 flex-wrap">
          <img
            v-for="(img, idx) in images"
            :key="idx"
            :src="img"
            @click="mainImage = img"
            class="w-4rem h-4rem border-1 border-round cursor-pointer"
            style="object-fit:cover;"
          />
        </div>
      </div>
      <div class="col-12 md:col-6">
        <h2 class="text-2xl font-bold mb-2">{{ car.make }} {{ car.model }} {{ car.variant }}</h2>
        <p class="text-sm text-gray-600 mb-1">Reg: {{ car.registration }}</p>
        <p class="text-xl text-green-600 font-bold mb-3">£{{ car.price?.toLocaleString() }}</p>
        <p class="mb-3">{{ car.description }}</p>
        <ul class="list-none p-0 m-0">
          <li><strong>Year:</strong> {{ car.year }}</li>
          <li><strong>Mileage:</strong> {{ car.mileage?.toLocaleString() }} miles</li>
          <li><strong>Fuel:</strong> {{ car.fuel_type }}</li>
          <li><strong>Colour:</strong> {{ car.colour }}</li>
          <li><strong>Doors:</strong> {{ car.doors }}</li>
        </ul>
      </div>
    </div>
    <div v-else class="text-center">Loading...</div>
  </div>
</template>

<style scoped>
img {
  display: block;
}
</style>
