<script setup lang="ts">
import { formatEngineSize } from '@/utils/engineSizeFormat';


import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { getUkRegistrationLabel } from '@/utils/registration';
import enquiryForm from '../components/enquiryForm.vue';
import { useVehicleStore } from '@/stores/vehicleData';


const route = useRoute()
const car = ref<any>(null)
const images = ref<string[]>([])
const galleriaItems = ref<any[]>([])
const mainImage = ref<string>('')
const loading = ref(true)
const formattedEngineSize = computed(() => formatEngineSize(car.value?.engine_size));



import router from '@/router/router';
import EnquiryForm from '../components/enquiryForm.vue';



const currentImageIndex = ref(0)

watch(images, () => {
  if (images.value.length > 0) {
    const mainIdx = images.value.indexOf(car.value.main_image);
    currentImageIndex.value = mainIdx !== -1 ? mainIdx : 0;
    mainImage.value = images.value[currentImageIndex.value];
  }
});

let startX = 0

const startTouch = (e: TouchEvent) => {
  startX = e.changedTouches[0].clientX
}

const endTouch = (e: TouchEvent) => {
  const endX = e.changedTouches[0].clientX
  const deltaX = endX - startX

  if (Math.abs(deltaX) > 50) {
    if (deltaX < 0) {
      // swipe left
      nextImage()
    } else {
      // swipe right
      prevImage()
    }
  }
}

const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++
    mainImage.value = images.value[currentImageIndex.value]
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
    mainImage.value = images.value[currentImageIndex.value]
  }
}


const responsiveOptions = ref([
  { breakpoint: '1300px', numVisible: 4 },
  { breakpoint: '575px', numVisible: 1 }
])
const vehicleStore = useVehicleStore();
const fetchCar = async () => {
  try {
    const id = route.params.id
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/get-vehicle-by-id/${id}`)
    car.value = res.data.car
    console.log('Full car data:', car.value)

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
  } finally {
    loading.value = false
  }
}


const registrationLabel = computed(() => {
  const dateStr = car.value?.registration_date || car.value?.reg_date || '';
  return dateStr ? getUkRegistrationLabel(dateStr) : '';
});

const handleEnquireClick = () => {
  vehicleStore.setVehicleData(car.value);
  router.push({ name: 'enquiry-form', params: { vehicleId: car.value.id } });
};

onMounted(fetchCar)
</script>

<template>

  <div class="surface-section px-3 py-5 md:px-6 lg:px-8">
    <PrimeButton label="All Vehicles" text class="mt-2 mb-2" style="right: 15px; color: black;" icon="pi pi-arrow-left"
      @click="router.back()" />
    <div class="grid" v-if="loading">
      <!-- Skeletons while loading -->
      <div class="col-12 md:col-6 lg:col-8">
        <PrimeSkeleton width="100%" height="350px" class="mb-3 border-round mx-auto max-w-[400px]" />
        <div class="flex gap-3 overflow-x-auto max-w-[400px] mx-auto">
          <PrimeSkeleton v-for="n in 4" :key="n" width="7rem" height="5rem" class="border-round" />
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <PrimeCard class="w-full">
          <template #title>
            <PrimeSkeleton width="70%" class="mb-2" />
          </template>
          <template #content>
            <PrimeSkeleton width="50%" class="mb-2" />
            <PrimeSkeleton width="50%" class="mb-2" />
            <PrimeSkeleton width="50%" class="mb-2" />
            <PrimeSkeleton height="4rem" class="mt-4" />
            <PrimeSkeleton width="100%" height="2.5rem" class="mt-3" />
          </template>
        </PrimeCard>
      </div>
    </div>

    <div class="grid" v-else-if="car">

      <!-- images and thumbail section -->
      <div class="col-12 md:col-6 lg:col-8">
        <div class="mb-4 border rounded overflow-hidden max-w-[200px] mx-auto touch-area" @touchstart="startTouch"
          @touchend="endTouch"> <img :src="mainImage" alt="Main Image" class="w-full h-[250px] object-cover rounded"
            style="
          border-radius: 12px;" />

        </div>
        <div class="flex gap-3 overflow-x-auto max-w-[400px] mx-auto">
          <img v-for="(img, idx) in images" :key="idx" :src="img" class="object-cover rounded cursor-pointer border-2"
            style="    width: 7rem;
          height: 5rem;" :class="{ 'border-blue-500': mainImage === img, 'border-gray-300': mainImage !== img }"
            @click="() => { mainImage = img; currentImageIndex.value = idx }" />
        </div>
      </div>

      <!-- vehicle details -->
      <div class="col-12 md:col-6 lg:col-4">
        <PrimeCard class="w-full border-color custom-shadow ">

          <template #title>
            <!-- {{ car }} -->
            <div class="text-3xl font-medium text-900">{{ car.make }} {{ car.model }} {{ car.variant }}</div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-4 text-gray-800 text-sm" style="margin:0rem">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-road text-lg text-gray-500"></i>
                <span>{{ car.mileage?.toLocaleString() }} Miles</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-calendar text-lg text-gray-500"></i>
                <span>{{ registrationLabel }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-key text-lg text-gray-500"></i>
                <span>{{ car.keys || 'N/A' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-gear text-lg text-gray-500"></i>
                <span>{{ car.gearbox }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-car-side text-lg text-gray-500"></i>
                <span>{{ car.body_style }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-gas-pump text-lg text-gray-500"></i>
                <span>{{ car.fuel_type }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-gear text-lg text-gray-500"></i>
<span>{{ formattedEngineSize }}</span>
              </div>
            </div>

            <Accordion :activeIndex="0" class="mt-5">
              <AccordionTab header="Description">
                <i class="pi pi-align-left mr-2"></i>
                <p class="text-gray-700 text-sm leading-relaxed">
                  {{ car.description }}
                </p>
              </AccordionTab>
            </Accordion>

            <p class="text-2xl text-green-600 font-bold mt-5 mb-4">£{{ car.price?.toLocaleString() }}</p>

            <PrimeButton label="Enquire / Book Test Drive" class="w-full custom-black-button"
              @click="handleEnquireClick" />
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

.custom-shadow {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

}
</style>