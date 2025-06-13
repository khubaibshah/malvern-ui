<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { animate, svg, stagger } from 'animejs';
import Carousel from 'primevue/carousel';

const router = useRouter();
const toast = useToast();

const vehicles = ref([])
const vehicle_model = ref()

const featuredVehicles = ref([]);
const makeOptions = ref()
const modelOptions = ref()
const variantOptions = ref()
const images = ref([
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=60',
thumbnailImageSrc: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=30',

    alt: 'Audi Q8 in showroom'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=60',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=200&q=30',
    alt: 'Audi RS5 sportback'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=60',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=200&q=30',
    alt: 'Audi e-tron electric SUV'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=60',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=200&q=30',
    alt: 'Audi A5 coupe'
  }
]);

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

onMounted(async () => {
  animate(svg.createDrawable('.line'), {
    draw: ['0 0', '0 1', '1 1'],
    ease: 'inOutQuad',
    duration: 2000,
    delay: stagger(100),
    loop: true
  });

  animate('.car', {
    ease: 'linear',
    duration: 5000,
    loop: true,
    ...svg.createMotionPath('path')
  });

  animate(svg.createDrawable('path'), {
    draw: '0 1',
    ease: 'linear',
    duration: 5000,
    loop: true
  });

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/get-all-vehicles`);
    if (response.status === 200) {
      vehicles.value = response.data.cars || []
      featuredVehicles.value = vehicles.value.filter(v => v.featured === 1)

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

const filterByModel = (modelName: string) => {
  vehicle_model.value = modelName
}
</script>

<template>
  <!-- Hero Section -->
  <PrimeGalleria :value="images" :numVisible="5" :circular="true" :autoPlay="true" :showThumbnails="false"
    :showItemNavigators="true" :showItemNavigatorsOnHover="true">
    <template #item="slotProps">
      <div class="relative w-full">
        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt"
             class="w-full object-cover"
             style="width: 100%; object-fit: cover; height: 52rem; display: block;" />
        <div class="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-start hero-galleria"
             >
          <div class="text-white px-6 md:px-16 max-w-xl">
            <h1 class="text-5xl font-extrabold leading-tight mb-4" style="font-family: 'Inter', sans-serif;">
              STANLEY<br />CAR SALES
            </h1>
            <p class="text-lg text-white mb-8" style="font-family: 'Inter', sans-serif;">
              Premium vehicles at competitive prices
            </p>
            <div class="flex flex-col gap-4">
              <PrimeButton severity="secondary" label="Discover More"
                class="w-full rounded-full bg-white text-black font-medium  border-none" />
              <PrimeButton severity="contrast" label="Find & Buy"
                class="w-full "
                @click="router.push({ name: 'car-search' })" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </PrimeGalleria>

  <!-- Featured Vehicles -->
  <div class="text-center my-4">
    <h2 class="text-3xl font-bold mb-2 text-gray-700" style="margin-top: 4rem;">Our Featured Models</h2>
    <p class="text-gray-500" style="padding: 0 10px;">
      Experience the pinnacle of automotive excellence with our curated selection of premium vehicles
    </p>
  </div>

  <div class="surface-section px-3  md:px-6 lg:px-8" v-if="featuredVehicles.length > 0">
    <div class="grid mx-auto">
      <div v-for="(car, index) in featuredVehicles" :key="car.id"
        :class="`col-12 sm:col-6 lg:col-4 px-3 mb-5 md:col-${12 / featuredVehicles.length}`">
        <PrimeCard class="border-round-lg overflow-hidden hover-card">
          <template #header>
            <img :src="car.images?.[0] || '/src/assets/img/default.jpg'"
              :alt="car.make + ' ' + car.model"
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

  <!-- Value Props (Black Background) -->
  <div class="tile-bg">
    <div class="surface-section px-5 md:px-6 lg:px-8 tile-bg">
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-6">
          <PrimeCard>
            <template #title>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">Premium Ownership Experience</h2>
            </template>
            <template #content>
              <p class="text-gray-600 mb-6">
                At LUXURY CARS, we go beyond simply selling vehicles. We offer a complete premium
                ownership experience with personalized services designed to exceed your expectations.
              </p>
              <ul class="space-y-7">
                <li class="flex items-start" v-for="(item, i) in [
                  'Personalized vehicle delivery service',
                  '24/7 Roadside Assistance',
                  'Complimentary maintenance for 3 years',
                  'Exclusive owner events and experiences',
                  'Dedicated concierge service']" :key="i">
                  <span class="text-green-600 mr-3 mt-1">
                    <i class="pi pi-check-circle text-xl"></i>
                  </span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </template>
          </PrimeCard>
        </div>
        <div class="col-12 md:col-6 lg:col-6">
          <PrimeCard>
            <template #title>
              <h3 class="text-xl font-bold">Schedule a Test Drive</h3>
            </template>
            <template #content>
              <div class="mb-4"><InputText placeholder="Your Name" class="w-full" /></div>
              <div class="mb-4"><InputText placeholder="Email Address" class="w-full" /></div>
              <div class="mb-4"><InputText placeholder="Phone Number" class="w-full" /></div>
              <div class="mb-4"><Dropdown :options="modelOptions" placeholder="Select Model" class="w-full" /></div>
              <div class="mb-4">
                <PrimeButton label="Request Appointment" class="w-full bg-black text-white font-semibold" />
              </div>
            </template>
          </PrimeCard>
        </div>
      </div>
    </div>
  </div>

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

.tile-bg {
  background-color: black;
}

.hero-galleria {
  position: absolute;
  inset: 0;
  z-index: 1; /* lower than PrimeVue's nav buttons */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  bottom: 2rem;
  left: 6rem;
}

::v-deep(.p-galleria-item-next),
::v-deep(.p-galleria-item-prev) {
  z-index: 5;
}
::v-deep(.p-galleria-item-next),
::v-deep(.p-galleria-item-prev) {
  pointer-events: auto;
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-galleria {
    left: 0 !important;
    justify-content: center; /* center text if needed */
    text-align: center; /* optional for headline/p */
  }
}


</style>
