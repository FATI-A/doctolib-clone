import { createRouter, createWebHistory } from "vue-router";

import LandingView from "../views/public/LandingView.vue";
import AuthView from "../views/public/AuthView.vue";
import SearchProvidersView from "../views/client/SearchProvidersView.vue";
import ProviderDetailView from "../views/client/ProviderDetailView.vue";
import MyBookingsView from "../views/client/MyBookingsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "landing", component: LandingView },
    { path: "/auth", name: "auth", component: AuthView },

    { path: "/client/providers", name: "client.providers", component: SearchProvidersView },
    { path: "/client/providers/:id", name: "client.provider", component: ProviderDetailView },
    { path: "/client/bookings", name: "client.bookings", component: MyBookingsView },

    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;