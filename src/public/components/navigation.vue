<template>
  <div
    ref="navRef"
    class="bg-white px-6 flex align-items-center justify-content-between fixed"
    style="z-index: 1000; width: 100%; height: 5rem;"
  >
    <router-link :to="{ name: 'home' }">
      <img :src="newLogo" alt="Logo" class="logo-img lg:mr-6 cursor-pointer" />
    </router-link>

    <button
      type="button"
      class="hamburger-btn block lg:hidden text-gray-800 mt-1"
      @click="toggleMobileMenu"
      :aria-expanded="isMobileMenuOpen"
      aria-controls="mobile-menu"
      :class="{ 'is-active': isMobileMenuOpen }"
    >
      <span class="sr-only">Toggle navigation</span>
      <span aria-hidden="true" class="hamburger-line line-top"></span>
      <span aria-hidden="true" class="hamburger-line line-middle"></span>
      <span aria-hidden="true" class="hamburger-line line-bottom"></span>
    </button>

    <div
      id="mobile-menu"
      :class="[
        'menu-container flex flex-column flex-grow-1',
        'lg:flex lg:flex-row lg:align-items-center lg:justify-content-between',
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

.hamburger-btn {
  position: relative;
  width: 2.75rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.hamburger-btn:focus-visible {
  outline: 2px solid #1f2937;
  outline-offset: 4px;
}

.hamburger-line {
  position: absolute;
  width: 1.8rem;
  height: 0.16rem;
  background: #1f2937;
  border-radius: 999px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.line-top {
  transform: translateY(-0.55rem);
}

.line-middle {
  transform: translateY(0);
}

.line-bottom {
  transform: translateY(0.55rem);
}

.hamburger-btn.is-active .line-top {
  transform: translateY(0) rotate(45deg);
}

.hamburger-btn.is-active .line-middle {
  opacity: 0;
  transform: scaleX(0.4);
}

.hamburger-btn.is-active .line-bottom {
  transform: translateY(0) rotate(-45deg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.menu-container {
  position: fixed;
  top: 5rem;
  left: 0;
  right: 0;
  width: 100%;
  height: calc(100vh - 5rem);
  background: white;
  z-index: 900;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-1rem);
  transition: opacity 0.3s ease, transform 0.3s ease;
  overflow: hidden;
}

.menu-container.menu-open {
  padding: 2rem 1.5rem;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0);
  overflow-y: auto;
  box-shadow: 0 20px 40px -16px rgba(17, 24, 39, 0.4);
}

/* Mobile menu layout */
.mobile-menu-list {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-menu-list li {
  margin-bottom: 1.25rem;
}

.mobile-menu-list a {
  display: inline-flex;
  align-items: center;
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
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: none;
    width: auto;
    height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    overflow: visible;
  }
  .menu-container .mobile-menu-list {
    width: auto;
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }
  .mobile-menu-list li {
    margin-bottom: 0;
  }
  .mobile-menu-list a {
    white-space: nowrap;
  }
  
  /* Remove spacing for desktop */
}
</style>
