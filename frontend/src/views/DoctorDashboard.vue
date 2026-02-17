<template>
  <div class="w-full min-h-screen bg-slate-50 py-12 px-6 md:px-16">
    <div class="w-full max-w-[1600px] mx-auto">
      
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
        <div>
          <h1 class="text-6xl font-black text-slate-900 tracking-tighter uppercase">Mon <span class="text-emerald-500">Agenda</span></h1>
          <p class="text-slate-500 text-xl font-bold mt-2 italic">Gestion des créneaux de consultation</p>
        </div>
        
        <div class="bg-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border border-slate-100">
          <div class="flex flex-col">
            <span class="text-[10px] font-black uppercase text-slate-400 ml-4 mb-1">Heure</span>
            <input v-model="newSlotTime" type="time" class="bg-slate-50 p-4 rounded-2xl border-none font-black text-xl outline-none focus:ring-2 ring-emerald-500" />
          </div>
          <button @click="addSlot" class="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg mt-4 uppercase text-xs">
            + Ajouter
          </button>
        </div>
      </div>

      <div class="w-full mb-12">
        <div class="flex items-center bg-white p-3 rounded-[3rem] shadow-xl border border-slate-100 overflow-x-auto no-scrollbar gap-2">
          <div 
            v-for="day in availableDays" 
            :key="day.date"
            @click="selectDate(day.date)"
            :class="[
              'flex-1 min-w-[130px] py-8 px-4 rounded-[2.5rem] text-center cursor-pointer transition-all duration-300',
              selectedDate === day.date 
                ? 'bg-slate-900 text-white shadow-xl scale-105' 
                : 'hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
            ]"
          >
            <p class="text-[10px] uppercase font-black tracking-widest mb-2 opacity-60">{{ day.weekday }}</p>
            <p class="text-4xl font-black leading-none">{{ day.dayNum }}</p>
            <p class="text-[10px] uppercase font-bold mt-2 opacity-60">{{ day.month }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        <div class="xl:col-span-7">
          <h3 class="text-2xl font-black mb-8 px-4 flex items-center gap-3">
            <span class="w-2 h-8 bg-emerald-500 rounded-full"></span> 
            Réservations du {{ formatFullDate(selectedDate) }}
          </h3>
          <div v-if="bookedSlots.length > 0" class="space-y-4">
            <div v-for="slot in bookedSlots" :key="slot._id" class="bg-white p-8 rounded-[3rem] shadow-lg border-l-[16px] border-emerald-500 flex justify-between items-center group transition-all hover:scale-[1.01]">
              <div>
                <h4 class="text-3xl font-black text-slate-900">{{ slot.patient?.name }}</h4>
                <p class="text-slate-400 font-bold italic">{{ slot.patient?.email }}</p>
              </div>
              <div class="text-right bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-3xl shadow-lg">
                {{ formatTime(slot.startTime) }}
              </div>
            </div>
          </div>
          <div v-else class="bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center text-slate-300 text-xl font-bold italic">
            Aucun rendez-vous pour ce jour.
          </div>
        </div>

        <div class="xl:col-span-5">
          <h3 class="text-2xl font-black mb-8 px-4 flex items-center gap-3">
            <span class="w-2 h-8 bg-slate-300 rounded-full"></span> 
            Créneaux libres
          </h3>
          <div v-if="freeSlots.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="slot in freeSlots" :key="slot._id" class="bg-white p-6 rounded-[2rem] shadow-md border border-slate-50 flex justify-between items-center group transition-all hover:border-red-200">
              <span class="text-slate-900 font-black text-xl">{{ formatTime(slot.startTime) }}</span>
              <button @click="removeSlot(slot._id)" class="text-red-500 opacity-0 group-hover:opacity-100 transition-all font-black bg-red-50 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white">✕</button>
            </div>
          </div>
          <div v-else class="bg-slate-100 rounded-[2.5rem] p-12 text-center text-slate-400 font-bold italic border border-slate-200">
            Aucune disponibilité créée.
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';

const allSlots = ref([]);
const newSlotTime = ref('');
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
  fetchDashboard();
};

const fetchDashboard = async () => {
  try {
    const res = await api.get(`/slots/dashboard?date=${selectedDate.value}`);
    allSlots.value = res.data;
  } catch (err) {
    console.error("Erreur Dashboard", err);
  }
};

const bookedSlots = computed(() => allSlots.value.filter(s => !s.isAvailable));
const freeSlots = computed(() => allSlots.value.filter(s => s.isAvailable));

const addSlot = async () => {
  if (!newSlotTime.value) return;
  try {
    const localDateTime = `${selectedDate.value}T${newSlotTime.value}`;
    const start = new Date(localDateTime);
    const end = new Date(start.getTime() + 30 * 60000); // +30min

    await api.post('/slots/create', { 
      startTime: start.toISOString(), 
      endTime: end.toISOString() 
    });
    
    newSlotTime.value = '';
    fetchDashboard();
  } catch (err) { alert("Erreur d'ajout"); }
};

const removeSlot = async (id) => {
  if (confirm("Supprimer ?")) {
    await api.delete(`/slots/${id}`);
    fetchDashboard();
  }
};

const formatTime = (s) => new Date(s).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const formatFullDate = (d) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

onMounted(fetchDashboard);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>