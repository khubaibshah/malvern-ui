<template>
  <div
    ref="navRef"
    class="bg-white px-6 flex align-items-center justify-content-between fixed"
    style="z-index: 1000; width: 100%; height: 5rem;"
  >
    <router-link :to="{ name: 'home' }">
      <img :src="newLogo" alt="Logo" class="logo-img lg:mr-6 cursor-pointer" />
    </router-link>

    <a
      v-ripple
      class="cursor-pointer block lg:hidden text-gray-800 mt-1 p-ripple"
      @click="toggleMobileMenu"
      :aria-expanded="isMobileMenuOpen"
      aria-controls="mobile-menu"
    >
      <i class="pi pi-bars text-4xl"></i>
    </a>

    <div
      id="mobile-menu"
      :class="[
        'align-items-center flex-grow-1 justify-content-between menu-container flex lg:flex',
        isMobileMenuOpen ? 'menu-open' : ''
      ]"
    >
      <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row mobile-menu-list">
        <li>
          <router-link
            :to="{ name: 'home' }"
            @click="closeMobileMenu"
            class="flex items-center gap-2 px-4 py-3 lg:py-2 hover:bg-gray-100 rounded-md transition duration-150 cursor-pointer no-underline text-black font-medium"
          >
            <span>Home</span>
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'car-search' }"
            @click="closeMobileMenu"
            class="flex items-center gap-2 px-4 py-3 lg:py-2 hover:bg-gray-100 rounded-md transition duration-150 cursor-pointer no-underline text-black font-medium"
          >
            <span>Find & Buy</span>
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'vehicle-sale' }"
            @click="closeMobileMenu"
            class="flex items-center gap-2 px-4 py-3 lg:py-2 hover:bg-gray-100 rounded-md transition duration-150 cursor-pointer no-underline text-black font-medium"
          >
            <span>Sell your car</span>
          </router-link>
        </li>
       
        <!-- add more menu items here if need -->
        
        <!-- Mobile-only items -->
        <li class="block lg:hidden w-full">
          <PrimeDivider />
        </li>
        <li class="block lg:hidden flex items-center">
          <PrimeButton label="+44 7514 149339" icon="pi pi-phone" severity="contrast" class="text-sm" raised />
        </li>
        <li class="block lg:hidden flex items-center">
          <PrimeButton label="sales@scscarsales.co.uk" icon="pi pi-envelope" iconPos="left" severity="contrast"
            class="text-sm" raised />
        </li>
      </ul>
    </div>

    <!-- Desktop Contact Buttons (Far Right Side) -->
    <div class="hidden lg:flex items-center gap-4 w-full flex-row-reverse">
      <PrimeButton label="+44 7514 149339" icon="pi pi-phone" severity="contrast" class="text-sm" raised  />
<PrimeButton
  label="sales@scscarsales.co.uk"
  icon="pi pi-envelope"
  severity="contrast"
  class="text-sm"
  raised
  @click="window.location.href='mailto:sales@scscarsales.co.uk'"
/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import newLogo from '@/assets/img/newlogo1.png';

const navRef = ref<HTMLElement | null>(null);
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (!isMobileMenuOpen.value) {
    return;
  }

  const target = event.target as Node;
  if (navRef.value && !navRef.value.contains(target)) {
    isMobileMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>

.logo-img {
  width: 110px;
  height: auto;
}

.menu-container {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  z-index: 1;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  padding: 0;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transform: translateY(-0.5rem);
  transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease, transform 0.3s ease;
}

.menu-container.menu-open {
  padding: 1rem;
  max-height: 600px;
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

/* Added spacing for mobile menu items */
.mobile-menu-list li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
.logo-img {
  position: absolute;
  top: 0px;
  left: 26px;
  width: 83px;
  transform: scale(1.4);
}

}
@media (min-width: 1024px) {
    .logo-img{
    width: 100px;
    height: auto;
  }
  .menu-container {
    position: static;
    box-shadow: none;
    padding: 0;
    background: transparent;
    flex-grow: 1;
    max-height: none;
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }
  
  /* Remove spacing for desktop */
  .mobile-menu-list li {
    margin-bottom: 0;
  }
}
</style>
