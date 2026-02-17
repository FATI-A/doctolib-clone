<template>
  <div v-if="auth.role !== 'doctor'" class="w-full min-h-screen">
    <div class="w-full bg-emerald-900 py-24 px-6 md:px-16 shadow-2xl relative">
      <div class="w-full max-w-[1600px] mx-auto relative z-10">
        <h1 class="text-5xl md:text-7xl font-black text-white mb-12 tracking-tighter">
          TROUVEZ UN <span class="text-emerald-400">PRATICIEN.</span>
        </h1>

        <div class="flex flex-col lg:flex-row bg-white p-4 rounded-[2rem] shadow-2xl gap-4 w-full">
          <div class="flex-1 flex items-center border-b lg:border-b-0 lg:border-r border-slate-100 px-4">
            <span class="text-3xl mr-3">🔍</span>
            <input v-model="searchSpecialty" type="text" placeholder="Spécialité..." class="w-full py-5 outline-none text-slate-900 text-2xl font-bold" @keyup.enter="handleSearch" />
          </div>
          <div class="flex-1 flex items-center px-4">
            <span class="text-3xl mr-3">📍</span>
            <input v-model="searchCity" type="text" placeholder="Ville..." class="w-full py-5 outline-none text-slate-900 text-2xl font-bold" @keyup.enter="handleSearch" />
          </div>
          <button @click="handleSearch" class="bg-emerald-500 text-white px-16 py-6 rounded-2xl font-black hover:bg-emerald-400 transition-all text-2xl shadow-xl active:scale-95">RECHERCHER</button>
        </div>
      </div>
    </div>

    <div class="w-full px-6 md:px-16 py-16 bg-slate-50">
      
      <div v-if="doctors.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
        <div v-for="doc in doctors" :key="doc._id" class="bg-white border border-slate-200 p-10 rounded-[3rem] hover:shadow-2xl transition-all flex flex-col justify-between group">
          <div>
            <span class="bg-emerald-100 text-emerald-700 text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest">{{ doc.specialty }}</span>
            <h2 class="text-3xl font-black text-slate-900 mt-6 group-hover:text-emerald-600 transition-colors">{{ doc.name }}</h2>
            <p class="text-slate-500 text-xl font-bold italic mt-2">📍 {{ doc.city }}</p>
          </div>
          <button @click="$router.push(`/doctor/${doc._id}`)" class="w-full mt-10 bg-slate-900 text-white py-6 rounded-2xl font-black hover:bg-emerald-500 transition-all shadow-lg">VOIR DISPOS</button>
        </div>
      </div>

      <div v-else-if="hasSearched" class="w-full flex flex-col items-center justify-center py-20 bg-white rounded-[4rem] border-2 border-dashed border-slate-200 shadow-inner">
        <div class="text-9xl mb-8 opacity-20 grayscale">🏥</div>
        <h2 class="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Oups ! Aucun praticien trouvé.</h2>
        <p class="text-slate-400 text-2xl font-medium max-w-xl text-center">
          Nous n'avons pas trouvé de médecin correspondant à votre recherche pour <span class="text-emerald-600 font-bold">"{{ searchSpecialty || 'toutes spécialités' }}"</span> à <span class="text-emerald-600 font-bold">"{{ searchCity || 'toute la France' }}"</span>.
        </p>
        <button @click="resetSearch" class="mt-10 text-emerald-600 font-black text-sm uppercase tracking-widest hover:underline">
          Réinitialiser les filtres
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import api from '../api';

const auth = useAuthStore();
const router = useRouter();
const searchCity = ref('');
const searchSpecialty = ref('');
const doctors = ref([]);
const hasSearched = ref(false);

const handleSearch = async () => {
  try {
    const params = new URLSearchParams();
    if (searchSpecialty.value) params.append('specialty', searchSpecialty.value);
    if (searchCity.value) params.append('city', searchCity.value);
    
    const res = await api.get(`/auth/doctors?${params.toString()}`);
    doctors.value = res.data;
    hasSearched.value = true; 
  } catch (err) {
    console.error("Erreur de recherche", err);
  }
};

const resetSearch = () => {
  searchCity.value = '';
  searchSpecialty.value = '';
  handleSearch();
};

onMounted(() => {
  if (auth.role === 'doctor') {
    router.push('/dashboard');
  } else {
    handleSearch();
  }
});
</script>

<style scoped>
.grid-enter-active, .grid-leave-active {
  transition: all 0.5s ease;
}
</style>