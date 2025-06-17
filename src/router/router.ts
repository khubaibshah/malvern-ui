import { createRouter, createWebHistory } from "vue-router";
import carSearch from "@/public/pages/carSearch.vue";
import HomePage from "@/public/pages/HomePage.vue";
import CarDetails from "@/public/pages/CarDetails.vue";
import VehicleDetails from "@/public/pages/VehicleDetails.vue";
import bookJob from "@/public/pages/bookJobs.vue";
import vehicleSale from "@/public/pages/VehicleSale.vue";
import enquiryForm from "@/public/components/enquiryForm.vue";
import NotFound from "@/public/components/NotFound.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on route change
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/vehicle-sale",
      name: "vehicle-sale",
      component: vehicleSale,
    },
    {
      path: "/car-search",
      name: "car-search",
      component: carSearch,
    },
    {
      path: "/vehicle/:id",
      name: "vehicle-details",
      component: VehicleDetails,
    },

    {
      path: "/enquire/:vehicleId",
      name: "enquiry-form",
      component: enquiryForm,
    },
    {
      path: "/bookJob",
      name: "bookJob",
      component: bookJob,
    },

    // router/index.js or router.ts
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFound,
    },
  ],
});

export default router;
