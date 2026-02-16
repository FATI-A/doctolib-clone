<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../../services/api";
import { useBookingsStore } from "../../stores/bookings";

const route = useRoute();
const router = useRouter();
const bookingsStore = useBookingsStore();

const providerId = computed(() => route.params.id);

const provider = ref(null);
const slots = ref([]);
const loading = ref(false);
const error = ref(null);

const customerName = ref("Fatiha");
const selectedSlotId = ref("");

function format(dt) {
  const d = new Date(dt);
  return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    provider.value = await api.getProvider(providerId.value);
    slots.value = await api.listSlots(providerId.value);
  } catch (e) {
    error.value = e?.message || "Erreur chargement";
  } finally {
    loading.value = false;
  }
}

async function book() {
  if (!selectedSlotId.value) return;
  try {
    await bookingsStore.book({
      providerId: providerId.value,
      slotId: selectedSlotId.value,
      customerName: customerName.value.trim() || "Client",
    });
    router.push({ name: "client.bookings" });
  } catch (e) {
    error.value = e?.message || "Erreur réservation";
  }
}

onMounted(load);
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-10">
    <div class="mx-auto max-w-5xl px-4 space-y-6">
      <div class="flex items-center justify-between">
        <button
          @click="router.back()"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          ← Retour
        </button>

        <div class="text-sm text-slate-500">
          Détail & réservation
        </div>
      </div>
      <div v-if="loading" class="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <p class="text-slate-600">Chargement…</p>
      </div>

      <div
        v-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {{ error }}
      </div>
      <div v-if="provider" class="grid gap-6 lg:grid-cols-3">
        <section class="lg:col-span-1 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-xl font-bold text-slate-900">{{ provider.name }}</h1>
              <p class="mt-1 text-sm text-slate-600">{{ provider.speciality }}</p>
            </div>

            <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {{ provider.city }}
            </span>
          </div>

          <div class="mt-4 space-y-2 text-sm text-slate-600">
            <div class="rounded-xl bg-slate-50 p-3">
              <div class="text-xs font-semibold text-slate-500">Adresse</div>
              <div class="text-slate-800">{{ provider.address }}</div>
            </div>

            <div class="rounded-xl bg-slate-50 p-3">
              <div class="text-xs font-semibold text-slate-500">À propos</div>
              <div class="text-slate-800">{{ provider.description }}</div>
            </div>
          </div>

          <div class="mt-5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 p-4 text-white">
            <div class="text-sm font-semibold">Réservation rapide</div>
            <div class="text-xs text-white/90 mt-1">
              Choisis un créneau disponible puis confirme.
            </div>
          </div>
        </section>
        <section class="lg:col-span-2 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Réserver un créneau</h2>
              <p class="mt-1 text-sm text-slate-600">
                Sélectionne une disponibilité et valide ton rendez-vous.
              </p>
            </div>
          </div>
          <div class="mt-6">
            <label class="text-sm font-medium text-slate-700">Nom du client</label>
            <input
              v-model="customerName"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Ton nom"
            />
          </div>
          <div class="mt-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-slate-900">Créneaux disponibles</h3>
              <span class="text-xs text-slate-500">
                {{ slots.filter(s => !s.isBooked).length }} dispo
              </span>
            </div>

            <div class="mt-3 grid gap-3 sm:grid-cols-2">
              <label
                v-for="s in slots"
                :key="s.id"
                class="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                :class="s.isBooked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'"
              >
                <div class="flex items-start gap-3">
                  <input
                    type="radio"
                    name="slot"
                    :value="s.id"
                    v-model="selectedSlotId"
                    :disabled="s.isBooked"
                    class="mt-1"
                  />

                  <div class="flex-1">
                    <div class="text-sm font-semibold text-slate-900">
                      {{ format(s.startAt) }}
                    </div>
                    <div class="text-xs text-slate-600">
                      Jusqu’à {{ format(s.endAt) }}
                    </div>

                    <div class="mt-2">
                      <span
                        v-if="s.isBooked"
                        class="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600"
                      >
                        Déjà réservé
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600"
                      >
                        Disponible
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="text-xs text-slate-500">
              En confirmant, tu ajoutes ce rendez-vous dans “Mes RDV”.
            </div>

            <button
              @click="book"
              :disabled="!selectedSlotId"
              class="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              Confirmer la réservation
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>