<template>
  <div class="w-full min-h-screen bg-slate-50">
    <div class="w-full px-6 md:px-16 py-12">
      
      <div class="w-full max-w-[1600px] mx-auto mb-16">
        <button @click="$router.back()" class="mb-8 flex items-center gap-2 text-slate-500 font-black hover:text-emerald-600 transition uppercase text-xs tracking-widest">
          <span>←</span> Retour aux résultats
        </button>

        <h2 class="text-4xl font-black text-slate-900 mb-10 tracking-tighter">Sélectionnez votre créneau</h2>

        <div class="flex items-center bg-white p-3 rounded-[3rem] shadow-2xl border border-slate-100 overflow-x-auto no-scrollbar gap-2">
          <div 
            v-for="day in availableDays" 
            :key="day.date"
            @click="selectDate(day.date)"
            :class="[
              'flex-1 min-w-[140px] py-8 px-4 rounded-[2.5rem] text-center cursor-pointer transition-all duration-300',
              selectedDate === day.date 
                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 scale-105' 
                : 'hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
            ]"
          >
            <p class="text-[11px] uppercase font-black tracking-[0.2em] mb-2 opacity-70">{{ day.weekday }}</p>
            <p class="text-4xl font-black leading-none">{{ day.dayNum }}</p>
            <p class="text-[11px] uppercase font-bold mt-2 opacity-70">{{ day.month }}</p>
          </div>
        </div>
      </div>

      <div class="w-full max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-12">
        <div class="xl:w-1/3">
          <div class="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl sticky top-32">
            <div class="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white text-4xl font-bold mb-10 shadow-lg">✚</div>
            <h3 class="text-3xl font-black mb-6">Résumé de la visite</h3>
            
            <div class="space-y-6">
              <div class="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
                <p class="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">Date du rendez-vous</p>
                <p class="text-3xl font-bold">{{ formatFullDate(selectedDate) }}</p>
              </div>
              <p class="text-slate-400 text-lg leading-relaxed px-4">
                Veuillez choisir l'un des créneaux disponibles à droite pour confirmer votre rendez-vous.
              </p>
            </div>
          </div>
        </div>

        <div class="xl:w-2/3">
          <div class="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-50 min-h-[600px]">
            
            <div v-if="slots.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <button 
                v-for="slot in slots" 
                :key="slot._id" 
                @click="book(slot._id, slot.startTime)"
                class="group py-12 px-6 bg-slate-50 border-2 border-slate-100 text-slate-900 font-black rounded-[3rem] hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shadow-sm hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                <span class="text-3xl block">{{ formatTime(slot.startTime) }}</span>
                <span class="text-[10px] uppercase tracking-widest mt-2 block opacity-40 group-hover:opacity-100 transition-opacity">Disponible</span>
              </button>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-32 text-center">
              <div class="text-[120px] mb-10 opacity-10">📅</div>
              <h3 class="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Complet pour ce jour</h3>
              <p class="text-slate-400 text-2xl font-medium max-w-md mx-auto">Toutes les plages horaires ont été réservées. Veuillez choisir une autre date.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';

const route = useRoute();
const router = useRouter();
const slots = ref([]);
const selectedDate = ref(new Date().toISOString().split('T')[0]);

const availableDays = computed(() => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      weekday: d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')
    });
  }
  return days;
});

const selectDate = (date) => {
  selectedDate.value = date;
  fetchSlots();
};

const fetchSlots = async () => {
  try {
    const res = await api.get(`/slots/available/${route.params.id}?date=${selectedDate.value}`);
    slots.value = res.data; 
  } catch (err) {
    console.error("Erreur fetch slots", err);
  }
};

const book = async (slotId, time) => {
  const hour = formatTime(time);
  if (confirm(`Réserver pour le ${formatFullDate(selectedDate.value)} à ${hour} ?`)) {
    try {
      await api.post('/slots/book', { slotId });
      alert("✨ Rendez-vous réservé avec succès !");
      router.push('/');
    } catch (err) {
      alert("Ce créneau n'est plus disponible.");
      fetchSlots();
    }
  }
};

const formatTime = (timeStr) => new Date(timeStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const formatFullDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

onMounted(fetchSlots);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>