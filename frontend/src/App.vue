<script setup>
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

async function logout() {
  await auth.logout();
  router.push({ name: "landing" });
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <router-link to="/" class="flex items-center gap-2 font-semibold">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold shadow-md">
            D
          </span>
          <span class="text-lg font-bold">DoctoClone</span>
        </router-link>

        <nav class="ml-4 hidden items-center gap-2 md:flex">
          <router-link
            to="/"
            class="navlink"
          >
            Accueil
          </router-link>

          <router-link
            v-if="auth.role === 'client'"
            to="/client/providers"
            class="navlink"
          >
            Rechercher
          </router-link>

          <router-link
            v-if="auth.role === 'client'"
            to="/client/bookings"
            class="navlink"
          >
            Mes RDV
          </router-link>
        </nav>

        <div class="ml-auto flex items-center gap-3">
          <div
            v-if="auth.user"
            class="hidden rounded-2xl bg-blue-50 px-4 py-2 text-xs text-blue-700 md:block"
          >
            <div class="font-semibold text-blue-900">{{ auth.user.email }}</div>
            <div>Rôle : {{ auth.user.role }}</div>
          </div>

          <router-link
            v-if="!auth.user"
            to="/auth"
            class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
          >
            Connexion
          </router-link>

          <button
            v-else
            @click="logout"
            class="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.navlink {
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(51 65 85);
  transition: 150ms;
}
.navlink:hover {
  background: rgb(239 246 255); 
  color: rgb(37 99 235);
}
.router-link-active {
  background: rgb(239 246 255);
  color: rgb(37 99 235);
}
</style>