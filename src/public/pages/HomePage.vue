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
    itemImageSrc: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?...',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?...',
    alt: 'Audi Q8 in showroom'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?...',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?...',
    alt: 'Audi RS5 sportback'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?...',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?...',
    alt: 'Audi e-tron electric SUV'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?...',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?...',
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
             style="width: 100%; object-fit: cover; height: 38rem; display: block;" />
        <div class="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-start hero-galleria"
             >
          <div class="text-white px-6 md:px-16 max-w-xl">
            <h1 class="text-5xl font-extrabold leading-tight mb-4" style="font-family: 'Inter', sans-serif;">
              STANLEY<br />CAR SALES
            </h1>
            <p class="text-lg text-white mb-8" style="font-family: 'Inter', sans-serif;">
              Premium vehicles at competitive prices
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <PrimeButton severity="secondary" label="Discover More"
                class="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black font-medium text-base border-none" />
              <PrimeButton severity="contrast" label="Find & Buy"
                class="p-button-lg w-full sm:w-auto"
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

  <div class="surface-section px-3 py-5 md:px-6 lg:px-8" v-if="featuredVehicles.length > 0">
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
    <div class="surface-section px-5 py-5 md:px-6 lg:px-8 tile-bg">
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
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  bottom: 2rem;
  left: 6rem; /* <-- Move this from inline style */
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
