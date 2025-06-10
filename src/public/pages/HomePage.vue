<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import { useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { animate, svg, stagger } from 'animejs';

const router = useRouter();
const toast = useToast();

const vehicles = ref([])
const vehicle_model = ref()


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
  // {
  //   itemImageSrc: 'https://images.unsplash.com/photo-1551836026-d1b4d0e33037?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
  //   thumbnailImageSrc: 'https://images.unsplash.com/photo-1551836026-d1b4d0e33037?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
  //   alt: 'Audi Q7 luxury SUV'
  // }
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


const featuredVehicle = ref()

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
    <!-- Hero Section with Galleria -->
    <PrimeGalleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="1" :circular="true"
      :autoPlay="true" :transitionInterval="5000" :showItemNavigatorsOnHover="false" :showThumbnails="false"
      containerClass="hero-galleria" :transitionOptions="{ name: 'fade-slide', css: true }">

      <template #item="slotProps">
        <div class="hero-slide">
          <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" class="hero-background" />
          <div class="overlay"></div>
          <div class="slide-content">
            <div class="square car motion-path-car" style="transform: translateX(189px) translateY(4px);"></div>
            <h1 class="main-heading">STANLEY CAR SALES</h1>
            <p class="subheading">Premium vehicles at competitive prices</p>
            <div class="button-row">
              <PrimeButton label="Discover more" class="custom-button left-btn" />
              <PrimeButton label="Find & Buy" class="custom-button right-btn"
                @click="router.push({ name: 'car-search' })" />
            </div>
          </div>
        </div>
      </template>
    </PrimeGalleria>
  </div>


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

  <div v-animateonscroll="{ enterClass: 'fadein', leaveClass: 'fadeout' }"
    class="flex justify-content-center my-4 animation-duration-2000 animation-ease-in-out">
    <hr class="custom-hr" />
  </div>

  <!-- Model Explorer (White Background) -->

  <div class="text-center mb-6 animation-duration-2000 animation-ease-in-out"
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

  </div>



  <!-- Value Props (Black Background) -->
  <div class="tile-bg py-8 px-4 text-white">

    <div class="grid">

      <div class="col-12 md:col-6 lg:col-4">
        <div class="text-center p-6">
          <i class="pi pi-shield text-5xl mb-4"></i>
          <svg viewBox="0 0 304 112">
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
      <PrimeCarousel :value="testimonials" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions"
        circular :autoplayInterval="3000" class="custom-carousel">
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
      </PrimeCarousel>
    </div>
  </div>
</template>

<style scoped>
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

:deep(.p-galleria .p-galleria-item-nav) {
  z-index: 10 !important;
}

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
  background: rgba(0, 0, 0, 0.45);
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
  height: 77vh;
  overflow: hidden;
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
  background-color: rgba(0, 0, 0, 0.45);
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
    height: 60vh;
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