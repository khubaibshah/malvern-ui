<script setup lang="ts">
import Nav from './public/components/navigation.vue';
import Footer from './public/components/Footer.vue';
</script>

<template>
<Nav />
  <div class="page-content">
    <router-view />
  </div>
<Footer />
</template>
<style scoped>
.page-content {
  padding-top: 5rem; /* Match navbar height */
}
</style>