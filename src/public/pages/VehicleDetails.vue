<script setup lang="ts">
/* unchanged script from your message */
import { formatEngineSize } from '@/utils/engineSizeFormat';

import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { getUkRegistrationLabel } from '@/utils/registration';
import enquiryForm from '../components/enquiryForm.vue';
import { useVehicleStore } from '@/stores/vehicleData';
import VehicleService from '@/services/VehicleService'

import router from '@/router/router';
import EnquiryForm from '../components/enquiryForm.vue';

const route = useRoute()
const car = ref<any>(null)
const images = ref<string[]>([])
const galleriaItems = ref<any[]>([])
const mainImage = ref<string>('')
const loading = ref(true)
const formattedEngineSize = computed(() => formatEngineSize(car.value?.engine_size));
const currentImageIndex = ref(0)

const isSoldCar = computed(() =>
  String(car.value?.vehicle_status || '').toUpperCase() === 'WASTEBIN'
)

/** ---- IMAGE HELPERS (DB first → main_image → default) ---- **/
const decodeImageUrl = (val: any): string => {
  if (!val) return ''
  const s = String(val)
  if (/^https?:\/\//i.test(s)) return s
  try {
    const normalized = s.replace(/-/g, '+').replace(/_/g, '/')
    return atob(normalized)
  } catch {
    return s
  }
}

const buildImageArray = (carObj: any): string[] => {
  const imgs = carObj?.images
  if (Array.isArray(imgs) && imgs.length && typeof imgs[0] === 'object') {
    const sorted = [...imgs].sort((a: any, b: any) =>
      Number(b?.is_main || 0) - Number(a?.is_main || 0) ||
      (a?.sort_order ?? 1e9) - (b?.sort_order ?? 1e9) ||
      (a?.id ?? 1e9) - (b?.id ?? 1e9)
    )
    return sorted.map((it: any) => decodeImageUrl(it?.car_image)).filter(Boolean)
  }
  if (Array.isArray(imgs)) {
    return imgs.map(decodeImageUrl).filter(Boolean)
  }
  return []
}

const pickPrimary = (carObj: any, list: string[]): string => {
  if (Array.isArray(carObj?.images) && carObj.images.length && typeof carObj.images[0] === 'object') {
    const mainRow = carObj.images.find((it: any) => !!it?.is_main)
    const fromDbMain = decodeImageUrl(mainRow?.car_image)
    if (fromDbMain) return fromDbMain
  }
  const fromMain = decodeImageUrl(carObj?.main_image)
  if (fromMain) return fromMain
  if (list.length) return list[0]
  return '/src/assets/img/default.jpg'
}
/** -------------------------------------------------------- **/

watch(images, () => {
  if (images.value.length > 0) {
    const decodedMain = decodeImageUrl(car.value?.main_image)
    const mainIdx = decodedMain ? images.value.indexOf(decodedMain) : -1
    currentImageIndex.value = mainIdx !== -1 ? mainIdx : 0
    mainImage.value = images.value[currentImageIndex.value]
  }
})

let startX = 0
const startTouch = (e: TouchEvent) => { startX = e.changedTouches[0].clientX }
const endTouch = (e: TouchEvent) => {
  const endX = e.changedTouches[0].clientX
  const deltaX = endX - startX
  if (Math.abs(deltaX) > 50) deltaX < 0 ? nextImage() : prevImage()
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

const setMain = (idx: number) => {
  if (idx >= 0 && idx < images.value.length) {
    currentImageIndex.value = idx
    mainImage.value = images.value[idx]
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
    const data = await VehicleService.getVehicleById(id)
    car.value = data.car

    images.value = buildImageArray(car.value)
    mainImage.value = pickPrimary(car.value, images.value)

    galleriaItems.value = images.value.map((img: string) => ({
      itemImageSrc: img,
      thumbnailImageSrc: img,
      alt: `${car.value?.make} ${car.value?.model}`,
    }))
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
    <PrimeButton
      label="All Vehicles"
      text
      class="mt-2 mb-2"
      style="right: 15px; color: black;"
      icon="pi pi-arrow-left"
      @click="router.back()"
    />

    <!-- Loading -->
    <div class="grid" v-if="loading">
      <div class="col-12 md:col-6 lg:col-8">
        <PrimeSkeleton width="100%" height="350px" class="mb-3 border-round mx-auto max-w-[400px]" />
        <div class="flex gap-3 overflow-x-auto max-w-[400px] mx-auto">
          <PrimeSkeleton v-for="n in 4" :key="n" width="7rem" height="5rem" class="border-round" />
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <PrimeCard class="w-full">
          <template #title><PrimeSkeleton width="70%" class="mb-2" /></template>
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

    <!-- Vehicle -->
    <div class="grid" v-else-if="car">
      <!-- Images & thumbs -->
      <div class="col-12 md:col-6 lg:col-8">
        <div
          class="mb-4 border rounded overflow-hidden max-w-[200px] mx-auto touch-area relative"
          @touchstart="startTouch"
          @touchend="endTouch"
        >
          <img
            :src="mainImage"
            alt="Main Image"
            class="w-full h-[250px] object-cover rounded"
            :class="{ 'sold-dim': isSoldCar }"
            style="border-radius: 12px;"
          />
          <div v-if="isSoldCar" class="sold-ribbon" aria-label="Sold">SOLD</div>
        </div>

        <!-- Thumbnails: horizontal scroll on mobile, wrap/grid on desktop -->
        <div
          v-if="images.length > 1"
          class="thumbs mx-auto mt-2 w-full"
        >
          <button
            v-for="(img, idx) in images"
            :key="idx"
            type="button"
            class="thumb-btn"
            @click="setMain(idx)"
          >
            <img
              :src="img"
              class="thumb-img object-cover rounded cursor-pointer border-2"
              :class="{
                'border-blue-500': mainImage === img,
                'border-gray-300': mainImage !== img,
                'sold-dim': isSoldCar
              }"
              :alt="`thumb ${idx + 1}`"
            />
          </button>
        </div>
      </div>

      <!-- Details -->
      <div class="col-12 md:col-6 lg:col-4">
        <PrimeCard class="w-full border-color custom-shadow">
          <template #title>
            <div class="text-3xl font-medium text-900">
              {{ car.make }} {{ car.model }} {{ car.variant }}
            </div>
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

            <div class="flex items-center gap-3 mt-5 mb-4">
              <p
                class="text-2xl font-bold"
                :class="isSoldCar ? 'text-gray-400 line-through' : 'text-green-600'"
                style="margin:0"
              >
                £{{ car.price?.toLocaleString() }}
              </p>
              <span
                v-if="isSoldCar"
                class="text-xs px-2 py-1 bg-red-100 text-red-600 border-round font-semibold"
              >
                Sold
              </span>
            </div>

            <PrimeButton
              :label="isSoldCar ? 'Sold' : 'Enquire / Book Test Drive'"
              class="w-full custom-black-button"
              :disabled="isSoldCar"
              @click="!isSoldCar && handleEnquireClick()"
            />
          </template>
        </PrimeCard>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-400">Loading vehicle details...</div>
  </div>
</template>

<style>
/* Reuse same ribbon/dim everywhere */
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
.sold-dim {
  filter: grayscale(40%) brightness(0.85);
}

/* --- Thumbnails layout: mobile = horizontal scroll, desktop = wrap/grid --- */
.thumbs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;
}
.thumbs .thumb-btn {
  flex: 0 0 auto;          /* prevent shrinking on mobile */
  scroll-snap-align: start;
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
}
.thumbs .thumb-img {
  width: 7rem;
  height: 5rem;
}

/* On >= md, allow wrapping (grid-like) and remove horizontal scroll */
@media (min-width: 768px) {
  .thumbs {
    overflow: visible;
    flex-wrap: wrap;
  }
  .thumbs .thumb-btn {
    flex: 0 0 auto;
  }
}

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
}

.custom-black-button:focus,
.custom-black-button:focus-visible {
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.5) !important;
  outline: none !important;
}

.custom-shadow {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
