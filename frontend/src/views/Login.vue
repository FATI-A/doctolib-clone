<template>
  <div class="min-h-[90vh] w-full flex items-center justify-center bg-slate-50 px-6">
    <div class="w-full max-w-2xl bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-100">
      <div class="text-center mb-12">
        <h2 class="text-5xl font-black text-slate-900 mb-4 tracking-tighter">CONNEXION</h2>
        <p class="text-slate-400 text-xl font-medium uppercase tracking-widest">Espace Patient</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-8">
        <div>
          <label class="block text-slate-900 font-black text-sm uppercase tracking-widest mb-3 ml-4">Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="votre@email.com" 
            class="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900 font-bold text-2xl" 
          />
        </div>
        <div>
          <label class="block text-slate-900 font-black text-sm uppercase tracking-widest mb-3 ml-4">Mot de passe</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            class="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900 font-bold text-2xl" 
          />
        </div>
        <button class="w-full bg-emerald-500 text-white py-7 rounded-3xl font-black text-2xl hover:bg-emerald-600 shadow-2xl shadow-emerald-200 transition-all mt-6 active:scale-95">
          ACCÉDER À MON COMPTE
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await auth.login({ email: email.value, password: password.value });
    router.push('/');
  } catch (err) { alert("Identifiants incorrects"); }
};
</script>