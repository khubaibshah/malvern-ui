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

  <!-- HERO -->
<!-- HERO (slide, no fade) -->
<section class="hero-section overflow-hidden car-details-container">
  <!-- Background slider -->
  <div class="hero-slider">
    <div
      class="hero-track"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div v-for="(image, i) in images" :key="i" class="hero-slide">
        <img :src="image.itemImageSrc" :alt="image.alt" class="hero-img" />
      </div>
    </div>
    <div class="hero-gradient"></div>
  </div>

  <!-- Glass card (never fades) -->
  <div class="overlay-content glass-card text-white z-10">
    <h1 class="hero-title">{{ slideText.title }}</h1>
    <p class="hero-sub">{{ slideText.subtitle }}</p>

    <div class="cta-row">
      <PrimeButton
        label="Browse Vehicles"
        class="cta-primary"
        severity="contrast"
        @click="$router.push({ name: 'car-search' })"
      />
      <a href="#test-drive" class="cta-secondary">Schedule a Test Drive</a>
    </div>

    <!-- Dots -->
    <div class="dots mt-4">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="currentIndex = index"
        class="dot-button"
        :class="{ 'dot-active': currentIndex === index, 'dot-inactive': currentIndex !== index }"
        aria-label="Slide navigation button"
      />
    </div>
  </div>
</section>


  <!-- TRUST / VALUE STRIP -->
  <section class="trust-strip">
    <div class="trust-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l7 4v6c0 5-3.4 9.3-7 10-3.6-.7-7-5-7-10V6l7-4zM7 10v2c0 3.7 2.4 7.3 5 8 2.6-.7 5-4.3 5-8v-2l-5-3-5 3zm3.6 2.8l4.6-4.6 1.4 1.4-6 6-3-3 1.4-1.4 1.6 1.6z"/></svg>
      <span>HPI‑Checked Vehicles</span>
    </div>
    <div class="trust-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z"/></svg>
      <span>4.8★ Customer Reviews</span>
    </div>
    <div class="trust-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 6h18v12H3V6zm2 2v8h14V8H5zm2 2h5v2H7v-2zm0 3h7v2H7v-2z"/></svg>
      <span>Finance Options Available</span>
    </div>
  </section>

  <!-- FEATURED VEHICLES -->
  <section id="featured" class="section-wrap">
    <div class="section-header">
      <h2>Featured Vehicles</h2>
      <p>Hand‑picked cars with great specs and strong value.</p>
    </div>

    <!-- Loading skeletons -->
    <div class="grid" v-if="loading">
      <div class="col-12 md:col-8">
        <PrimeSkeleton width="100%" height="360px" class="mb-3 border-round" />
        <div class="flex gap-3 overflow-x-auto">
          <PrimeSkeleton v-for="n in 4" :key="n" width="7rem" height="5rem" class="border-round" />
        </div>
      </div>
      <div class="col-12 md:col-4">
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

    <!-- Featured -->
    <div class="grid mx-auto" v-else-if="featuredVehicles" style="justify-content: center;">
      <div
        v-for="(car, index) in featuredVehicles"
        :key="car.id"
        :class="`col-12 sm:col-6 lg:col-4 px-3 mb-5 md:col-${12 / featuredVehicles.length}`"
      >
        <PrimeCard class="border-round-xl overflow-hidden hover-card shadow-elev">
          <template #header>
            <div class="card-media">
              <img
                :src="mainImg(car)"
                :alt="(car.make || '') + ' ' + (car.model || '')"
                class="media-img"
                :class="{ 'sold-dim': isSold(car) }"
                loading="lazy"
              />
              <div v-if="isSold(car)" class="sold-ribbon">SOLD</div>
              <div class="price-chip">£{{ parseFloat(car.price).toLocaleString() }}</div>
            </div>
          </template>
          <template #title>
            <h3 class="vehicle-title">{{ car.make }} {{ car.model }}</h3>
          </template>
          <template #content>
            <div class="spec-row">
              <span v-if="car.variant">{{ car.variant }}</span>
              <span v-if="car.year">• {{ car.year }}</span>
            </div>
          </template>
          <template #footer>
            <div class="card-actions">
              <RouterLink :to="{ name: 'vehicle-details', params: { id: car.id } }" class="w-full no-underline">
                <PrimeButton label="View Details" class="w-full p-button-sm" text />
              </RouterLink>
            </div>
          </template>
        </PrimeCard>
      </div>
    </div>
  </section>

  <!-- QUICK FILTERS (models) -->
  <section v-if="modelOptions && modelOptions.length" class="quick-filters">
    <div class="section-header compact">
      <h3>Popular Models</h3>
      <p>Tap a model to view available stock.</p>
    </div>
    <div class="chips">
      <button
        v-for="opt in modelOptions.slice(0, 10)"
        :key="opt.value"
        class="chip"
        @click="filterByModel(opt.value); $router.push({ name: 'car-search', query: { model: opt.value } })"
      >
        {{ opt.label }}
      </button>
    </div>
  </section>

  <!-- TEST DRIVE FORM -->
  <section id="test-drive" class="section-wrap">
    <div class="section-header">
      <h2>Schedule a Test Drive</h2>
      <p>Tell us who you are and the car you like — we’ll call you back.</p>
    </div>

    <div class="grid">
      <!-- Form -->
      <div class="col-12 md:col-6">
        <PrimeCard class="glass-card p-0">
          <template #title>
            <p class="muted">Please fill out your details and select a vehicle for a call back</p>
          </template>
          <template #content>
            <div class="form-grid">
              <InputText placeholder="Your Name" class="w-full" v-model="form.name" />
              <InputText placeholder="Email Address" class="w-full" v-model="form.email" />
              <InputText placeholder="Phone Number" class="w-full" v-model="form.phone" />

              <p class="selected-vehicle" v-if="form.vehicle_id">
                Selected:
                {{ vehicleOptions.find(opt => opt.value === form.vehicle_id)?.label || 'Unknown Vehicle' }}
              </p>

              <PrimeButton
                label="Request Appointment"
                class="w-full submit-btn"
                severity="contrast"
                :loading="submitting"
                @click="submitTestDriveRequest()"
              />
            </div>
          </template>
        </PrimeCard>
      </div>

      <!-- Vehicle pick scroller -->
      <div class="col-12 md:col-6">
        <div class="pick-scroller">
          <div
            v-for="(car, index) in vehicles"
            :key="car.id"
            class="pick-item"
          >
            <PrimeCard
              :class="{ 'ring-2 ring-green-500': form.vehicle_id === car.id, 'hover-card': true }"
              style="width: 100%; overflow: hidden;"
            >
              <template #header>
                <div class="card-media small">
                  <img
                    :src="mainImg(car)"
                    :alt="(car.make || '') + ' ' + (car.model || '')"
                    class="media-img"
                    :class="{ 'sold-dim': isSold(car) }"
                    loading="lazy"
                  />
                  <div v-if="isSold(car)" class="sold-ribbon">SOLD</div>
                </div>
              </template>
              <template #title>{{ car.make }} {{ car.model }}</template>
              <template #subtitle>{{ car.variant || 'No Variant' }}</template>
              <template #content>
                <p class="m-0 text-sm text-gray-700">
                  Discover the thrill of driving {{ car.make }}'s {{ car.model }} — packed with features, performance, and style.
                </p>
              </template>
              <template #footer>
                <PrimeButton
                  label="Select This Car"
                  size="small"
                  class="w-full"
                  :disabled="isSold(car)"
                  :outlined="form.vehicle_id !== car.id"
                  :severity="form.vehicle_id === car.id ? 'success' : 'secondary'"
                  @click="form.vehicle_id = car.id"
                />
              </template>
            </PrimeCard>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section v-if="testimonials && testimonials.length" class="section-wrap">
    <div class="section-header">
      <h2>What Our Customers Say</h2>
      <p>Real words from real buyers.</p>
    </div>
    <div class="review-track" aria-label="Customer reviews">
      <article v-for="t in testimonials" :key="t.name" class="review-card hover-card">
        <div class="review-head">
          <img :src="t.avatar" :alt="t.name" class="avatar" />
          <div>
            <h4 class="m-0">{{ t.name }}</h4>
            <p class="m-0 muted">{{ t.role }}</p>
          </div>
        </div>
        <p class="quote">“{{ t.quote }}”</p>
        <div class="stars" aria-hidden="true">
          <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z"/></svg>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
/* ---- CSS Vars ---- */
:root {
  --hero-title: clamp(2rem, 6vw, 4rem);
  --hero-sub: clamp(1rem, 2.2vw, 1.25rem);
  --brand: #111827; /* near-black */
  --muted: #6b7280; /* gray-500 */
  --accent: #0ea5e9; /* sky-500 */
  --success: #16a34a;
  --card-bg: rgba(255, 255, 255, 0.08);
}

/* ---- HERO ---- */
.hero-section img { object-fit: cover; object-position: 70% center; }

@media (min-width: 768px) {
  .hero-section { height: 92vh; }
}
.hero-slide img { filter: saturate(1.05) contrast(1.05); }
.hero-gradient { background: linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.35) 40%, rgba(0,0,0,.55) 100%); }
.glass-card {
  background: rgba(17, 24, 39, 0.45);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 1.25rem;
  padding: 1.25rem 1.25rem 1rem;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
}
.overlay-content {
  position: absolute;
  left: 50%;
  bottom: 2rem;
  transform: translateX(-50%);
  width: min(680px, 92%);
  color: #fff;
}
@media (min-width: 768px) {
  .overlay-content {
    left: 10rem;
    bottom: 22rem;
    transform: none;
    width: 36rem;
  }
}
.hero-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  line-height: 1.05;
  font-size: var(--hero-title);
  margin: 0 0 .4rem 0;
}
.hero-sub { font-size: var(--hero-sub); opacity: .95; margin: 0 0 1rem 0; }
.cta-row { display: flex; gap: .75rem; align-items: center; flex-wrap: wrap; }
.cta-primary { font-weight: 700; }
.cta-secondary { color: #fff; text-decoration: none; opacity: .9; border-bottom: 1px dashed rgba(255,255,255,.6); padding-bottom: 2px; }

.dots { display: flex; gap: .5rem; align-items: center; }
.dot-button { width: 12px; height: 12px; border-radius: 999px; border: 2px solid #fff; background: transparent; transition: all .25s ease; }
.dot-button:hover { background-color: rgba(255,255,255,.35); }
.dot-active { background: #fff; transform: scale(1.15); }
.dot-inactive { background: transparent; }

/* ---- TRUST STRIP ---- */
.trust-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: .75rem;
  padding: 1rem clamp(1rem, 4vw, 2rem);
  background: linear-gradient(90deg, #0f172a 0%, #111827 100%);
  color: #fff;
}
.trust-item { display: flex; align-items: center; gap: .55rem; font-weight: 600; justify-content: center; }
.trust-item svg { opacity: .9; }

/* ---- SECTIONS ---- */
.section-wrap { padding: 2.5rem clamp(1rem, 4vw, 2rem); }
.section-header { text-align: center; margin-bottom: 1.25rem; }
.section-header.compact { margin-bottom: .5rem; }
.section-header h2 { font-size: clamp(1.6rem, 3vw, 2.1rem); color: #111827; margin: 0 0 .25rem; }
.section-header h3 { font-size: clamp(1.2rem, 2.2vw, 1.4rem); color: #111827; margin: 0; }
.section-header p { color: var(--muted); margin: .25rem 0 0; }

/* ---- FEATURED CAR CARDS ---- */
.shadow-elev { box-shadow: 0 20px 40px rgba(0,0,0,.08); }
.card-media { position: relative; aspect-ratio: 16/9; background: #0b0b0b; }
.card-media.small { aspect-ratio: 16/10; }
.media-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.price-chip {
  position: absolute; bottom: .65rem; right: .65rem;
  background: rgba(17,24,39,.85); color: #fff; font-weight: 800;
  padding: .35rem .6rem; border-radius: .5rem; font-size: .95rem;
}
.vehicle-title { font-size: 1rem; margin: .25rem 0; color: #111827; }
.spec-row { color: var(--muted); font-size: .9rem; }

.card-actions { display: flex; gap: .75rem; align-items: center; margin-top: .25rem; }

/* SOLD */
.sold-ribbon {
  position: absolute; top: 12px; left: -40px; transform: rotate(-45deg);
  background: #ef4444; color: #fff; font-weight: 800; letter-spacing: 1px;
  padding: 6px 56px; box-shadow: 0 8px 20px rgba(0,0,0,.25);
  text-transform: uppercase; font-size: .85rem; pointer-events: none;
}
.sold-dim { filter: grayscale(40%) brightness(.85); }

/* ---- QUICK FILTERS ---- */
.quick-filters { padding: 1.25rem clamp(1rem, 4vw, 2rem) 0; }
.chips { display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center; }
.chip {
  padding: .45rem .7rem; border: 1px solid #e5e7eb; border-radius: 999px;
  background: #fff; font-weight: 600; cursor: pointer; transition: all .2s ease;
}
.chip:hover { border-color: #111827; transform: translateY(-1px); }

/* ---- FORM & PICKER ---- */
.muted { color: var(--muted); }
.selected-vehicle { margin: .25rem 0 0; color: #111827; font-weight: 600; }
.submit-btn { background: #111827; font-weight: 700; }

.form-grid { display: grid; gap: .75rem; }

.pick-scroller { display: flex; overflow-x: auto; gap: 1rem; padding-bottom: .25rem; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
.pick-item { flex: 0 0 22rem; scroll-snap-align: start; }

/* ---- REVIEWS ---- */
.review-track { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(260px, 1fr); gap: 1rem; overflow-x: auto; padding-bottom: .25rem; }
.review-card { background: #fff; border-radius: 1rem; padding: 1rem; border: 1px solid #eef; }
.review-head { display: flex; align-items: center; gap: .75rem; }
.avatar { width: 40px; height: 40px; border-radius: 999px; object-fit: cover; }
.quote { margin: .5rem 0; color: #111827; font-size: .95rem; }
.stars { color: #f59e0b; display: flex; gap: .15rem; }

/* ---- Motion ---- */
.fade-enter-active, .fade-leave-active { transition: opacity 1.1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; opacity: 0; }
.delay-100 { animation-delay: .1s; }
.delay-200 { animation-delay: .2s; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* ---- Existing helpers retained ---- */
.text-right-btn { justify-content: flex-end !important; text-align: right !important; }
.hover-card { transition: transform .25s ease, box-shadow .25s ease; }
.hover-card:hover { transform: translateY(-4px); box-shadow: 0 30px 40px rgba(0,0,0,.15); }

/* === Center + wider hero card (override) === */
.overlay-content {
  left: 50% !important;
  transform: translateX(-50%) !important;
  bottom: clamp(16px, 6vh, 96px);
  width: clamp(28rem, 64vw, 62rem); /* widen */
}

/* optional: a touch more breathing room inside the glass card */
.glass-card { padding: 1.25rem 1.75rem; }

/* keep dots and CTAs aligned nicely inside the wider card */
.dots { justify-content: flex-start; }
.cta-row { gap: 1rem; flex-wrap: wrap; }

/* Raise the hero card higher */
@media (min-width: 1024px) {
  .overlay-content {
    bottom: clamp(160px, 24vh, 340px) !important; /* move it up on large screens */
  }
}

/* Tablets */
@media (min-width: 768px) and (max-width: 1023px) {
  .overlay-content {
    bottom: clamp(96px, 18vh, 240px) !important;
  }
}

/* Mobiles (just a little lift) */
@media (max-width: 767px) {
  .overlay-content {
    bottom: clamp(32px, 10vh, 120px) !important;
  }
}

/* --- HERO slider --- */
.hero-slider { position: absolute; inset: 0; overflow: hidden; }
.hero-track {
  display: flex;
  height: 100%;
  gap: 0;                 /* images glued together */
  transition: transform 800ms ease-in-out; /* slide from right */
  will-change: transform;
}
.hero-slide { flex: 0 0 100%; height: 100%; position: relative; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.hero-gradient { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.25) 40%, rgba(0,0,0,.4) 100%); pointer-events: none; }

/* Remove any hero fade effects entirely */
.fade-enter-active, .fade-leave-active { transition: none !important; }
.fade-enter-from, .fade-leave-to { opacity: 1 !important; }
.animate-fade-in-up { animation: none !important; opacity: 1 !important; }

</style>

