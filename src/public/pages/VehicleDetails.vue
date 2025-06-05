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

    <div class="grid" v-if="car">

      <!-- images and thumbail section -->
      <div class="col-12 md:col-6 lg:col-8">
        <div class="mb-4 border rounded overflow-hidden max-w-[200px] mx-auto">
          <img :src="mainImage" alt="Main Image" class="w-full h-[250px] object-cover rounded" style="
          border-radius: 12px;" />

        </div>
        <div class="flex gap-3 overflow-x-auto max-w-[400px] mx-auto">
          <img v-for="(img, idx) in images" :key="idx" :src="img" @click="mainImage = img"
            class="object-cover rounded cursor-pointer border-2" style="    width: 7rem;
          height: 5rem;" :class="{ 'border-blue-500': mainImage === img, 'border-gray-300': mainImage !== img }" />
        </div>
      </div>

      <!-- vehicle details -->
      <div class="col-12 md:col-6 lg:col-4">
        <PrimeCard class="w-full">
          <template #title>{{ car.make }} {{ car.model }} {{ car.variant }}</template>
          <template #content>
            <div>
              <div>
                <PrimeTag  severity="contrast":value="car.mileage?.toLocaleString() + ` Miles`" class="mb-2" />
              </div>
              <div>
                <PrimeTag severity="contrast" :value="car.year" class="mb-2" />
              </div>
              <div>
                <PrimeTag  severity="contrast":value="car.fuel_type" class="mb-2" />
              </div>
              <Accordion :activeIndex="0" style="padding-left: 0px;">
                <AccordionTab header="Description">
                  
                  <p class="text-gray-700 text-sm leading-relaxed">
                    {{ car.description }}
                  </p>
                  
                </AccordionTab>

              </Accordion>
              <!-- <p class="text-gray-500 text-sm mb-3">Reg: {{ car.registration }}</p> -->
              <p class="text-2xl text-green-600 font-bold mb-4">£{{ car.price?.toLocaleString() }}</p>
              <PrimeButton label="Enquire / Book Test Drive"
                class="w-full custom-black-button" />
            </div>
          </template>
        </PrimeCard>

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

.custom-black-button {
  background-color: black !important;
  color: white !important;
  border: 1px solid black !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  /* removes rounding */
}

.custom-black-button:focus,
.custom-black-button:focus-visible {
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.5) !important;
  /* black focus ring */
  outline: none !important;
}
</style>