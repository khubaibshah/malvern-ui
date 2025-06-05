<script setup lang="ts">
import Nav from './public/components/navigation.vue';
import Footer from './public/components/Footer.vue';
</script>

<template>
<Nav />
  <div>
    <router-view />
  </div>
<Footer />
</template>
