<template>
  <div
  :class="'bg-' + backgroundColor + '-500 px-6  flex align-items-center justify-content-between relative lg:static '"
  style="z-index: 1000;"
>
    <img :src="newLogo" alt="Logo" class="logo-img mr-0 lg:mr-6" />

    <a
      v-ripple
      :class="'cursor-pointer block lg:hidden text-' + backgroundColor + '-100 mt-1 p-ripple'"
      v-styleclass="{ selector: '#mobile-menu', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }"
    >
      <i class="pi pi-bars text-4xl"></i>
    </a>

    <div
      id="mobile-menu"
      :class="'align-items-center flex-grow-1 justify-content-between hidden lg:flex menu-container'"
    >
      <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row">
        <li>
          <a v-ripple @click="router.push({ name: 'home' })"
            :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center text-' + backgroundColor + '-100 hover:text-' + backgroundColor + '-50 hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'">
            <i class="pi pi-home mr-2"></i>
            <span>Home</span>
          </a>
        </li>
        <li>
          <a v-ripple @click="router.push({ name: 'car-search' })"
            :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center text-' + backgroundColor + '-100 hover:text-' + backgroundColor + '-50 hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'">
            <i class="pi pi-booking mr-2"></i>
            <span>Find & Buy</span>
          </a>
        </li>
        <li>
          <a v-ripple @click="router.push({ name: 'vehicle-search' })"
            :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center text-' + backgroundColor + '-100 hover:text-' + backgroundColor + '-50 hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'">
            <i class="pi pi-booking mr-2"></i>
            <span>Vehicle Search</span>
          </a>
        </li>
      </ul>

      <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row">
        <li class="flex-order-2 lg:flex-order-0">
          <div class="flex px-6 p-3 lg:px-3 lg:py-2">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search text-' + backgroundColor + '-100"></i>
              <InputText
                type="text"
                :class="'bg-' + backgroundColor + '-400 text-' + backgroundColor + '-100 border-' + backgroundColor + '-400 w-full'" />
            </span>
          </div>
        </li>
        <li :class="'border-top-1 border-' + backgroundColor + '-400 lg:border-top-none'">
          <a v-ripple
            :class="'flex px-6 p-3 lg:px-3 lg:py-2 align-items-center hover:bg-' + backgroundColor + '-600 font-medium border-round cursor-pointer transition-colors transition-duration-150 p-ripple'">
            <i class="pi pi-user" style="font-size: 1rem"></i>
            <div class="block lg:hidden">
              <div class="text-white font-medium">Josephine Lillard</div>
              <span :class="'text-' + backgroundColor + '-100 font-medium text-sm'">Marketing Specialist</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router/router';
const backgroundColor = ref('white'); // Default color is indigo 
import newLogo from '@/assets/img/newlogo.png';

</script>

<style scoped>
.logo-img {
  margin-top: 14px;
  height: 77px;
  width: 90px;
  transform: scale(1.4);
}

/* 👇 Fixes the menu stacking and layout */
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

@media (min-width: 1024px) {
  .menu-container {
    position: static;
    box-shadow: none;
    padding: 0;
    background: transparent;
  }
}

</style>