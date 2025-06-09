<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from "vue-router";
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import Dropdown from 'primevue/dropdown'
import Carousel from 'primevue/carousel'
const router = useRouter();


const toast = useToast()
const vehicles = ref([])
const layout = ref('grid')
const vehicle_make = ref()
const vehicle_model = ref()
const vehicle_variant = ref()
const priceRange = ref([20000, 60000])
const maxMileage = ref(50000)
const selectedFuel = ref('All')

const makeOptions = ref([])
const modelOptions = ref([])
const variantOptions = ref([])
const selectedTag = ref('All Models')
const filterTags = ['All Models', 'Fully Electric', 'Plug-In Hybrid', 'Sportback', 'Saloon', 'Sport', 'RS', 'Avant', '✓ SUV']
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
const audiModels = [
  { name: 'Q2', image: '/src/assets/img/q2.png', count: 2 },
  { name: 'Q3', image: '/src/assets/img/q3.png', count: 2 },
  { name: 'Q4 e-tron', image: '/src/assets/img/q4.png', count: 2 },
  { name: 'Q5', image: '/src/assets/img/q5.png', count: 4 },
  { name: 'Q6 e-tron', image: '/src/assets/img/q6.png', count: 4 },
  { name: 'Q7', image: '/src/assets/img/q7.png', count: 3 },
  { name: 'Q8', image: '/src/assets/img/q8.png', count: 5 }
]

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
])

const mileageOptions = ref([
  { label: 'Under 10k miles', value: 10000 },
  { label: 'Under 20k miles', value: 20000 },
  { label: 'Under 50k miles', value: 50000 },
  { label: 'Any mileage', value: 1000000 }
])

const fuelTypes = ['All', 'Petrol', 'Diesel', 'Hybrid', 'Electric']

const featuredVehicle = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/get-all-vehicles`)
    if (response.status === 200) {
      vehicles.value = response.data.cars || []

      // Get the first vehicle marked as featured
      featuredVehicle.value = vehicles.value.find(v => v.featured === 1)

      // Populate filter dropdowns
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
  <!-- Hero Section (Black Background) -->
  <div class="hero-container">
    <video autoplay muted loop playsinline class="hero-video">
      <source src="/src/assets/img/hero.mp4" type="video/mp4" />
    </video>
    <div class="overlay"></div>
    <div class="content">
      <h1 class="main-heading">STANLEY CAR SALES</h1>
      <div class="button-row">
        <PrimeButton label="Discover more" class="custom-button left-btn" />
         <!-- <a v-ripple @click="router.push({ name: 'car-search' })" -->
        <PrimeButton label="Find & Buy" class="custom-button right-btn" @click="router.push({ name: 'car-search' })" />
      </div>
    </div>
  </div>
  <!-- Featured Vehicle (White Background) -->
  <!-- Featured Vehicle (White Background) -->
  <div v-if="featuredVehicle" class="surface-0 py-4 px-4 md:py-6 md:px-6 lg:py-7 lg:px-7">
    <div class="flex flex-column md:flex-row max-w-6xl mx-auto">
      <div class="w-full md:w-6 p-0 md:pr-4 mb-4 md:mb-0">
        <img :src="featuredVehicle.images?.[0] || '/src/assets/img/default.jpg'"
          :alt="featuredVehicle.make + ' ' + featuredVehicle.model" class="w-full border-round" />
      </div>
      <div class="w-full md:w-6 flex flex-column justify-center p-4">
        <span class="bg-y-500 text-black font-bold py-1 mb-3 inline-block w-auto text-5xl">FEATURED</span>
        <h2 class="text-3xl font-bold mb-3">{{ featuredVehicle.make }} {{ featuredVehicle.model }}</h2>
        <p class="text-gray-600 mb-2">{{ featuredVehicle.description }}</p>
        <div class="text-xl font-bold text-green-600 mb-4">£{{ parseFloat(featuredVehicle.price).toLocaleString() }}
        </div>
        <RouterLink :to="{ name: 'vehicle-details', params: { id: featuredVehicle.id } }" class="no-underline w-full">
          <PrimeButton label="View" class="custom-button right-btn w-full" />
        </RouterLink>

      </div>
    </div>
  </div>
<div
  v-animateonscroll="{ enterClass: 'fadein', leaveClass: 'fadeout' }"
  class="flex justify-content-center my-4 animation-duration-2000 animation-ease-in-out"
>
  <hr class="custom-hr" />
</div>

  <!-- Model Explorer (White Background) -->
  <div class="text-center mb-6 ">
    <h2 class="text-4xl font-bold mb-2">Explore Our Range</h2>
    <p class="text-gray-600">Discover our premium selection of vehicles</p>
  </div>

  <div class="flex justify-content-evenly flex-wrap">

   <PrimeCarousel :value="vehicles" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions">
  <template #item="slotProps">
    <div class="vehicle-card">
      <img
        :src="slotProps.data.images?.[0] || '/src/assets/img/default.jpg'"
        :alt="slotProps.data.make + ' ' + slotProps.data.model"
        class="vehicle-image"
      />
      <div class="vehicle-info">
        <h3 class="text-base font-semibold">{{ slotProps.data.make }} {{ slotProps.data.model }}</h3>
        <p class="text-green-600 font-bold text-sm">£{{ parseFloat(slotProps.data.price).toLocaleString() }}</p>
        <RouterLink :to="{ name: 'vehicle-details', params: { id: slotProps.data.id } }">
          <PrimeButton label="View" class="custom-button right-btn text-sm w-full"/>
        </RouterLink>
      </div>
    </div>
  </template>
</PrimeCarousel>


    <!-- <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-primary font-bold border-round m-2">2</div> -->
    <!-- <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-primary font-bold border-round m-2">3</div> -->
  </div>

  <!-- <div class="surface-0 py-6 px-4">
    <div class="text-center mb-6">
      <h2 class="text-4xl font-bold mb-2">Explore Our Range</h2>
      <p class="text-gray-600">Discover our premium selection of vehicles</p>
    </div>
    
    <div class="grid md:grid-cols-4 sm:grid-cols-2 gap-4 px-4">
      <div v-for="model in audiModels" :key="model.name" 
           class="p-4 border-1 surface-border border-round cursor-pointer hover:shadow-2 transition-all"
           @click="filterByModel(model.name)">
        <img :src="model.image" :alt="model.name" class="w-full h-auto mb-3">
        <h3 class="text-xl font-semibold mb-1">{{ model.name }}</h3>
        <span class="text-gray-600">{{ model.count }} available</span>
      </div>
    </div>
  </div> -->

  <!-- Value Props (Black Background) -->
  <div class="tile-bg py-8 px-4 text-white">

    <div class="grid">
     
      <div class="col-12 md:col-6 lg:col-4">
        <div class="text-center p-6">
          <i class="pi pi-shield text-5xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Certified Pre-Owned</h3>
          <p class="text-gray-300">Rigorous 150-point inspection</p>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <div class="text-center p-6">
          <i class="pi pi-star text-5xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Premium Selection</h3>
          <p class="text-gray-300">Only the finest vehicles</p>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <div class="text-center p-6">
          <i class="pi pi-wallet text-5xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Flexible Finance</h3>
          <p class="text-gray-300">Tailored payment plans</p>
        </div>
      </div>
    </div>
  </div>



  <!-- Testimonials (Black Background) -->
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-6">What Our Customers Say</h2>
      <Carousel :value="testimonials" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions"
        class="custom-carousel">
        <template #item="slotProps">
          <div class="p-6 border-round">
            <div class="text-xl italic mb-4">"{{ slotProps.data.quote }}"</div>
            <div class="flex align-items-center">
              <i class="pi pi-user w-3rem h-3rem border-circle mr-3"></i>

              <!-- <img :src="slotProps.data.avatar" class="w-3rem h-3rem border-circle mr-3"> -->
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
  <!-- Footer Section (Black Background) -->
  <!-- Footer Section (Black Background) -->


</template>

<style scoped>
.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1;
}
.content {
  position: relative;
  z-index: 2;
}
.custom-hr {
  width: 90%;
  height: 1px;
  background-color: rgb(54, 54, 54);
  border: none;
  border-radius: 2px;
}

.vehicle-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem;
  max-width: 300px;
  margin: 0 0.5rem; /* ⬅️ Add horizontal spacing */
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  background: white;
  flex-shrink: 0;
}

.vehicle-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
}

.vehicle-info {
  margin-top: 0.75rem;
  text-align: center;
}
.tile-bg {
  background-color: black;
}

footer a {
  transition: color 0.2s ease;
}

.p-inputtext {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.p-button.p-button-warning {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  /* background-colo !important; */
  /* border-color: #d4af37 !important; */
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr !important;
  }

  .col-span-2 {
    grid-column: span 1 !important;
  }
}

.hero-container {
  position: relative;
  width: 100%;
  height: 77vh;
  background-image: url('/src/assets/img/lamb4.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
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
  margin-right: 52rem;
  margin-top: 17rem;
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

/* Custom Carousel */
:deep(.custom-carousel .p-carousel-indicators) {
  display: none;
}

:deep(.custom-carousel .p-carousel-prev),
:deep(.custom-carousel .p-carousel-next) {
  color: rgb(0, 0, 0);
  background: rgb(255, 255, 255);
}

:deep(.custom-carousel .p-carousel-prev:hover),
:deep(.custom-carousel .p-carousel-next:hover) {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-container {
    background-image: none;
    background-color: black;
    height: 60vh;
  }

  .content {
    margin-right: 0;
    text-align: center;
    margin-top: 0rem;
  }

  .main-heading {
    font-size: 2rem;
  }

  .button-row {
    justify-content: center;
  }

  .featured-vehicle {
    flex-direction: column;
  }

  .featured-vehicle>div {
    width: 100% !important;
  }
}
</style>