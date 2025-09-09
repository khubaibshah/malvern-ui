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

  <!-- ================= HERO ================= -->
  <section class="hero-section overflow-hidden">
    <!-- Background slider (uses your currentIndex interval) -->
    <div class="hero-slider">
      <div class="hero-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(image, i) in images" :key="i" class="hero-slide">
          <img :src="image.itemImageSrc" :alt="image.alt" class="hero-img" />
        </div>
      </div>
      <div class="hero-gradient"></div>
    </div>

    <!-- Glass CTA card -->
    <div class="overlay-content glass-card text-white z-10">
      <h1 class="hero-title">{{ slideText.title }}</h1>
      <p class="hero-sub">{{ slideText.subtitle }}</p>

      <div class="cta-row">
        <PrimeButton label="Browse Vehicles" class="cta-primary" severity="contrast"
          @click="$router.push({ name: 'car-search' })"/>
        <a href="#test-drive" class="cta-secondary">Schedule a Test Drive</a>
      </div>

      <!-- Dots -->
      <div class="dots mt-4">
        <button v-for="(image, index) in images" :key="index" @click="currentIndex = index"
          class="dot-button" :class="{ 'dot-active': currentIndex === index }" aria-label="Slide"/>
      </div>
    </div>
  </section>

  <!-- ================= VALUE / TRUST STRIP ================= -->
  <section class="usp-strip px-3 md:px-6 lg:px-8">
    <div class="grid grid-nogutter text-white">
      <div class="col-12 md:col-3 usp-item">
        <div class="usp-icon">✓</div>
        <div class="usp-text"><strong>HPI Checked</strong><span>Every car fully inspected</span></div>
      </div>
      <div class="col-12 md:col-3 usp-item">
        <div class="usp-icon">🚚</div>
        <div class="usp-text"><strong>Home Delivery</strong><span>Nationwide options available</span></div>
      </div>
      <div class="col-12 md:col-3 usp-item">
        <div class="usp-icon">💳</div>
        <div class="usp-text"><strong>Flexible Finance</strong><span>Competitive monthly plans</span></div>
      </div>
      <div class="col-12 md:col-3 usp-item">
        <div class="usp-icon">🛡️</div>
        <div class="usp-text"><strong>Warranty</strong><span>Peace of mind as standard</span></div>
      </div>
    </div>
  </section>

  <!-- ================= POPULAR MODELS ================= -->
  <section class="px-3 md:px-6 lg:px-8 popular-models">
    <h2 class="section-title">Popular Models</h2>
    <div class="chips">
      <button v-for="o in (modelOptions || []).slice(0, 10)" :key="o.value" class="chip"
        @click="filterByModel(o.value); $router.push({ name: 'car-search', query: { model: o.value } })">{{ o.label }}</button>
    </div>
  </section>

  <!-- ================= FEATURED VEHICLES ================= -->
  <section class="px-3 md:px-6 lg:px-8">
    <div class="text-center mb-6">
      <h2 class="section-title">Our Featured Models</h2>
      <p class="muted">Experience the pinnacle of automotive excellence with our curated selection of premium vehicles</p>
    </div>

    <div class="grid mx-auto" v-if="loading">
      <div class="col-12 md:col-6 lg:col-8">
        <PrimeSkeleton width="100%" height="350px" class="mb-3 border-round mx-auto max-w-[640px]" />
        <div class="flex gap-3 overflow-x-auto max-w-[640px] mx-auto">
          <PrimeSkeleton v-for="n in 4" :key="n" width="7rem" height="5rem" class="border-round" />
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-4">
        <PrimeCard class="w-full"><template #title><PrimeSkeleton width="70%" class="mb-2"/></template>
          <template #content>
            <PrimeSkeleton width="50%" class="mb-2"/><PrimeSkeleton width="50%" class="mb-2"/>
            <PrimeSkeleton width="50%" class="mb-2"/><PrimeSkeleton height="4rem" class="mt-4"/>
            <PrimeSkeleton width="100%" height="2.5rem" class="mt-3"/>
          </template>
        </PrimeCard>
      </div>
    </div>

    <div class="grid mx-auto" v-else-if="featuredVehicles && featuredVehicles.length" style="justify-content:center;">
      <div v-for="car in featuredVehicles" :key="car.id" class="col-12 sm:col-6 lg:col-4 mb-5">
        <PrimeCard class="vehicle-card">
          <template #header>
            <div class="v-media">
              <img :src="mainImg(car)" :alt="car.make + ' ' + car.model" class="media-img" :class="{ 'sold-dim': isSold(car) }" />
              <span class="price-chip">£{{ parseFloat(car.price).toLocaleString() }}</span>
              <span v-if="isSold(car)" class="sold-ribbon">SOLD</span>
            </div>
          </template>
          <template #title>
            <h3 class="v-title">{{ car.make }} {{ car.model }}</h3>
          </template>
          <template #content>
            <div class="v-meta">{{ car.variant || 'No Variant' }} • {{ car.year || 'N/A' }}</div>
          </template>
          <template #footer>
            <RouterLink :to="{ name: 'vehicle-details', params: { id: car.id } }" class="w-full no-underline">
              <PrimeButton label="View Details" class="w-full" text />
            </RouterLink>
          </template>
        </PrimeCard>
      </div>
    </div>
  </section>

  <!-- ================= TEST DRIVE ================= -->
  <section id="test-drive" class="px-3 md:px-6 lg:px-8 testdrive">
    <div class="grid">
      <div class="col-12 lg:col-6">
        <PrimeCard class="td-card">
          <template #title>
            <h3 class="td-title">Schedule a Test Drive</h3>
            <p class="muted">Fill out the form below to request a test drive appointment for your selected vehicle.</p>
          </template>
          <template #content>
            <div class="mb-3"><InputText placeholder="Your Name" class="w-full" v-model="form.name"/></div>
            <div class="mb-3"><InputText placeholder="Email Address" class="w-full" v-model="form.email"/></div>
            <div class="mb-3"><InputText placeholder="Phone Number" class="w-full" v-model="form.phone"/></div>
            <p class="text-sm text-gray-500" v-if="form.vehicle_id">Selected: {{ vehicleOptions.find(opt => opt.value === form.vehicle_id)?.label || 'Unknown Vehicle' }}</p>
            <PrimeButton label="Request Appointment" class="w-full mt-3" severity="contrast" :loading="submitting" @click="submitTestDriveRequest()"/>
          </template>
        </PrimeCard>
      </div>

      <div class="col-12 lg:col-6">
        <div class="flex overflow-x-auto gap-4 pb-2 pick-strip">
          <div v-for="car in vehicles" :key="car.id" class="flex-shrink-0 pick-item">
            <PrimeCard :class="{ 'ring-2 ring-green-500': form.vehicle_id === car.id, 'hover-card': true }" style="width:100%;overflow:hidden;">
              <template #header>
                <div class="relative">
                  <img :src="mainImg(car)" :alt="car.make + ' ' + car.model" class="w-full h-40 object-cover border-top-round-lg" :class="{ 'sold-dim': isSold(car) }" />
                  <div v-if="isSold(car)" class="sold-ribbon">SOLD</div>
                </div>
              </template>
              <template #title>{{ car.make }} {{ car.model }}</template>
              <template #subtitle>{{ car.variant || 'No Variant' }}</template>
              <template #footer>
                <PrimeButton label="Select This Car" size="small" class="w-full" :disabled="isSold(car)"
                  :outlined="form.vehicle_id !== car.id"
                  :severity="form.vehicle_id === car.id ? 'success' : 'secondary'"
                  @click="form.vehicle_id = car.id" />
              </template>
            </PrimeCard>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= TESTIMONIALS ================= -->
  <section class="px-3 md:px-6 lg:px-8 testimonials">
    <h2 class="section-title text-center">What Drivers Say</h2>
    <div class="grid">
      <div v-for="t in testimonials" :key="t.name" class="col-12 md:col-6">
        <PrimeCard class="testi-card">
          <template #content>
            <p class="quote">“{{ t.quote }}”</p>
            <div class="byline">— {{ t.name }}, {{ t.role }}</div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ================== THEME TOKENS ================== */
:root {
  --bg: #0b0f14;
  --ink: #0c1322;
  --ink-2: #111827;
  --primary: #0ea5e9; /* sky-500 */
  --glass: rgba(14, 23, 35, 0.55);
}

/* ================== HERO ================== */
.hero-section { position: relative; height: clamp(72vh, 92vh, 92vh); }
.hero-slider { position: absolute; inset: 0; overflow: hidden; z-index: 0; }
.hero-track { display: flex; height: 100%; transition: transform 800ms ease-in-out; }
.hero-slide { flex: 0 0 100%; height: 100%; position: relative; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.hero-gradient { position: absolute; inset: 0; background: radial-gradient(1200px 600px at 20% 70%, rgba(0,0,0,.6), transparent 70%), linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.15) 45%, rgba(0,0,0,.45) 100%); pointer-events: none; }

.overlay-content { position: absolute; left: 50%; transform: translateX(-50%); width: min(48rem, 90vw); bottom: 22vh; z-index: 2; }
.glass-card { background: var(--glass); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.16); border-radius: 18px; padding: 24px 28px; box-shadow: 0 20px 60px rgba(0,0,0,.35); }
.hero-title { font-family: "Montserrat", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif; font-weight: 800; font-size: clamp(1.6rem, 4.2vw, 3rem); line-height: 1.1; margin: 0 0 .25rem; }
.hero-sub { font-size: clamp(.95rem, 1.6vw, 1.15rem); opacity: .9; margin-bottom: 1rem; }
.cta-row { display:flex; gap:.75rem; align-items:center; flex-wrap:wrap; }
.cta-secondary { color:#e5e7eb; text-decoration: underline; opacity:.9; }

/* Dots */
.dots { display:flex; gap:.5rem; align-items:center; }
.dot-button { width: 12px; height: 12px; border-radius: 9999px; border: 2px solid #fff; background: transparent; transition: all .25s ease; }
.dot-active { background:#fff; transform: scale(1.1); }

/* Mobile hero sizing with tasteful overlap */
@media (max-width: 767px) {
  .hero-section { height: 88vh; }
  .overlay-content { width: 92vw; bottom: -6vh; }
  .hero-section + .usp-strip { margin-top: 10vh; }
}

/* ================== USP STRIP ================== */
.usp-strip { margin-top: 1.5rem; margin-bottom: 1.25rem; }
.usp-strip .grid { background: linear-gradient(90deg, rgba(2,6,23,.85), rgba(2,6,23,.65)); border-radius: 16px; overflow: hidden; }
.usp-item { display:flex; align-items:center; gap:.75rem; padding: .9rem 1rem; border-right: 1px solid rgba(255,255,255,.06); }
.usp-item:last-child { border-right: 0; }
.usp-icon { width: 36px; height: 36px; display:grid; place-items:center; background: rgba(255,255,255,.08); border-radius: 10px; font-size: 18px; }
.usp-text { display:flex; flex-direction:column; line-height:1.1; }
.usp-text span { opacity:.8; font-size:.9rem; }

/* ================== SHARED TYPO ================== */
.section-title { font-family: "Montserrat", system-ui; font-weight:800; font-size: clamp(1.4rem, 2.8vw, 2.2rem); color:#1f2937; margin: 0 0 .5rem; }
.muted { color:#6b7280; max-width: 60ch; margin: 0 auto; }

/* ================== POPULAR MODELS ================== */
.popular-models { margin: 1.25rem 0 1.75rem; }
.chips { display:flex; flex-wrap:wrap; gap:.5rem; }
.chip { appearance:none; border:1px solid #e5e7eb; background:#fff; color:#111827; border-radius:999px; padding:.55rem .9rem; font-weight:600; font-size:.95rem; transition: all .2s ease; }
.chip:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,.08); border-color:#111827; }

/* ================== FEATURED VEHICLES ================== */
.vehicle-card { border-radius: 16px; overflow:hidden; transition: transform .3s ease, box-shadow .3s ease; }
.vehicle-card:hover { transform: translateY(-4px); box-shadow: 0 30px 40px rgba(0,0,0,.15); }
.v-media { position: relative; height: 220px; }
.media-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.price-chip { position:absolute; bottom:12px; right:12px; background: rgba(17,24,39,.9); color:#fff; padding:.35rem .6rem; border-radius:10px; font-weight:800; font-size: .95rem; }
.sold-ribbon { position: absolute; top: 12px; left: -40px; transform: rotate(-45deg); background: #ef4444; color: #fff; font-weight: 800; letter-spacing: 1px; padding: 6px 56px; box-shadow: 0 8px 20px rgba(0,0,0,.25); text-transform: uppercase; font-size: 0.85rem; pointer-events: none; }
.sold-dim { filter: grayscale(40%) brightness(0.85); }
.v-title { font-weight:800; color:#111827; margin:.35rem 0; }
.v-meta { color:#6b7280; }

/* ================== TEST DRIVE ================== */
.testdrive { margin-top: 1.25rem; }
.td-card { border-radius: 16px; overflow:hidden; }
.td-title { margin: 0; font-weight: 800; color: #111827; }
.pick-strip { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
.pick-item { scroll-snap-align:start; width: 22rem; }

/* ================== TESTIMONIALS ================== */
.testi-card { border-radius: 16px; }
.quote { font-size: 1.1rem; color: #111827; }
.byline { color:#6b7280; margin-top: .5rem; }

/* Lift the hero CTA card on mobile */
@media (max-width: 767px) {
  .overlay-content {
    bottom: 18vh !important;     /* try 16–22vh to taste */
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: 92vw !important;
    padding: 16px 18px !important;
  }

  /* Reduce the extra gap below the hero now that we’re not overlapping */
  .hero-section + .text-center {
    margin-top: 1.5rem !important;
  }
}

@media (max-width: 767px) {
  .hero-section { height: 88vh !important; } /* was 85vh */
}
/* === Compact hero on phones (short + fitted) === */
@media (max-width: 767px) {
  /* Make the hero much shorter */
  .hero-section {
    height: clamp(350px, 46vh, 500px) !important; /* pick your vibe: 34–42vh */
  }

  /* Keep the image neatly fitted inside the shorter hero */
  .hero-img {
    height: 100% !important;
    width: 100%;
    object-fit: cover;        /* swap to 'contain' if you prefer no crop + letterboxing */
    object-position: center;  /* or 'center 40%' to bias the car up */
  }

  /* Pull the glass card up so it sits within the short hero */
  .overlay-content {
    width: 92vw !important;
    bottom: 6vh !important;   /* tweak 4–10vh to taste */
    padding: 14px 16px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }

  /* Slightly smaller text for the tighter space */
  .hero-title { font-size: 1.35rem !important; line-height: 1.15 !important; }
  .hero-sub   { font-size: .95rem  !important; }

  /* Remove the big gap that was added when we overlapped before */
  .hero-section + .usp-strip { margin-top: 1rem !important; }
}

</style>

