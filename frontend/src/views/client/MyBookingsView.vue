<script setup>
import { onMounted } from "vue";
import { useBookingsStore } from "../../stores/bookings";

const store = useBookingsStore();

function format(dt) {
  const d = new Date(dt);
  return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

async function cancel(id) {
  await store.cancel(id);
}

onMounted(() => store.fetchMyBookings());
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-10">
    <div class="mx-auto max-w-5xl px-4 space-y-6">
      <div class="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Mes réservations</h1>
          <p class="mt-1 text-slate-600">
            Retrouve tes rendez-vous et annule si besoin.
          </p>
        </div>

        <div class="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
          <div class="text-xs font-semibold text-slate-500">Total</div>
          <div class="text-lg font-bold text-slate-900">{{ store.myBookings.length }}</div>
        </div>
      </div>
      <div
        v-if="store.error"
        class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ store.error }}
      </div>
      <div v-if="store.loading" class="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
        <p class="text-slate-600">Chargement…</p>
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="b in store.myBookings"
          :key="b.id"
          class="rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition hover:shadow-lg"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-xs font-semibold text-slate-500">Client</div>
              <div class="text-lg font-bold text-slate-900">{{ b.customerName }}</div>
            </div>
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="b.status === 'CONFIRMED'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'"
            >
              {{ b.status === 'CONFIRMED' ? 'Confirmé' : 'Annulé' }}
            </span>
          </div>

          <div class="mt-4 space-y-2 text-sm text-slate-600">
            <div class="rounded-xl bg-slate-50 p-3">
              <div class="text-xs font-semibold text-slate-500">Créé le</div>
              <div class="text-slate-900">{{ format(b.createdAt) }}</div>
            </div>
          </div>

          <div class="mt-5 flex items-center justify-between">
            <div class="text-xs text-slate-500">
              ID: <span class="font-mono">{{ b.id.slice(0, 8) }}</span>
            </div>

            <button
              v-if="b.status === 'CONFIRMED'"
              @click="cancel(b.id)"
              class="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
            >
              Annuler
            </button>

            <span
              v-else
              class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500"
            >
              Terminé
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="!store.loading && store.myBookings.length === 0"
        class="rounded-3xl bg-white p-10 text-center shadow ring-1 ring-slate-200"
      >
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold">
          📅
        </div>
        <h2 class="text-lg font-bold text-slate-900">Aucun rendez-vous</h2>
        <p class="mt-2 text-sm text-slate-600">
          Tu n’as pas encore de réservation. Va dans “Rechercher” pour choisir un prestataire.
        </p>

        <router-link
          to="/client/providers"
          class="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Rechercher un créneau →
        </router-link>
      </div>

    </div>
  </div>
</template>