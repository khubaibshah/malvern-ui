<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { animate, svg, stagger } from 'animejs';
import Carousel from 'primevue/carousel';
import { useVehicleStore } from '@/stores/vehicleData'

//hompage images
import LamboImage from '@/assets/img/homepage/homepagelambo1.jpg'
import PorscheImage from '@/assets/img/homepage/porche.jpg'
import BugattiImage from '@/assets/img/homepage/bug.jpg'

const vehicleStore = useVehicleStore()
const router = useRouter();
const toast = useToast();

const vehicles = ref([])
const vehicle_model = ref()
const loading = ref(true)


const vehicleOptions = ref([]);
const slideText = computed(() => {
  return [
    { title: 'Stanley Car Sales', subtitle: 'Premium Pre-Owned Vehicles · Trusted Service' },
    { title: 'Find Your Dream Supercar', subtitle: 'Unmatched Selection, Unbeatable Deals' },
    { title: 'Drive Luxury Today', subtitle: 'Your Next Adventure Starts Here' }
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


onUnmounted(() => {
  clearInterval(interval);
});

onMounted(async () => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }, 5000);
  // Animate your SVGs etc.
  animate(svg.createDrawable('.line'), {
    draw: ['0 0', '0 1', '1 1'],
    ease: 'inOutQuad',
    duration: 2000,
    delay: stagger(100),
    loop: true
  })

  if (!vehicleStore.vehiclesLoaded) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/get-all-vehicles`)
      if (response.status === 200) {
        vehicleStore.setVehicles(response.data.cars || [])
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load car data',
        life: 3000
      })
    }
  }

  // Use store directly
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
    value: v.id, // or v.registration if you prefer
  }));
})

const filterByModel = (modelName: string) => {
  vehicle_model.value = modelName
}
</script>

<template>

  <!-- Add this right after the opening <template> tag -->
  <div class="hero-section   overflow-hidden">
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
  <button
    v-for="(image, index) in images"
    :key="index"
    @click="currentIndex = index"
    class="dot-button"
    :class="{
      'dot-active': currentIndex === index,
      'dot-inactive': currentIndex !== index
    }"
    aria-label="Slide navigation button"
  />
</div>

        </div>
      </div>
    </transition>


    <!-- Overlay Content - Positioned bottom right with 4rem offset -->
    <!-- <div class="z-10 absolute text-center" style="bottom:15rem">
      <div class=" text-white">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
          Premium Audi Selections
        </h1>
        <p class="text-xl md:text-2xl mb-8 animate-fade-in-up delay-100">
          Experience luxury performance with our curated collection
        </p>
        <PrimeButton label="Browse Inventory" class="p-button-lg animate-fade-in-up delay-200"
          @click="$router.push({ name: 'inventory' })" />
      </div>
    </div> -->

    <!-- Indicator Dots - Centered at bottom -->

  </div>

  <!-- Featured Vehicles -->
  <div class="text-center px-3 mb-8">
    <h2 class="text-3xl font-bold mb-2 text-gray-700" style="margin-top: 4rem;">Our Featured Models</h2>
    <p class="text-gray-500" style="padding: 0 10px;">
      Experience the pinnacle of automotive excellence with our curated selection of premium vehicles
    </p>
  </div>

  <!-- featured car section -->
  <div class="surface-section px-3  md:px-6 lg:px-8">
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
    <div class="grid mx-auto" v-else-if="featuredVehicles" style="
    justify-content: center;
">
      <div v-for="(car, index) in featuredVehicles" :key="car.id"
        :class="`col-12 sm:col-6 lg:col-4 px-3 mb-5 md:col-${12 / featuredVehicles.length}`">
        <PrimeCard class="border-round-lg overflow-hidden hover-card">
          <template #header>
            <img :src="car.images?.[0] || '/src/assets/img/default.jpg'" :alt="car.make + ' ' + car.model"
              class="w-full h-40 object-cover border-top-round-lg" />
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


          </template>
          <template #content>
            <div class="mb-4">
              <InputText placeholder="Your Name" class="w-full" />
            </div>
            <div class="mb-4">
              <InputText placeholder="Email Address" class="w-full" />
            </div>
            <div class="mb-4">
              <InputText placeholder="Phone Number" class="w-full" />
            </div>
            <div class="mb-4">
              <Dropdown v-model="vehicle_model" :options="vehicleOptions" placeholder="Selected Vehicle" class="w-full"
                :disabled="true" />
            </div>
            <div class="mb-4">
              <PrimeButton label="Request Appointment" class="w-full bg-black text-white font-semibold"
                severity="contrast" />
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
            <PrimeCard style="width: 100%; overflow: hidden;">
              <template #header>
                <img :src="car.images?.[0] || '/src/assets/img/default.jpg'" :alt="car.make + ' ' + car.model"
                  class="w-full h-40 object-cover border-top-round-lg" />
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
                <PrimeButton label="Select This Car" size="small" @click="vehicle_model = car.id" class="w-full"
                  :outlined="vehicle_model !== car.id" :severity="vehicle_model === car.id ? 'success' : 'secondary'" />
              </template>
            </PrimeCard>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- </div> -->


  <!--  -->
  <div class="tile-bg py-8 px-4 text-white mt-7">

    <div class="grid">

      <div class="col-12 md:col-6 lg:col-4">
        <div class="text-center p-6">
          <!-- <i class="pi pi-shield text-5xl mb-4"></i> -->
          <svg viewBox="0 0 304 112" style="
    height: 42px;
">
            <title>Suzuka</title>
            <g stroke="none" fill="none" fill-rule="evenodd">
              <path
                d="M189.142857,4 C227.456875,4 248.420457,4.00974888 256.864191,4.00974888 C263.817211,4.00974888 271.61219,3.69583517 274.986231,6.63061513 C276.382736,7.84531176 279.193529,11.3814152 280.479499,13.4815847 C281.719344,15.5064248 284.841964,20.3571626 275.608629,20.3571626 C265.817756,20.3571626 247.262478,19.9013915 243.955117,19.9013915 C239.27946,19.9013915 235.350655,24.7304885 228.6344,24.7304885 C224.377263,24.7304885 219.472178,21.0304113 214.535324,21.0304113 C207.18393,21.0304113 200.882842,30.4798911 194.124187,30.4798911 C186.992968,30.4798911 182.652552,23.6245972 173.457298,23.6245972 C164.83277,23.6245972 157.191045,31.5424105 157.191045,39.1815359 C157.191045,48.466779 167.088672,63.6623005 166.666679,66.9065088 C166.378668,69.1206889 155.842137,79.2568633 151.508744,77.8570506 C145.044576,75.7689355 109.126667,61.6405346 98.7556561,52.9785141 C96.4766876,51.0750861 89.3680347,39.5769094 83.4195005,38.5221785 C80.6048001,38.0231057 73.0179337,38.7426555 74.4158694,42.6956376 C76.7088819,49.1796531 86.3280337,64.1214904 87.1781062,66.9065088 C88.191957,70.2280995 86.4690152,77.0567847 82.2060607,79.2503488 C79.2489435,80.7719756 73.1324132,82.8858479 64.7015706,83.0708761 C55.1604808,83.2802705 44.4254811,80.401884 39.1722168,80.401884 C25.7762119,80.401884 24.3280517,89.1260466 22.476679,94.4501705 C21.637667,96.8629767 20.4337535,108 33.2301959,108 C37.8976087,108 45.0757044,107.252595 53.4789069,103.876424 C61.8821095,100.500252 122.090049,78.119656 128.36127,75.3523302 C141.413669,69.5926477 151.190142,68.4987755 147.018529,52.0784879 C143.007818,36.291544 143.396957,23.4057975 145.221196,19.6589263 C146.450194,17.1346449 148.420955,14.8552817 153.206723,15.7880203 C155.175319,16.1716965 155.097637,15.0525421 156.757598,11.3860986 C158.417558,7.71965506 161.842736,4.00974888 167.736963,4.00974888 C177.205308,4.00974888 184.938832,4 189.142857,4 Z"
                id="suzuka" stroke="currentColor" stroke-width="2"></path>
            </g>
          </svg>
          <h3 class="text-xl font-bold mb-2">Certified Pre-Owned</h3>
          <p class="text-gray-300">Rigorous 150-point inspection</p>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <div class="text-center p-6">
          <!-- <i class="pi pi-star text-5xl mb-4"></i> -->
          <i class="fa-solid fa-star fa-spin text-5xl"
            style="--fa-animation-duration: 3s; --fa-animation-iteration-count: 5;--fa-animation-timing: ease-in-out;"></i>

          <h3 class="text-xl font-bold mb-2">Premium Selection</h3>
          <p class="text-gray-300">Only the finest vehicles</p>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <div class="text-center p-6">
          <!-- <i class="pi pi-wallet text-5xl mb-4"></i> -->
          <i class="fa-solid fa-money-check-dollar  text-5xl fa-flip" style="--fa-animation-duration: 3s;"></i>

          <h3 class="text-xl font-bold mb-2">Flexible Finance</h3>
          <p class="text-gray-300">Tailored payment plans</p>
        </div>
      </div>
    </div>
  </div>
  <!-- Testimonials -->
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-6">What Our Customers Say</h2>
      <Carousel :value="testimonials" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" circular
        :autoplayInterval="3000">
        <template #item="slotProps">
          <div class="p-6 border-round">
            <div class="text-xl italic mb-4">"{{ slotProps.data.quote }}"</div>
            <div class="flex align-items-center">
              <div>
                <div class="font-bold">{{ slotProps.data.name }}</div>
                <div class="text-gray-400">{{ slotProps.data.role }}</div>
              </div>
            </div>
          </div>
        </template>
      </Carousel>
    </div>
  </div>
</template>

<style scoped>


@media (max-width: 768px) {
  .dot-button {
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  border: 2px solid white;
  background-color: transparent;
  transition: all 0.3s ease;
  left:10rem;
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
  width: 40px;
  height: 40px;
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
