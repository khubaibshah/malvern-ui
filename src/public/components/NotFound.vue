<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-8">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-2xl text-gray-600 mb-6">Page Not Found</h2>
      <p class="text-gray-500 mb-8 max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <router-link to="/home">
        <PrimeButton label="Back to Home" icon="pi pi-home" class="p-button-outlined" />
      </router-link>
    </div>
  </div>
</template>


<script setup>
</script>
