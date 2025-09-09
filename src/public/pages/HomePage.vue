<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { animate, svg, stagger } from 'animejs';
import Carousel from 'primevue/carousel';
import { useVehicleStore } from '@/stores/vehicleData'

//homepage images
import LamboImage from '@/assets/img/homepage/homepagelambo1.jpg'
import PorscheImage from '@/assets/img/homepage/porche.jpg'
import BugattiImage from '@/assets/img/homepage/bug.jpg'
import VehicleService from '@/services/VehicleService'
const vehicleStore = useVehicleStore()
const router = useRouter();
const toast = useToast();

const vehicles = ref([])
const vehicle_model = ref()
const loading = ref(true)
const isSold = (car:any) => String(car?.vehicle_status).toUpperCase() === 'WASTEBIN'


const form = ref({
  name: '',
  email: '',
  phone: '',
  vehicle_id: null
});

const submitting = ref(false);

const vehicleOptions = ref([]);
const slideText = computed(() => {
  return [
    { title: 'Stanley Car Sales', subtitle: 'Premium Pre-Owned Vehicles · Trusted Service' },
    { title: 'Find Your Dream Car', subtitle: 'Unmatched Selection, Unbeatable Deals' },
    { title: 'Drive Away Today', subtitle: 'Your Next Adventure Starts Here' }
  ][currentIndex.value]
})

const images = ref([
  {
    itemImageSrc: LamboImage,
    thumbnailImageSrc: LamboImage,
    alt: 'lambo'
  },
  {
    itemImageSrc: PorscheImage,
    thumbnailImageSrc: PorscheImage,
    alt: 'porsche gt3 rs'
  },
  {
    itemImageSrc: BugattiImage,
    thumbnailImageSrc: BugattiImage,
    alt: 'bugatti chiron'
  }
])

const featuredVehicles = ref([]);
const makeOptions = ref()
const modelOptions = ref()
const variantOptions = ref()

const responsiveOptions = ref([
  { breakpoint: '1024px', numVisible: 3 },
  { breakpoint: '768px', numVisible: 2 },
  { breakpoint: '560px', numVisible: 1 }
]);

const testimonials = ref([
  {
    quote: "The buying process was seamless and the team was incredibly knowledgeable.",
    name: "Sarah Johnson",
    role: "Audi Q7 Owner",
    avatar: "/src/assets/img/avatar1.jpg"
  },
  {
    quote: "Found my dream car at a great price. Highly recommend!",
    name: "Michael Chen",
    role: "Audi Q5 Owner",
    avatar: "/src/assets/img/avatar2.jpg"
  }
]);
const currentIndex = ref(0);
const currentSlide = computed(() => images.value[currentIndex.value]);
let interval: any = null;

// Decode base64 → URL (safe if already a URL)
const decodeImg = (val: any) => {
  if (!val) return null
  try {
    if (/^https?:\/\//i.test(val)) return val
    return atob(val)
  } catch {
    return val
  }
}

// Pick the best main image for a car
const mainImg = (car: any) => {
  // Prefer explicit main_image from API
  if (car?.main_image) return decodeImg(car.main_image)

  // Otherwise find main in images[] (object shape) or first available
  if (Array.isArray(car?.images) && car.images.length) {
    const imgObj = typeof car.images[0] === 'object'
      ? (car.images.find((x: any) => x.is_main) || car.images[0])
      : null

    if (imgObj) return decodeImg(imgObj.car_image || imgObj.url)
    // legacy string-array fallback
    return decodeImg(car.images[0])
  }

  return '/src/assets/img/default.jpg'
}


const submitTestDriveRequest = async () => {
  if (!form.value.name || !form.value.email || !form.value.phone || !form.value.vehicle_id) {
    toast.add({ severity: 'warn', summary: 'Incomplete', detail: 'Please fill out all fields and select a vehicle to schedule a test drive', life: 3000 });
    return;
  }

  submitting.value = true;

  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/scs/lead/schedule-test-drive`, {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      vehicle_id: form.value.vehicle_id
    });

    toast.add({ severity: 'success', summary: 'Request Sent', detail: 'We will contact you shortly!', life: 3000 });
    form.value = { name: '', email: '', phone: '', vehicle_id: null };
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Try again.', life: 3000 });
  } finally {
    submitting.value = false;
  }
};


onUnmounted(() => {
  clearInterval(interval);
});

onMounted(async () => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }, 5000);
  animate(svg.createDrawable('.line'), {
    draw: ['0 0', '0 1', '1 1'],
    ease: 'inOutQuad',
    duration: 2000,
    delay: stagger(100),
    loop: true
  })

  if (!vehicleStore.vehiclesLoaded) {
  try {
    const data = await VehicleService.getAllVehicles()
    vehicleStore.setVehicles(data.cars || [])
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load car data',
      life: 3000
    })
  }
  }

  // Use store 
  vehicles.value = vehicleStore.getVehicles
  featuredVehicles.value = vehicleStore.getFeaturedVehicles

  // Set options for filters
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

  loading.value = false
  vehicleOptions.value = vehicles.value.map((v: any) => ({
    label: `${v.make} ${v.model} ${v.variant || ''}`.trim(),
    value: v.id,
  }));
})

const filterByModel = (modelName: string) => {
  vehicle_model.value = modelName
}
</script>

<template>
  <PrimeToast />
  <div class="hero-section overflow-hidden car-details-container">
    <!-- Background Images with Transition -->
    <transition name="fade" mode="out-in">
      <div :key="currentIndex" class="hero-slide relative w-full h-full">
        <!-- Background Image -->
        <img :src="currentSlide.itemImageSrc" :alt="currentSlide.alt"
          class="w-full h-full object-cover absolute top-0 left-0 z-0" />

        <!-- Overlay Content -->
        <div class="z-10 absolute overlay-content text-white">
          <h1 class="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up"
            style="font-family: 'Montserrat', sans-serif;">
            {{ slideText.title }}
          </h1>
          <PrimeButton label="Browse Vehicles" class="mb-4" severity="contrast"
            @click="$router.push({ name: 'car-search' })" />
          <div class="flex justify-center gap-3 mt-6">
            <button v-for="(image, index) in images" :key="index" @click="currentIndex = index" class="dot-button"
              :class="{
                'dot-active': currentIndex === index,
                'dot-inactive': currentIndex !== index
              }" aria-label="Slide navigation button" />
          </div>
        </div>
      </div>
    </transition>
  </div>

  <!-- Featured Vehicles -->
  <div class="text-center px-3 mb-8">
    <h2 class="text-3xl font-bold mb-2 text-gray-700" style="margin-top: 4rem;">Our Featured Models</h2>
    <p class="text-gray-500" style="padding: 0 10px;">
      Experience the pinnacle of automotive excellence with our curated selection of premium vehicles
    </p>
  </div>

  <!-- featured car section -->
  <div class="surface-section px-3 md:px-6 lg:px-8">
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

    <!-- Actual Featured Vehicles -->
    <div class="grid mx-auto" v-else-if="featuredVehicles" style="justify-content: center;">
      <div v-for="(car, index) in featuredVehicles" :key="car.id"
        :class="`col-12 sm:col-6 lg:col-4 px-3 mb-5 md:col-${12 / featuredVehicles.length}`">
        <PrimeCard class="border-round-lg overflow-hidden hover-card">
          <template #header>
            <div class="relative">
              <img :src="mainImg(car)":alt="car.make + ' ' + car.model"
                class="w-full h-40 object-cover border-top-round-lg" :class="{ 'sold-dim': isSold(car) }" />
              <div v-if="isSold(car)" class="sold-ribbon">SOLD</div>
            </div>
          </template>
          <template #title>
            <h3 class="text-sm font-bold text-800 mb-1">{{ car.make }} {{ car.model }}</h3>
          </template>
          <template #content>
            <div class="text-sm text-gray-500 mb-1">
              {{ car.variant || 'No Variant' }} • {{ car.year || 'N/A' }}
            </div>
          </template>
          <template #footer>
            <div class="flex gap-3 mt-1">
              <div class="text-lg font-bold text-green-600 mb-3 w-full">
                £{{ parseFloat(car.price).toLocaleString() }}
              </div>
              <RouterLink :to="{ name: 'vehicle-details', params: { id: car.id } }" class="w-full no-underline">
                <PrimeButton label="View Details" class="w-full text-right-btn p-button-sm" text />
              </RouterLink>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </div>

  <!-- call back request form -->
  <div class="text-center px-3 mb-4">
    <h2 class="text-3xl font-bold mb-2 text-gray-700">Schedule a Test Drive</h2>
    <p class="text-gray-500" style="padding: 0 10px;">
      Fill out the form below to request a test drive appointment for your selected vehicle.
    </p>
  </div>
  <div class="surface-section px-3 md:px-6 lg:px-8">
    <div class="grid">
      <!-- Callback form -->
      <div class="col-12 md:col-6 lg:col-6">
        <PrimeCard>
          <template #title>
            <p class="text-gray-500" style="padding: 0 10px;">
              Please fill out your details and select a vehicle for a call back
            </p>
          </template>
          <template #content>
            <div class="mb-4">
              <InputText placeholder="Your Name" class="w-full" v-model="form.name" />
            </div>
            <div class="mb-4">
              <InputText placeholder="Email Address" class="w-full" v-model="form.email" />
            </div>
            <div class="mb-4">
              <InputText placeholder="Phone Number" class="w-full" v-model="form.phone" />
            </div>
            <div class="mb-4">
              <p class="text-md text-gray-600 mt-2" v-if="form.vehicle_id">
                Selected: {{
                  vehicleOptions.find(opt => opt.value === form.vehicle_id)?.label || 'Unknown Vehicle'
                }}
              </p>
            </div>
            <div class="mb-4">
              <PrimeButton label="Request Appointment" class="w-full bg-black text-white font-semibold"
                severity="contrast" :loading="submitting" @click="submitTestDriveRequest()" />
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Vehicle selection carousel -->
      <div class="col-12 md:col-6 lg:col-6">
        <div class="flex overflow-x-auto gap-4 pb-2"
          style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
          <div v-for="(car, index) in vehicles" :key="car.id" class="flex-shrink-0"
            style="scroll-snap-align: start; width: 22rem;">
            <PrimeCard :class="{
              'ring-2 ring-green-500': form.vehicle_id === car.id,
              'hover-card': true
            }" style="width: 100%; overflow: hidden;">
              <template #header>
                <div class="relative">
                  <img :src="mainImg(car)"
                    :alt="car.make + ' ' + car.model"
                    class="w-full h-40 object-cover border-top-round-lg"
                    :class="{ 'sold-dim': isSold(car) }" />
                  <div v-if="isSold(car)" class="sold-ribbon">SOLD</div>
                </div>
              </template>
              <template #title>{{ car.make }} {{ car.model }}</template>
              <template #subtitle>{{ car.variant || 'No Variant' }}</template>
              <template #content>
                <p class="m-0 text-sm text-gray-700">
                  Discover the thrill of driving {{ car.make }}'s {{ car.model }} — packed with features, performance,
                  and style.
                </p>
              </template>
              <template #footer>
                <PrimeButton label="Select This Car" size="small"
                  class="w-full"
                  :disabled="isSold(car)"
                  :outlined="form.vehicle_id !== car.id"
                  :severity="form.vehicle_id === car.id ? 'success' : 'secondary'"
                  @click="form.vehicle_id = car.id" />
              </template>
            </PrimeCard>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- testimonials etc (unchanged below this point) -->
</template>


<style scoped>
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

@media (max-width: 768px) {
  .dot-button {
    width: 16px;
    height: 16px;
    border-radius: 9999px;
    border: 2px solid white;
    background-color: transparent;
    transition: all 0.3s ease;
    left: 10rem;
  }

  .dot-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .dot-active {
    background-color: white;
    transform: scale(1.2);
  }

  .dot-inactive {
    background-color: transparent;
  }

  .hero-section {
    position: relative;
    width: 100%;
    height: 42vh;
    max-height: 800px;
  }

  .hero-section img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    object-fit: cover;
    height: 22rem;
  }
}

.overlay-content {
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 1rem;
  /* max-width: 20rem; */
  text-align: left;
  width: 23rem;
}

@media (min-width: 768px) {
  .dot-button {
    width: 25px;
    height: 25px;
    border-radius: 9999px;
    border: 2px solid white;
    background-color: transparent;
    transition: all 0.3s ease;
  }

  .dot-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .dot-active {
    background-color: white;
    transform: scale(1.2);
  }

  .dot-inactive {
    background-color: transparent;
  }

  .hero-section {
    position: relative;
    width: 100%;
    height: 100vh;
    /* max-height: 800px; */
  }

  .hero-section img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 91vh;
    object-fit: cover;
  }

  .overlay-content {
    bottom: 23rem;
    left: 15rem;
    transform: none;
    padding: 0;
    text-align: left;
    width: 23rem;
  }
}




/* Dots container */
.flex.justify-center.gap-2 {

  gap: 0.5rem;
  z-index: 20;
  /* Ensure dots stay above other elements */
}

/* Individual dot styling */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animation classes */
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
  opacity: 0;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.1s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}



.fade-slide {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeSlideIn 1s ease-out forwards;
}

@keyframes fadeSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-right-btn {
  justify-content: flex-end !important;
  text-align: right !important;
}

.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 40px rgba(0, 0, 0, 0.15);

}
</style>
