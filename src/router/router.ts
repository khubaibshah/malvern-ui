import { createRouter, createWebHistory } from 'vue-router'
import CreateBookingVue from '@/public/pages/CreateBooking.vue'
import HomePage from '@/public/pages/HomePage.vue'
import CarDetails from '@/public/pages/CarDetails.vue'
import bookJob from '@/public/pages/bookJobs.vue'
import payment from '@/public/pages/Payment.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/createbooking',
      name: 'createbooking',
      component: CreateBookingVue
    },
    // {
    //   path: '/carDetails',
    //   name: 'cardetails',
    //   component: CarDetails
    // },
    {
      path: '/bookJob',
      name: 'bookJob',
      component: bookJob
    },
    {
      path: '/payment',
      name: 'payment',
      component: payment
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
