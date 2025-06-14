<template>
  <div
    class="bg-white px-6 flex align-items-center justify-content-between fixed"
    style="z-index: 1000; width: 100%; height: 5rem;"
  >
    <router-link :to="{ name: 'home' }">
      <img :src="newLogo" alt="Logo" class="logo-img lg:mr-6 cursor-pointer" />
    </router-link>

    <a
      v-ripple
      class="cursor-pointer block lg:hidden text-gray-800 mt-1 p-ripple"
      v-styleclass="{
        selector: '#mobile-menu',
        enterClass: 'hidden',
        leaveToClass: 'hidden',
        hideOnOutsideClick: true,
      }"
    >
      <i class="pi pi-bars text-4xl"></i>
    </a>

    <div
      id="mobile-menu"
      class="align-items-center flex-grow-1 justify-content-between hidden lg:flex menu-container"
    >
      <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row mobile-menu-list">
        <li>
          <router-link
            :to="{ name: 'home' }"
            @click="closeMobileMenu"
            class="flex items-center gap-2 px-4 py-3 lg:py-2 hover:bg-gray-100 rounded-md transition duration-150 cursor-pointer no-underline text-black font-medium"
          >
            <span>Models</span>
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
        <!-- add more menu items here if need -->
        
        <!-- Mobile-only items -->
        <li class="block lg:hidden w-full">
          <PrimeDivider />
        </li>
        <li class="block lg:hidden flex items-center">
          <PrimeButton label="+44 1234 567890" icon="pi pi-phone" severity="contrast" class="text-sm" raised />
        </li>
        <li class="block lg:hidden flex items-center">
          <PrimeButton label="info@luxurycars.com" icon="pi pi-envelope" iconPos="left" severity="contrast"
            class="text-sm" raised />
        </li>
      </ul>
    </div>

    <!-- Desktop Contact Buttons (Far Right Side) -->
    <div class="hidden lg:flex items-center gap-4 w-full flex-row-reverse">
      <PrimeButton label="+44 1234 567890" icon="pi pi-phone" severity="contrast" class="text-sm" raised />
      <PrimeButton label="Sales@scscarsales.co.uk" icon="pi pi-envelope" severity="contrast" class="text-sm" raised />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router/router';
import newLogo from '@/assets/img/newlogo1.png';

const closeMobileMenu = () => {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }
};
</script>

<style scoped>
.logo-img {
  margin-top: 5px;
  width: 90px;
  transform: scale(1.4);
}

.menu-container {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  z-index: 1;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

/* Added spacing for mobile menu items */
.mobile-menu-list li {
  margin-bottom: 0.5rem;
}

@media (min-width: 1024px) {
  .menu-container {
    position: static;
    box-shadow: none;
    padding: 0;
    background: transparent;
    flex-grow: 1;
  }
  
  /* Remove spacing for desktop */
  .mobile-menu-list li {
    margin-bottom: 0;
  }
}
</style>