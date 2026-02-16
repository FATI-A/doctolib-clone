<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../../services/api";

const route = useRoute();
const router = useRouter();

const q = ref(route.query.q ?? "");
const city = ref(route.query.city ?? "");
const loading = ref(false);
const items = ref([]);
const error = ref(null);

async function fetch() {
  loading.value = true;
  error.value = null;
  try {
    items.value = await api.listProviders({ q: q.value, city: city.value });
  } catch (e) {
    error.value = e?.message || "Erreur chargement prestataires";
  } finally {
    loading.value = false;
  }
}

function openProvider(id) {
  router.push({ name: "client.provider", params: { id } });
}

watch([q, city], () => {
  router.replace({ query: { q: q.value, city: city.value } });
});

onMounted(fetch);
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-10">
    <div class="mx-auto max-w-6xl px-4 space-y-10">

      <!-- Header (même style que Auth) -->
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold">
          D
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
          Rechercher un prestataire
        </h1>
        <p class="mt-2 text-slate-600">
          Filtre par spécialité et ville, puis réserve un créneau.
        </p>
      </div>

      <!-- Search Card -->
      <div class="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
        <div class="grid gap-4 md:grid-cols-3">

          <div class="md:col-span-2">
            <label class="text-sm font-medium text-slate-700">Nom / spécialité</label>
            <input
              v-model="q"
              placeholder="Coach, salle, kiné..."
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-slate-700">Ville</label>
            <input
              v-model="city"
              placeholder="Paris, Lyon..."
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            @click="fetch"
            :disabled="loading"
            class="md:col-span-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {{ loading ? "Recherche en cours..." : "Rechercher un créneau" }}
          </button>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ error }}
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-slate-600">
        Chargement des prestataires...
      </div>

      <!-- Cards -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="p in items"
          :key="p.id"
          @click="openProvider(p.id)"
          class="group text-left rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                {{ p.name }}
              </div>
              <div class="text-sm text-slate-600">
                {{ p.speciality }}
              </div>
            </div>

            <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {{ p.city }}
            </span>
          </div>

          <div class="mt-3 text-sm text-slate-600">
            {{ p.address }}
          </div>

          <div class="mt-5 inline-flex items-center text-sm font-semibold text-blue-600">
            Voir & réserver →
          </div>
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-if="!loading && items.length === 0"
        class="rounded-3xl bg-white p-10 text-center shadow ring-1 ring-slate-200"
      >
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold">
          🔎
        </div>
        <h2 class="text-lg font-bold text-slate-900">Aucun résultat</h2>
        <p class="mt-2 text-sm text-slate-600">
          Essaie une autre spécialité ou une autre ville.
        </p>
      </div>

    </div>
  </div>
</template>