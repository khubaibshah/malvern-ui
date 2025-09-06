import { createRouter, createWebHistory } from "vue-router";
import VehicleSearch from "@/public/pages/VehicleSearch.vue";
import HomePage from "@/public/pages/HomePage.vue";

import VehicleDetails from "@/public/pages/VehicleDetails.vue";
import vehicleSale from "@/public/pages/VehicleSale.vue";
import enquiryForm from "@/public/components/enquiryForm.vue";
import NotFound from "@/public/components/NotFound.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";
import TermsOfService from "@/views/TermsOfService.vue";
import Sitemap from "@/views/Sitemap.vue";
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
      path: "/car-search",
      name: "car-search",
      component: VehicleSearch,
    },
    {
      path: "/vehicle-sale",
      name: "vehicle-sale",
      component: vehicleSale,
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
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicy,
    },

    {
      path: '/terms-of-service',
      name: 'terms-of-service',
      component: TermsOfService,
    },

    {
      path: '/sitemap',
      name: 'sitemap',
      component: Sitemap,
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
