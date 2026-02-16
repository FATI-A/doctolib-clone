<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const q = ref("");
const city = ref("");

function goSearch() {
  router.push({ name: "client.providers", query: { q: q.value, city: city.value } });
}
</script>

<template>
  <div class="flex items-center justify-center bg-slate-50 px-4 py-10">
    <div class="w-full max-w-2xl">
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold">
          D
        </div>
        <h1 class="text-3xl font-bold text-slate-900">
          Trouve un prestataire
        </h1>
        <p class="mt-2 text-slate-600">
          Recherche par spécialité et ville, puis réserve ton créneau.
        </p>
      </div>

      <section class="mt-8 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
        <span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          Réservation en ligne • MVP
        </span>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">

          <div>
            <label class="text-sm font-medium text-slate-700">
              Spécialité / Nom
            </label>
            <input
              v-model="q"
              placeholder="Coach, salle, kiné…"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-slate-700">
              Ville
            </label>
            <input
              v-model="city"
              placeholder="Paris, Lyon…"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            @click="goSearch"
            class="sm:col-span-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Rechercher un créneau
          </button>

          <router-link
            to="/auth"
            class="sm:col-span-2 text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Se connecter / S’inscrire →
          </router-link>

        </div>
      </section>

    </div>
  </div>
</template>