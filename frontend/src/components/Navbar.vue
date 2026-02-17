<template>
  <nav class="bg-white/95 border-b border-slate-100 sticky top-0 z-50 w-full shadow-sm">
    <div class="w-full px-6 md:px-16 h-24 flex justify-between items-center">
      
      <router-link :to="auth.role === 'doctor' ? '/dashboard' : '/'" class="flex items-center gap-4">
        <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">✚</div>
        <span class="text-slate-900 text-2xl font-black uppercase">SANTE<span class="text-emerald-500">DIRECT</span></span>
      </router-link>

      <div class="flex items-center gap-10">
        <template v-if="!auth.token">
          <router-link to="/login" class="text-slate-900 font-black text-xs uppercase tracking-widest hover:text-emerald-600 transition">Connexion</router-link>
          <router-link to="/login" class="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl">Prendre RDV</router-link>
        </template>

        <template v-else>
          <div class="flex items-center gap-8 border-r border-slate-100 pr-8">
            <template v-if="auth.role === 'doctor'">
              <router-link to="/dashboard" class="text-slate-900 font-black text-xs uppercase tracking-widest text-emerald-600">Mon Agenda</router-link>
            </template>
            <template v-else>
              <router-link to="/my-appointments" class="text-slate-900 font-black text-xs uppercase tracking-widest hover:text-emerald-600 transition">Mes RDV</router-link>
              <router-link to="/" class="text-slate-900 font-black text-xs uppercase tracking-widest hover:text-emerald-600 transition">Rechercher</router-link>
            </template>
          </div>

          <div class="flex items-center gap-4 bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl">
            <div class="flex flex-col text-right">
              <span class="text-emerald-900 font-black text-sm leading-none">{{ auth.user?.name }}</span>
              <span class="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-1">{{ auth.role }}</span>
            </div>
            <button @click="auth.logout(); $router.push('/login')" class="w-8 h-8 bg-white rounded-lg text-red-500 shadow-sm flex items-center justify-center font-bold">✕</button>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
const auth = useAuthStore();
</script>