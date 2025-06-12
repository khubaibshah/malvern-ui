<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
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
    itemImageSrc: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    alt: 'Audi Q8 in showroom'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    alt: 'Audi RS5 sportback'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    alt: 'Audi e-tron electric SUV'
  },
  {
    itemImageSrc: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
    thumbnailImageSrc: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    alt: 'Audi A5 coupe'
  },

]);

const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3
  },
  {
    breakpoint: '768px',
    numVisible: 2
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
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
])



onMounted(async () => {

  animate(svg.createDrawable('.line'), {
    draw: ['0 0', '0 1', '1 1'],
    ease: 'inOutQuad',
    duration: 2000,
    delay: stagger(100),
    loop: true
  });


  // Animate the transforms properties of .car the motion path values
  const carAnimation = animate('.car', {
    ease: 'linear',
    duration: 5000,
    loop: true,
    ...svg.createMotionPath('path')
  });

  // Line drawing animation following the motion path values
  // For demo aesthetic only
  animate(svg.createDrawable('path'), {
    draw: '0 1',
    ease: 'linear',
    duration: 5000,
    loop: true
  });
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/scs/get-all-vehicles`)
    if (response.status === 200) {
      vehicles.value = response.data.cars || []

      // Get the vehicles marked as featured

      featuredVehicles.value = vehicles.value.filter(v => v.featured === 1)

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
  <PrimeGalleria :value="images" :numVisible="5" :circular="true" :autoPlay="true" :showThumbnails="false"
    :showItemNavigators="true" :showItemNavigatorsOnHover="true">
    <template #item="slotProps">
      <div class="relative w-full">
        <!-- Background Image -->
        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" class="w-full object-cover" style="width: 100%;    object-fit: cover;
    height: 38rem; display: block;" />

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-start" style="bottom: 12rem;
    left: 6rem;">
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

              <PrimeButton severity="contrast" label="Find & Buy" class="p-button-lg w-full sm:w-auto"
                @click="router.push({ name: 'car-search' })" />
            </div>
          </div>
        </div>
      </div>
    </template>



  </PrimeGalleria>


  <div class=" text-center  my-4 animation-duration-2000 animation-ease-in-out">
    <h2 class="text-3xl font-bold mb-2 text-gray-700" style="margin-top: 4rem;">Our Featured Models</h2>
    <p class="text-gray-500" style="padding-left: 10px;
    padding-right: 10px;">Experience the pinnacle of automotive excellence with our curated selection of premium
      vehicles

    </p>
  </div>


  <div class="surface-section px-3 py-5 md:px-6 lg:px-8" v-if="featuredVehicles.length > 0">


    <div class="grid mx-auto ">

      <div v-for="(car, index) in featuredVehicles" :key="car.id"
        :class="` col-12 sm:col-6 lg:col-4 px-3 mb-5  md:col-${12 / featuredVehicles.length}`">
        <PrimeCard class=" border-round-lg overflow-hidden hover-card">
          <template #header>
            <img :src="car.images?.[0] || '/src/assets/img/default.jpg'" :alt="car.make + ' ' + car.model"
              class="w-full h-40 object-cover border-top-round-lg" />
          </template>


          <template #title>
            <h3 class="text-sm font-bold text-800 mb-1">{{ car.make }} {{ car.model }}</h3>
          </template>

          <!-- <template #subtitle>
            <div class="text-sm text-gray-500 mb-1">
              {{ car.variant || 'No Variant' }} • {{ car.year || 'N/A' }}
            </div>
          </template> -->

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

  <div class="tile-bg">
    <div class="surface-section px-5 py-5 md:px-6 lg:px-8 tile-bg">

      <div class="grid ">
        <div class="col-12 md:col-6 lg:col-6 ">
          <PrimeCard>
            <template #title>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">Premium Ownership Experience</h2>

            </template>
            <template #content>
              <p class="text-gray-600 mb-6">
                At LUXURY CARS, we go beyond simply selling vehicles. We offer a complete premium
                ownership experience with personalized services designed to exceed your expectations.
              </p>
              <div>

                <ul class="space-y-7">
                  <li class="flex items-start">
                    <span class="text-green-600 mr-3 mt-1">
                      <i class="pi pi-check-circle text-xl"></i>
                    </span>
                    <span>Personalized vehicle delivery service</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-600 mr-3 mt-1">
                      <i class="pi pi-check-circle text-xl"></i>
                    </span>
                    <span>24/7 Roadside Assistance</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-600 mr-3 mt-1">
                      <i class="pi pi-check-circle text-xl"></i>
                    </span>
                    <span>Complimentary maintenance for 3 years</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-600 mr-3 mt-1">
                      <i class="pi pi-check-circle text-xl"></i>
                    </span>
                    <span>Exclusive owner events and experiences</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-600 mr-3 mt-1">
                      <i class="pi pi-check-circle text-xl"></i>
                    </span>
                    <span>Dedicated concierge service</span>
                  </li>
                </ul>
              </div>
            </template>
          </PrimeCard>

        </div>
        <div class="col-12 md:col-6 lg:col-6">

          <PrimeCard>
            <template #title>
              <h3 class="text-xl font-bold">Schedule a Test Drive</h3>
            </template>
            <template #content>
              <!-- <p class="m-0"> -->
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

                <Dropdown :options="modelOptions" placeholder="Select Model" class="w-full" />
              </div>
              <div class="mb-4">
                <PrimeButton label="Request Appointment" class="w-full bg-black text-white font-semibold" />
              </div>
              <!-- </p> -->
            </template>
          </PrimeCard>
        </div>
      </div>
    </div>

  </div>





  <!-- Featured Vehicle (White Background) -->
  <!-- Featured Vehicles Section (White Background) -->



  <!-- <div v-animateonscroll="{ enterClass: 'fadein', leaveClass: 'fadeout' }"
    class="flex justify-content-center my-4 animation-duration-2000 animation-ease-in-out">
    <hr class="custom-hr" />
  </div> -->

  <!-- Model Explorer (White Background) -->

  <!-- <div class="text-center mb-6 animation-duration-2000 animation-ease-in-out"
    v-animateonscroll="{ enterClass: 'fadein', leaveClass: 'fadeout' }">

    <h2 class="text-4xl font-bold mb-2">Explore Our Range</h2>
    <p class="text-gray-600">Discover our premium selection of vehicles</p>
    <div class="flex justify-content-evenly flex-wrap">

      <PrimeCarousel :value="vehicles" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions">
        <template #item="slotProps">
          <div class="vehicle-card">
            <img :src="slotProps.data.images?.[0] || '/src/assets/img/default.jpg'"
              :alt="slotProps.data.make + ' ' + slotProps.data.model" class="vehicle-image" />
            <div class="vehicle-info">
              <h3 class="text-base font-semibold">{{ slotProps.data.make }} {{ slotProps.data.model }}</h3>
              <p class="text-green-600 font-bold text-sm">£{{ parseFloat(slotProps.data.price).toLocaleString() }}</p>
              <RouterLink :to="{ name: 'vehicle-details', params: { id: slotProps.data.id } }">
                <PrimeButton label="View" class="custom-button right-btn text-sm w-full" />
              </RouterLink>
            </div>
          </div>
        </template>
      </PrimeCarousel>
    </div>

  </div> -->



  <!-- Value Props (Black Background) -->
  <div class="tile-bg py-8 px-4 text-white">

    <div class="grid">

      <div class="col-12 md:col-6 lg:col-4">
        <div class="text-center p-6">
          <!-- <i class="pi pi-shield text-5xl mb-4"></i> -->
          <svg viewBox="0 0 304 112" style="height: 42px;">
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



  <!-- Testimonials (Black Background) -->
  <div class="py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-6">What Our Customers Say</h2>
      <Carousel :value="testimonials" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" circular
        :autoplayInterval="3000" class="custom-carousel">
        <template #item="slotProps">
          <div class="p-6 border-round">
            <div class="text-xl italic mb-4">"{{ slotProps.data.quote }}"</div>
            <div class="flex align-items-center">
              <!-- <i class="pi pi-user w-3rem h-3rem border-circle mr-3"></i> -->

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
</template>

<style scoped>
.p-galleria .p-galleria-item-nav {
  z-index: 1;
}

.text-right-btn {
  justify-content: flex-end !important;
  /* Align content (text) to the right */
  text-align: right !important;
  /* Just in case */
}

.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 40px rgba(0, 0, 0, 0.15);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay,
.hero-background {
  pointer-events: none;
}


.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
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
  margin: 0 0.5rem;
  /* ⬅️ Add horizontal spacing */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
  /* background-image: url('/src/assets/img/lamb4.jpg'); */
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5rem !important;
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

.p-galleria-item-wrapper .hero-background {
  opacity: 1;
}

/* Hero Galleria Styles */
.hero-galleria {
  position: relative;
  width: 100%;
  height: 77vh;
  margin-bottom: 1rem;
}

.hero-slide {
  position: relative;
  width: 100%;
  height: 88vh;
  overflow: hidden;
  margin-bottom: 2rem !important;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.overlay {
  position: absolute;
  inset: 0;
  /* background-color: rgba(0, 0, 0, 0.45); */
  z-index: 1;
}

.slide-content {
  position: absolute;
  z-index: 2;
  color: white;
  max-width: 600px;
  left: 2%;
  top: 67%;
  transform: translateY(-50%);
  text-align: left;
  padding: 0 1rem;
}

.main-heading {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
}

.subheading {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: white;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}



/* Navigation arrows */
:deep(.p-galleria .p-galleria-item-nav) {
  z-index: 2;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  margin: 0 1rem;
}

:deep(.p-galleria .p-galleria-item-nav:hover) {
  background: rgba(0, 0, 0, 0.8);
}

/* Responsive adjustments */
@media (max-width: 768px) {

  .hero-galleria,
  .hero-slide {
    height: 58vh;
  }

  .main-heading {
    font-size: 2rem;
  }

  .subheading {
    font-size: 1.2rem;
  }

  .slide-content {
    padding: 0 1rem;
  }

  :deep(.p-galleria .p-galleria-item-nav) {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.button-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .slide-content {
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    top: 50%;
  }
}
</style>