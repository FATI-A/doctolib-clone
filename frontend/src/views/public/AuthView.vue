<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const mode = ref("login"); // login | register
const email = ref("client@test.com");
const password = ref("demo");
const role = ref("client"); // client | provider

async function submit() {
  const payload = { email: email.value, password: password.value, role: role.value };

  if (mode.value === "login") await auth.login(payload);
  else await auth.register(payload);

  if (auth.role === "client") router.push({ name: "client.providers" });
  else router.push({ name: "landing" });
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-10">
    <div class="w-full max-w-md">
      <div class="text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold">
          D
        </div>
        <h1 class="text-2xl font-bold text-slate-900">Connexion</h1>
        <p class="mt-1 text-sm text-slate-600">
          Accède à ton espace client ou prestataire.
        </p>
      </div>

      <div class="mt-6 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
        <div class="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            @click="mode = 'login'"
            :class="mode === 'login'
              ? 'bg-white shadow-sm text-slate-900'
              : 'text-slate-600 hover:text-slate-900'"
            class="rounded-xl px-3 py-2 text-sm font-semibold transition"
          >
            Connexion
          </button>

          <button
            type="button"
            @click="mode = 'register'"
            :class="mode === 'register'
              ? 'bg-white shadow-sm text-slate-900'
              : 'text-slate-600 hover:text-slate-900'"
            class="rounded-xl px-3 py-2 text-sm font-semibold transition"
          >
            Inscription
          </button>
        </div>
        <form @submit.prevent="submit" class="mt-5 space-y-4">
          <div>
            <label class="text-sm font-medium text-slate-700">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="ex: fatiha@mail.com"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-slate-700">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="3"
              placeholder="••••••••"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label class="text-sm font-medium text-slate-700">Rôle</label>
            <div class="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="role = 'client'"
                :class="role === 'client'
                  ? 'bg-blue-600 text-white ring-1 ring-blue-600'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300'"
                class="rounded-xl px-3 py-3 text-sm font-semibold transition"
              >
                Client
              </button>

              <button
                type="button"
                @click="role = 'provider'"
                :class="role === 'provider'
                  ? 'bg-blue-600 text-white ring-1 ring-blue-600'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300'"
                class="rounded-xl px-3 py-3 text-sm font-semibold transition"
              >
                Prestataire
              </button>
            </div>

            <p class="mt-2 text-xs text-slate-500">
              Choisis <b>Client</b> pour réserver, <b>Prestataire</b> pour gérer tes créneaux.
            </p>
          </div>
          <div
            v-if="auth.error"
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ auth.error }}
          </div>
          <button
            type="submit"
            :disabled="auth.loading"
            class="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <span v-if="!auth.loading">
              {{ mode === "login" ? "Se connecter" : "Créer un compte" }}
            </span>
            <span v-else>Chargement…</span>
          </button>
          <div class="text-center text-sm text-slate-600">
            <router-link to="/" class="font-semibold text-blue-600 hover:text-blue-700">
              ← Retour à l’accueil
            </router-link>
          </div>
        </form>
      </div>
      <div class="mt-4 text-center text-xs text-slate-500">
        Astuce : tu peux utiliser <b>client@test.com</b> / <b>demo</b> pour tester rapidement.
      </div>
    </div>
  </div>
</template>