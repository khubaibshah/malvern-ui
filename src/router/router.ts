import { createRouter, createWebHistory } from 'vue-router'
import carSearch from '@/public/pages/carSearch.vue'
import HomePage from '@/public/pages/HomePage.vue'
import CarDetails from '@/public/pages/CarDetails.vue'
import VehicleDetails from '@/public/pages/VehicleDetails.vue'
import bookJob from '@/public/pages/bookJobs.vue'
import payment from '@/public/pages/Payment.vue'
import SCSCarsVue from '@/public/pages/SCSCars.vue'
import vehicleSearch from '@/public/pages/vehicleSearch.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on route change
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/vehicle-search',
      name: 'vehicle-search',
      component: vehicleSearch
    },
    {
      path: '/car-search',
      name: 'car-search',
      component: carSearch
    },
    {
      path: '/vehicle/:id',
      name: 'vehicle-details',
      component: VehicleDetails
    },
    {
      path: '/scscars',
      name: 'scscars',
      component: SCSCarsVue
    },
    {
      path: '/bookJob',
      name: 'bookJob',
      component: bookJob
    },
    {
      path: '/payment',
      name: 'payment',
      component: payment
    }
  ]
})

export default router
