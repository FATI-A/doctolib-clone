<template>
  <div class="w-full min-h-screen bg-slate-50 py-16 px-6 md:px-16">
    <div class="w-full max-w-[1400px] mx-auto">
      <h2 class="text-5xl font-black text-slate-900 mb-12 tracking-tighter uppercase">Mes <span class="text-emerald-500">Rendez-vous</span></h2>

      <div v-if="appointments.length > 0" class="space-y-6">
        <div v-for="app in appointments" :key="app._id" class="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col md:flex-row justify-between items-center group transition-all">
          <div class="flex items-center gap-8">
            <div class="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl font-bold italic">✚</div>
            <div>
              <p class="text-emerald-500 font-black text-xs uppercase tracking-widest mb-1">{{ app.doctor.specialty }}</p>
              <h3 class="text-3xl font-black text-slate-900">{{ app.doctor.name }}</h3>
              <p class="text-slate-400 font-bold italic">📍 {{ app.doctor.city }}</p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row items-center gap-12 mt-8 md:mt-0">
            <div class="text-center md:text-right">
              <p class="text-slate-900 font-black text-2xl">{{ formatDate(app.startTime) }}</p>
              <p class="text-emerald-500 font-black text-4xl">{{ formatTime(app.startTime) }}</p>
            </div>
            <button @click="cancel(app._id)" class="bg-red-50 text-red-500 px-12 py-5 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-xs">
              Annuler
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-40 bg-white rounded-[4rem] border border-slate-100 shadow-inner">
        <p class="text-slate-300 text-9xl mb-8 opacity-20">📅</p>
        <h3 class="text-3xl font-black text-slate-900">Aucun rendez-vous</h3>
        <button @click="$router.push('/')" class="mt-8 bg-emerald-500 text-white px-12 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all">Prendre un rendez-vous</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const appointments = ref([]);

const fetchAppointments = async () => {
  try {
    const res = await api.get('/slots/my-appointments');
    appointments.value = res.data;
  } catch (err) { console.error(err); }
};

const cancel = async (id) => {
  if (confirm("Annuler ce rendez-vous ?")) {
    await api.put(`/slots/cancel/${id}`);
    fetchAppointments();
  }
};

const formatDate = (s) => new Date(s).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const formatTime = (s) => new Date(s).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

onMounted(fetchAppointments);
</script>