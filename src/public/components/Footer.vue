<template>
  <footer class="tile-bg text-white py-6 px-4 mt-7">
    <div class="max-w-7xl mx-auto ml-auto" style="width: 90%"> <!-- Added ml-auto and width -->
      <!-- Main Footer Content -->
      <div class="grid md:grid-cols-4 gap-8 mb-6">
        <!-- About Section -->
        <div class="col-span-2 md:col-span-1">
          <h3 class="text-xl font-bold mb-4 flex align-items-center">
            <i class="pi pi-car mr-2"></i>
            STANLEY CAR SALES
          </h3>
          <p class="text-gray-400 mb-4">
            Your premier destination for luxury and performance vehicles since 2005.
          </p>
          <div class="flex gap-3">
            <PrimeButton icon="pi pi-facebook"
              class="p-button-rounded p-button-text text-white hover:text-yellow-500" />
            <PrimeButton icon="pi pi-twitter" class="p-button-rounded p-button-text text-white hover:text-yellow-500" />
            <!-- <a href="https://www.instagram.com/r.k.autobodies?igsh=MXgydDd3azgxb2Vnag%3D%3D&utm_source=qr"
              target="_blank" rel="noopener noreferrer"> -->
            <PrimeButton icon="pi pi-instagram"
              class="p-button-rounded p-button-text text-white hover:text-yellow-500" />
            <!-- </a> -->

            <PrimeButton icon="pi pi-tiktok" class="p-button-rounded p-button-text text-white hover:text-yellow-500" />
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-bold mb-4" style="border-bottom: 2px solid; display: inline-block">
            Quick Links
          </h4>
          <ul class="list-none p-0 m-0">
            <li class="mb-2">
              <RouterLink to="/" class="text-gray-400 hover:text-yellow-500 transition-colors">Home</RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/car-search" class="text-gray-400 hover:text-yellow-500 transition-colors">Find & Buy
              </RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/vehicle-sale" class="text-gray-400 hover:text-yellow-500 transition-colors">Sell Your Car
              </RouterLink>
            </li>
          </ul>

        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-lg font-bold mb-4" style="border-bottom: 2px; display: inline-block">
            Contact Us
          </h4>
          <ul class="list-none p-0 m-0">
            <li class="mb-3 flex align-items-start">
              <i class="pi pi-map-marker mt-1 mr-2"></i>
              <span class="text-gray-400">Unit 20, Victoria Works Industrial Estate,
                Accrington Rd,
                Burnley BB11 5EF</span>
            </li>
            <li class="mb-3 flex align-items-start">
              <i class="pi pi-phone mt-1 mr-2"></i>
              <span class="text-gray-400">+44 1234 567890</span>
            </li>
            <li class="flex align-items-start">
              <i class="pi pi-envelope mt-1 mr-2"></i>
              <span class="text-gray-400">info@stanleycars.com</span>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-lg font-bold mb-4" style="border-bottom: 2px; display: inline-block">
            Newsletter
          </h4>
          <p class="text-gray-400 mb-4">
            Subscribe for exclusive offers and new arrivals
          </p>
          <div class="flex">
            <InputText placeholder="Your email" class="flex-grow-1 border-right-none" />
            <PrimeButton icon="pi pi-send" class="p-button-warning border-left-none" />
          </div>
        </div>
      </div>

      <!-- Divider -->
      <Divider class="my-4 bg-gray-700" />

      <!-- Copyright -->
      <div class="flex flex-column md:flex-row justify-content-between align-items-center">
        <span class="text-gray-500 mb-2 md:mb-0">
          &copy; 2023 Stanley Car Sales. All rights reserved.
        </span>
        <div class="flex gap-4">
          <ul class="list-none p-0 m-0">
  <li class="mb-2">
    <RouterLink to="/privacy-policy" class="text-gray-500 hover:text-yellow-500 transition-colors">
      Privacy Policy
    </RouterLink>
  </li>
  <li class="mb-2">
    <RouterLink to="/terms-of-service" class="text-gray-500 hover:text-yellow-500 transition-colors">
      Terms of Service
    </RouterLink>
  </li>
  <li class="mb-2">
    <RouterLink to="/sitemap" class="text-gray-500 hover:text-yellow-500 transition-colors">
      Sitemap
    </RouterLink>
  </li>
</ul>

          <!-- <a href="#" class="text-gray-500 hover:text-yellow-500 transition-colors">Sitemap</a> -->
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
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
</style>